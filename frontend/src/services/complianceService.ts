/**
 * Compliance Service
 * Handles all compliance-related data operations and API calls
 */

import {
  ComplianceRequirement,
  ComplianceSearchParams,
  ComplianceSearchResult,
  BOERecord,
  BOEStatus,
  License,
  LicenseStatus,
  ComplianceNotification,
  NotificationPriority,
  ComplianceStats,
  ApplicationGuide,
  ApplicationStep,
  LicenseFee
} from '@/types/compliance';

import {
  complianceDatabase,
  searchComplianceRequirements,
  getRequirementByHSN,
  getRequirementsByCategory,
  getAllCategories,
  getAllHSNCodes
} from '@/data/complianceDatabase';

const isBrowser = typeof window !== 'undefined';

// LocalStorage keys
const STORAGE_KEYS = {
  BOE_RECORDS: 'befach-boe-records',
  LICENSES: 'befach-licenses',
  NOTIFICATIONS: 'befach-compliance-notifications',
  SEARCH_HISTORY: 'befach-compliance-search-history'
};

/**
 * Search compliance requirements
 */
export async function searchCompliance(
  params: ComplianceSearchParams
): Promise<ComplianceSearchResult> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let results: ComplianceRequirement[] = [];

    if (params.query) {
      results = searchComplianceRequirements(params.query);
    } else if (params.hsnCode) {
      const requirement = getRequirementByHSN(params.hsnCode);
      results = requirement ? [requirement] : [];
    } else if (params.category) {
      results = getRequirementsByCategory(params.category);
    } else {
      results = complianceDatabase;
    }

    // Apply additional filters
    if (params.countryOfOrigin) {
      results = results.filter(req =>
        req.dutyRates.preferentialRates?.some(
          rate => rate.country.toLowerCase() === params.countryOfOrigin?.toLowerCase()
        )
      );
    }

    // Save to search history
    saveSearchToHistory(params);

    // Generate suggestions based on partial matches
    const suggestions = generateSearchSuggestions(params.query || '');

    return {
      requirements: results,
      totalCount: results.length,
      page: 1,
      pageSize: 10,
      suggestions
    };
  } catch (error) {
    console.error('Search compliance error:', error);
    throw new Error('Failed to search compliance requirements');
  }
}

/**
 * Get compliance requirement by ID
 */
export async function getComplianceRequirement(id: string): Promise<ComplianceRequirement | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return complianceDatabase.find(req => req.id === id) || null;
  } catch (error) {
    console.error('Get compliance requirement error:', error);
    throw new Error('Failed to get compliance requirement');
  }
}

/**
 * Create a new BOE record
 */
export async function createBOE(boeData: Partial<BOERecord>): Promise<BOERecord> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newBOE: BOERecord = {
      id: `BOE-${Date.now()}`,
      boeNumber: generateBOENumber(),
      boeDate: new Date(),
      status: BOEStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...boeData
    } as BOERecord;

    // Save to localStorage
    const existingBOEs = getBOERecords();
    existingBOEs.unshift(newBOE);
    if (isBrowser) localStorage.setItem(STORAGE_KEYS.BOE_RECORDS, JSON.stringify(existingBOEs));

    // Create notification
    createNotification({
      type: 'System Update',
      priority: NotificationPriority.LOW,
      title: 'BOE Created',
      message: `BOE ${newBOE.boeNumber} has been created successfully`,
      actionRequired: false
    });

    return newBOE;
  } catch (error) {
    console.error('Create BOE error:', error);
    throw new Error('Failed to create BOE record');
  }
}

/**
 * Update BOE record
 */
export async function updateBOE(id: string, updates: Partial<BOERecord>): Promise<BOERecord> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    const boeRecords = getBOERecords();
    const index = boeRecords.findIndex(boe => boe.id === id);

    if (index === -1) {
      throw new Error('BOE record not found');
    }

    const updatedBOE = {
      ...boeRecords[index],
      ...updates,
      updatedAt: new Date()
    };

    boeRecords[index] = updatedBOE;
    if (isBrowser) localStorage.setItem(STORAGE_KEYS.BOE_RECORDS, JSON.stringify(boeRecords));

    // Create notification for status changes
    if (updates.status && updates.status !== boeRecords[index].status) {
      createNotification({
        type: 'System Update',
        priority: NotificationPriority.MEDIUM,
        title: 'BOE Status Updated',
        message: `BOE ${updatedBOE.boeNumber} status changed to ${updates.status}`,
        actionRequired: updates.status === BOEStatus.QUERY_RAISED,
        actionUrl: `/compliance-tools/boe/${id}`
      });
    }

    return updatedBOE;
  } catch (error) {
    console.error('Update BOE error:', error);
    throw new Error('Failed to update BOE record');
  }
}

