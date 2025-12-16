/**
 * Compliance Tools Type Definitions
 * Core interfaces for managing trade compliance, licensing, and documentation
 */

// Enums for status tracking
export enum LicenseStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  PENDING_RENEWAL = 'Pending Renewal',
  SUSPENDED = 'Suspended',
  APPLIED = 'Applied',
  REJECTED = 'Rejected'
}

export enum BOEStatus {
  DRAFT = 'Draft',
  FILED = 'Filed',
  UNDER_ASSESSMENT = 'Under Assessment',
  QUERY_RAISED = 'Query Raised',
  CLEARED = 'Cleared',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled'
}

export enum DocumentCategory {
  LICENSE = 'License',
  CERTIFICATE = 'Certificate',
  PERMIT = 'Permit',
  DECLARATION = 'Declaration',
  INVOICE = 'Invoice',
  PACKING_LIST = 'Packing List',
  BILL_OF_LADING = 'Bill of Lading',
  CERTIFICATE_OF_ORIGIN = 'Certificate of Origin',
  INSURANCE = 'Insurance',
  OTHER = 'Other'
}

export enum NotificationPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

// Core Compliance Interfaces
export interface ComplianceRequirement {
  id: string;
  hsnCode: string;
  productDescription: string;
  categoryCode?: string;
  licenses: License[];
  certificates: Certificate[];
  permits: string[];
  dutyRates: DutyRates;
  requiredDocuments: RequiredDocument[];
  restrictions?: TradeRestriction[];
  specialConditions?: string[];
  lastUpdated: Date;
  source: 'DGFT' | 'ICEGATE' | 'CBIC' | 'Manual';
}

export interface License {
  id: string;
  licenseNumber?: string;
  type: string;
  name: string;
  description: string;
  issuingAuthority: string;
  status: LicenseStatus;
  issueDate?: Date;
  expiryDate?: Date;
  validityPeriod?: number; // in days
  renewalRequired: boolean;
  renewalPeriod?: number; // days before expiry
  documents?: Document[];
  fees?: LicenseFee[];
  conditions?: string[];
  linkedHSNCodes?: string[];
  applicationUrl?: string;
  processingTime?: string; // e.g., "15-20 working days"
}

export interface Certificate {
  id: string;
  certificateNumber?: string;
  type: string;
  name: string;
  description: string;
  issuingAuthority: string;
  validFrom?: Date;
  validUntil?: Date;
  documentUrl?: string;
  verificationUrl?: string;
  mandatory: boolean;
  linkedProducts?: string[];
}

export interface DutyRates {
  bcd: number; // Basic Customs Duty
  igst: number; // Integrated GST
  socialWelfareSurcharge: number;
  compensationCess?: number;
  antidumpingDuty?: number;
  countervailingDuty?: number;
  safeguardDuty?: number;
  totalDuty?: number;
  preferentialRates?: PreferentialRate[];
  effectiveDate: Date;
}

export interface PreferentialRate {
  country: string;
  agreementName: string; // FTA/CEPA name
  rate: number;
  conditions?: string[];
}

export interface RequiredDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  description: string;
  mandatory: boolean;
  templateUrl?: string;
  sampleUrl?: string;
  instructions?: string[];
  alternativeDocuments?: string[];
}

export interface TradeRestriction {
  type: 'Prohibition' | 'Restriction' | 'Licensing' | 'Quota';
  description: string;
  applicableCountries?: string[];
  conditions?: string[];
  exemptions?: string[];
}

// BOE (Bill of Entry) Management
export interface BOERecord {
  id: string;
  boeNumber: string;
  boeDate: Date;
  portCode: string;
  portName: string;
  importerDetails: ImporterDetails;
  consignmentDetails: ConsignmentDetails;
  items: BOEItem[];
  documents: BOEDocument[];
  dutyDetails: BOEDutyDetails;
  status: BOEStatus;
  assessmentOfficer?: string;
  queries?: BOEQuery[];
  clearanceDate?: Date;
  gatePassNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  filingType: 'Home Consumption' | 'Warehousing' | 'Ex-Bond';
}

export interface ImporterDetails {
  iecCode: string;
  name: string;
  address: string;
  gstin: string;
  adCode?: string; // Authorized Dealer Code
  panNumber: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
}

export interface ConsignmentDetails {
  invoiceNumber: string;
  invoiceDate: Date;
  invoiceValue: number;
  currency: string;
  exchangeRate: number;
  countryOfOrigin: string;
  countryOfConsignment: string;
  portOfShipment: string;
  shippingBillNumber?: string;
  blNumber?: string; // Bill of Lading
  blDate?: Date;
  vesselName?: string;
  rotation?: string;
  lineNumber?: string;
  packagesCount: number;
  grossWeight: number;
  netWeight: number;
  weightUnit: string;
}