/**
 * Get all BOE records
 */
export function getBOERecords(): BOERecord[] {
  if (!isBrowser) return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOE_RECORDS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Get BOE records error:', error);
    return [];
  }
}

/**
 * Get BOE record by ID
 */
export async function getBOEById(id: string): Promise<BOERecord | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    const boeRecords = getBOERecords();
    return boeRecords.find(boe => boe.id === id) || null;
  } catch (error) {
    console.error('Get BOE by ID error:', error);
    return null;
  }
}

/**
 * Get user's licenses
 */
export function getLicenses(): License[] {
  try {
    const stored = isBrowser ? localStorage.getItem(STORAGE_KEYS.LICENSES) : null;
    if (stored) {
      return JSON.parse(stored);
    }

    // Return some sample licenses for demo
    return [
      {
        id: 'user-lic-001',
        licenseNumber: 'IEC-2024-00456',
        type: 'IEC',
        name: 'Import Export Code',
        description: 'Basic license for international trade',
        issuingAuthority: 'DGFT',
        status: LicenseStatus.ACTIVE,
        issueDate: new Date('2024-01-01'),
        expiryDate: new Date('2029-12-31'),
        validityPeriod: 1825,
        renewalRequired: false,
        conditions: ['Valid PAN required', 'Bank account verification completed']
      },
      {
        id: 'user-lic-002',
        licenseNumber: 'FSSAI-IMP-2024-0789',
        type: 'FSSAI Import License',
        name: 'Food Import License',
        description: 'License for importing food products',
        issuingAuthority: 'FSSAI',
        status: LicenseStatus.PENDING_RENEWAL,
        issueDate: new Date('2023-03-01'),
        expiryDate: new Date('2025-02-28'),
        validityPeriod: 730,
        renewalRequired: true,
        renewalPeriod: 180
      }
    ];
  } catch (error) {
    console.error('Get licenses error:', error);
    return [];
  }
}

/**
 * Apply for a new license
 */
export async function applyForLicense(licenseType: string): Promise<ApplicationGuide> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate application guide based on license type
    const guide = generateApplicationGuide(licenseType);

    // Create notification
    createNotification({
      type: 'License Expiry',
      priority: NotificationPriority.HIGH,
      title: 'License Application Started',
      message: `Application process for ${licenseType} has been initiated`,
      actionRequired: true,
      actionUrl: '/compliance-tools/licenses/apply'
    });

    return guide;
  } catch (error) {
    console.error('Apply for license error:', error);
    throw new Error('Failed to initiate license application');
  }
}

/**
 * Get compliance statistics
 */
export async function getComplianceStats(): Promise<ComplianceStats> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));

    const licenses = getLicenses();
    const boeRecords = getBOERecords();
    const notifications = getNotifications();

    // Calculate statistics
    const activeLicenses = licenses.filter(l => l.status === LicenseStatus.ACTIVE).length;
    const expiringLicenses = licenses.filter(l => {
      if (!l.expiryDate) return false;
      const daysToExpiry = Math.floor(
        (new Date(l.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysToExpiry <= 30 && daysToExpiry > 0;
    }).length;

    const pendingBOEs = boeRecords.filter(
      boe => boe.status === BOEStatus.FILED || boe.status === BOEStatus.UNDER_ASSESSMENT
    ).length;

    const clearedBOEs = boeRecords.filter(
      boe => boe.status === BOEStatus.CLEARED
    ).length;

    // Calculate average clearance time
    const clearedWithDates = boeRecords.filter(
      boe => boe.status === BOEStatus.CLEARED && boe.clearanceDate
    );
    const avgClearanceTime = clearedWithDates.length > 0
      ? clearedWithDates.reduce((acc, boe) => {
          const clearanceTime = Math.floor(
            (new Date(boe.clearanceDate!).getTime() - new Date(boe.boeDate).getTime()) /
            (1000 * 60 * 60 * 24)
          );
          return acc + clearanceTime;
        }, 0) / clearedWithDates.length
      : 0;

    // Calculate compliance score (0-100)
    let complianceScore = 100;
    complianceScore -= expiringLicenses * 10;
    complianceScore -= pendingBOEs * 5;
    complianceScore = Math.max(0, Math.min(100, complianceScore));

    // Get upcoming renewals
    const upcomingRenewals = licenses.filter(l => {
      if (!l.expiryDate || !l.renewalRequired) return false;
      const daysToExpiry = Math.floor(
        (new Date(l.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysToExpiry <= (l.renewalPeriod || 30) && daysToExpiry > 0;
    });

    return {
      totalLicenses: licenses.length,
      activeLicenses,
      expiringLicenses,
      totalBOEs: boeRecords.length,
      pendingBOEs,
      clearedBOEs,
      averageClearanceTime: avgClearanceTime,
      complianceScore,
      upcomingRenewals,
      recentNotifications: notifications.slice(0, 5)
    };
  } catch (error) {
    console.error('Get compliance stats error:', error);
    throw new Error('Failed to get compliance statistics');
  }
}

/**
 * Get notifications
 */
export function getNotifications(): ComplianceNotification[] {
  if (!isBrowser) return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Get notifications error:', error);
    return [];
  }
}

/**
 * Create a notification
 */
export function createNotification(
  notification: Omit<ComplianceNotification, 'id' | 'createdAt'>
): ComplianceNotification {
  const newNotification: ComplianceNotification = {
    id: `notif-${Date.now()}`,
    createdAt: new Date(),
    ...notification
  };

  const notifications = getNotifications();
  notifications.unshift(newNotification);
  if (isBrowser) localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications.slice(0, 50)));

  return newNotification;
}

/**
 * Dismiss a notification
 */
export function dismissNotification(id: string): void {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === id);

  if (index !== -1) {
    notifications[index].dismissedAt = new Date();
    if (isBrowser) localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
}

/**
 * Mark notification as read
 */
export function markNotificationAsRead(id: string): void {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === id);

  if (index !== -1) {
    notifications[index].readAt = new Date();
    if (isBrowser) localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
}

// Helper functions

function generateBOENumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `BOE${year}${random}`;
}

function saveSearchToHistory(params: ComplianceSearchParams): void {
  if (!isBrowser) return;
  try {
    const history = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    const searches = history ? JSON.parse(history) : [];
    searches.unshift({ ...params, timestamp: new Date() });
    localStorage.setItem(
      STORAGE_KEYS.SEARCH_HISTORY,
      JSON.stringify(searches.slice(0, 20))
    );
  } catch (error) {
    console.error('Save search history error:', error);
  }
}

function generateSearchSuggestions(query: string): string[] {
  if (!query || query.length < 2) return [];

  const allHSNCodes = getAllHSNCodes();
  const suggestions: string[] = [];

  // Add HSN code matches
  allHSNCodes.forEach(item => {
    if (item.code.includes(query) || item.description.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push(`${item.code} - ${item.description.substring(0, 50)}...`);
    }
  });

  return suggestions.slice(0, 5);
}

function generateApplicationGuide(licenseType: string): ApplicationGuide {
  // This would typically come from a database or API
  const baseGuide: ApplicationGuide = {
    licenseType,
    estimatedTime: '15-30 working days',
    fees: [
      {
        type: 'Application',
        amount: 5000,
        currency: 'INR',
        description: 'Non-refundable application fee'
      },
      {
        type: 'Processing',
        amount: 10000,
        currency: 'INR',
        description: 'Processing and verification fee'
      }
    ],
    requiredDocuments: [],
    helpfulLinks: [
      {
        title: 'Official Application Portal',
        url: 'https://dgft.gov.in',
        description: 'DGFT online services portal'
      },
      {
        title: 'Help Documentation',
        url: 'https://dgft.gov.in/help',
        description: 'Step-by-step guides and FAQs'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Registration',
        description: 'Register on the DGFT portal',
        subSteps: [
          'Visit the DGFT website',
          'Click on "New User Registration"',
          'Fill in company details',
          'Verify email and mobile number'
        ],
        estimatedTime: '30 minutes'
      },
      {
        stepNumber: 2,
        title: 'Application Form',
        description: 'Fill the online application form',
        subSteps: [
          'Login to your account',
          'Select license type',
          'Fill all required fields',
          'Upload scanned documents'
        ],
        estimatedTime: '1-2 hours'
      },
      {
        stepNumber: 3,
        title: 'Payment',
        description: 'Pay application fees online',
        subSteps: [
          'Review fee details',
          'Select payment method',
          'Complete payment',
          'Save payment receipt'
        ],
        estimatedTime: '15 minutes'
      },
      {
        stepNumber: 4,
        title: 'Submission',
        description: 'Submit application for processing',
        subSteps: [
          'Review all entered information',
          'Digitally sign the application',
          'Submit for processing',
          'Note down application number'
        ],
        estimatedTime: '15 minutes'
      },
      {
        stepNumber: 5,
        title: 'Track Status',
        description: 'Monitor application progress',
        subSteps: [
          'Check status regularly',
          'Respond to queries if any',
          'Download license when approved'
        ],
        estimatedTime: 'Ongoing'
      }
    ]
  };

  return baseGuide;
}

// Export all helper functions for components
export {
  getAllCategories,
  getAllHSNCodes,
  getRequirementByHSN,
  getRequirementsByCategory
};