export interface BOEItem {
  serialNumber: number;
  hsnCode: string;
  productDescription: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  countryOfOrigin: string;
  dutyDetails: ItemDutyDetails;
  licenses?: string[];
  certificates?: string[];
  notifications?: string[];
}

export interface ItemDutyDetails {
  assessableValue: number;
  bcdRate: number;
  bcdAmount: number;
  igstRate: number;
  igstAmount: number;
  swsRate: number;
  swsAmount: number;
  cessAmount?: number;
  antidumpingDuty?: number;
  safeguardDuty?: number;
  totalDuty: number;
}

export interface BOEDocument {
  id: string;
  type: DocumentCategory;
  documentNumber: string;
  issueDate?: Date;
  issuingAuthority?: string;
  fileUrl?: string;
  uploaded: boolean;
  verified: boolean;
  remarks?: string;
}

export interface BOEDutyDetails {
  totalAssessableValue: number;
  totalBCD: number;
  totalIGST: number;
  totalSWS: number;
  totalCess?: number;
  otherDuties?: number;
  totalDutyPayable: number;
  dutyPaid: boolean;
  paymentDate?: Date;
  challanNumber?: string;
}

export interface BOEQuery {
  id: string;
  queryDate: Date;
  queryText: string;
  raisedBy: string;
  responseRequired: boolean;
  responseDate?: Date;
  responseText?: string;
  resolved: boolean;
  documents?: string[];
}

// License Fee Structure
export interface LicenseFee {
  type: 'Application' | 'Processing' | 'Renewal' | 'Amendment';
  amount: number;
  currency: string;
  description?: string;
  paymentModes?: string[];
}

// Application Guidance
export interface ApplicationGuide {
  licenseType: string;
  steps: ApplicationStep[];
  estimatedTime: string;
  fees: LicenseFee[];
  requiredDocuments: RequiredDocument[];
  helpfulLinks: HelpfulLink[];
  faqs?: FAQ[];
  tips?: string[];
}

export interface ApplicationStep {
  stepNumber: number;
  title: string;
  description: string;
  subSteps?: string[];
  documents?: string[];
  onlineUrl?: string;
  offlineProcess?: string;
  estimatedTime?: string;
  tips?: string[];
}

export interface HelpfulLink {
  title: string;
  url: string;
  description?: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

// Notification System
export interface ComplianceNotification {
  id: string;
  type: 'License Expiry' | 'Regulation Change' | 'Duty Rate Update' | 'Document Renewal' | 'Query Raised' | 'System Update';
  priority: NotificationPriority;
  title: string;
  message: string;
  affectedItems?: string[]; // HSN codes, license numbers, etc.
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: Date;
  readAt?: Date;
  dismissedAt?: Date;
}

// Search and Filter Types
export interface ComplianceSearchParams {
  query?: string; // HSN code or product description
  hsnCode?: string;
  category?: string;
  licenseType?: string;
  countryOfOrigin?: string;
  portCode?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ComplianceSearchResult {
  requirements: ComplianceRequirement[];
  totalCount: number;
  page: number;
  pageSize: number;
  suggestions?: string[];
}

// Statistics and Analytics
export interface ComplianceStats {
  totalLicenses: number;
  activeLicenses: number;
  expiringLicenses: number;
  totalBOEs: number;
  pendingBOEs: number;
  clearedBOEs: number;
  averageClearanceTime: number; // in days
  complianceScore: number; // 0-100
  upcomingRenewals: License[];
  recentNotifications: ComplianceNotification[];
}

// Export types for component props
export interface ComplianceContextValue {
  searchResults: ComplianceSearchResult | null;
  selectedRequirement: ComplianceRequirement | null;
  licenses: License[];
  boeRecords: BOERecord[];
  notifications: ComplianceNotification[];
  stats: ComplianceStats | null;
  isLoading: boolean;
  error: string | null;
  searchCompliance: (params: ComplianceSearchParams) => Promise<void>;
  selectRequirement: (requirement: ComplianceRequirement) => void;
  createBOE: (boe: Partial<BOERecord>) => Promise<BOERecord>;
  updateBOE: (id: string, updates: Partial<BOERecord>) => Promise<BOERecord>;
  applyForLicense: (licenseType: string) => Promise<void>;
  dismissNotification: (id: string) => void;
}