/**
 * Mock Compliance Database
 * Sample HSN codes with compliance requirements for testing
 */

import {
  ComplianceRequirement,
  LicenseStatus,
  DocumentCategory,
  License,
  Certificate,
  RequiredDocument,
  TradeRestriction
} from '@/types/compliance';

// Sample licenses for different categories
const sampleLicenses: Record<string, License[]> = {
  electronics: [
    {
      id: 'lic-001',
      licenseNumber: 'WPC-2024-00123',
      type: 'WPC License',
      name: 'Wireless Planning & Coordination License',
      description: 'Required for import of wireless equipment operating in specific frequency bands',
      issuingAuthority: 'Ministry of Communications (WPC Wing)',
      status: LicenseStatus.ACTIVE,
      issueDate: new Date('2024-01-15'),
      expiryDate: new Date('2025-01-14'),
      validityPeriod: 365,
      renewalRequired: true,
      renewalPeriod: 30,
      applicationUrl: 'https://saralsanchar.gov.in',
      processingTime: '15-20 working days',
      fees: [
        { type: 'Application', amount: 10000, currency: 'INR' },
        { type: 'Processing', amount: 5000, currency: 'INR' }
      ],
      conditions: [
        'Equipment must meet Indian technical standards',
        'Valid test certificates required',
        'Regular compliance reporting mandatory'
      ]
    },
    {
      id: 'lic-002',
      type: 'BIS Registration',
      name: 'Bureau of Indian Standards Registration',
      description: 'Mandatory for specified electronic goods under CRS',
      issuingAuthority: 'Bureau of Indian Standards',
      status: LicenseStatus.ACTIVE,
      renewalRequired: true,
      renewalPeriod: 60,
      applicationUrl: 'https://www.crsbis.in',
      processingTime: '7-10 working days'
    }
  ],
  textiles: [
    {
      id: 'lic-003',
      type: 'Textile Committee Registration',
      name: 'Quality Compliance Certificate',
      description: 'Required for import of specified textile products',
      issuingAuthority: 'Textile Committee, Ministry of Textiles',
      status: LicenseStatus.ACTIVE,
      renewalRequired: true,
      renewalPeriod: 45,
      processingTime: '10-15 working days'
    }
  ],
  chemicals: [
    {
      id: 'lic-004',
      type: 'CPCB NOC',
      name: 'Central Pollution Control Board NOC',
      description: 'Required for import of hazardous chemicals',
      issuingAuthority: 'Central Pollution Control Board',
      status: LicenseStatus.ACTIVE,
      renewalRequired: true,
      renewalPeriod: 90,
      applicationUrl: 'https://cpcb.nic.in',
      processingTime: '30-45 working days',
      conditions: [
        'Environmental impact assessment required',
        'Proper storage facilities mandatory',
        'Waste disposal plan required'
      ]
    }
  ],
  food: [
    {
      id: 'lic-005',
      licenseNumber: 'FSSAI-IMP-2024-0456',
      type: 'FSSAI Import License',
      name: 'Food Safety Import License',
      description: 'Mandatory for import of food products',
      issuingAuthority: 'Food Safety and Standards Authority of India',
      status: LicenseStatus.ACTIVE,
      issueDate: new Date('2024-02-01'),
      expiryDate: new Date('2029-01-31'),
      validityPeriod: 1825,
      renewalRequired: true,
      renewalPeriod: 180,
      applicationUrl: 'https://foscos.fssai.gov.in',
      processingTime: '7-10 working days'
    },
    {
      id: 'lic-006',
      type: 'Plant Quarantine Certificate',
      name: 'Phytosanitary Certificate',
      description: 'Required for import of plant-based food products',
      issuingAuthority: 'Plant Quarantine Organization of India',
      status: LicenseStatus.ACTIVE,
      renewalRequired: false,
      processingTime: '3-5 working days'
    }
  ],
  pharmaceuticals: [
    {
      id: 'lic-007',
      type: 'Drug Import License',
      name: 'Form 10 License',
      description: 'Required for import of drugs and pharmaceuticals',
      issuingAuthority: 'Central Drugs Standard Control Organization',
      status: LicenseStatus.ACTIVE,
      renewalRequired: true,
      renewalPeriod: 90,
      applicationUrl: 'https://cdscoonline.gov.in',
      processingTime: '60-90 working days',
      conditions: [
        'WHO-GMP certification required',
        'Drug registration certificate mandatory',
        'Batch-wise testing may be required'
      ]
    }
  ]
};

// Sample certificates
const sampleCertificates: Record<string, Certificate[]> = {
  general: [
    {
      id: 'cert-001',
      certificateNumber: 'COO-2024-1234',
      type: 'Certificate of Origin',
      name: 'Non-Preferential Certificate of Origin',
      description: 'Document certifying the country of manufacture',
      issuingAuthority: 'Chamber of Commerce',
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      mandatory: true,
      verificationUrl: 'https://verification.example.com'
    },
    {
      id: 'cert-002',
      type: 'Insurance Certificate',
      name: 'Marine Insurance Certificate',
      description: 'Insurance coverage for goods during transit',
      issuingAuthority: 'Insurance Company',
      mandatory: true
    }
  ],
  quality: [
    {
      id: 'cert-003',
      type: 'Quality Certificate',
      name: 'ISO Quality Certificate',
      description: 'International quality standards certification',
      issuingAuthority: 'ISO Certification Body',
      mandatory: false
    },
    {
      id: 'cert-004',
      type: 'Test Certificate',
      name: 'Laboratory Test Certificate',
      description: 'Product testing and analysis report',
      issuingAuthority: 'NABL Accredited Laboratory',
      mandatory: true
    }
  ]
};

// Sample required documents
const sampleDocuments: RequiredDocument[] = [
  {
    id: 'doc-001',
    name: 'Commercial Invoice',
    category: DocumentCategory.INVOICE,
    description: 'Invoice from supplier showing transaction details',
    mandatory: true,
    instructions: [
      'Must be on supplier letterhead',
      'Include complete buyer and seller details',
      'Show itemized product list with values'
    ]
  },
  {
    id: 'doc-002',
    name: 'Packing List',
    category: DocumentCategory.PACKING_LIST,
    description: 'Detailed list of package contents',
    mandatory: true,
    instructions: [
      'Include package numbers and marks',
      'Show gross and net weights',
      'List contents of each package'
    ]
  },
  {
    id: 'doc-003',
    name: 'Bill of Lading',
    category: DocumentCategory.BILL_OF_LADING,
    description: 'Transport document issued by carrier',
    mandatory: true,
    instructions: [
      'Original or telex release required',
      'Must show notify party details',
      'Endorsed to the order of importer'
    ]
  },
  {
    id: 'doc-004',
    name: 'Import Declaration',
    category: DocumentCategory.DECLARATION,
    description: 'Declaration by importer about goods',
    mandatory: true,
    templateUrl: '/templates/import-declaration.pdf'
  }
];

// Mock compliance database
export const complianceDatabase: ComplianceRequirement[] = [
  // Electronics - Smartphones
  {
    id: 'comp-001',
    hsnCode: '85171210',
    productDescription: 'Smartphones, Mobile Phones, Cellular Phones',
    categoryCode: 'ELECTRONICS',
    licenses: [sampleLicenses.electronics[0], sampleLicenses.electronics[1]],
    certificates: [...sampleCertificates.general, ...sampleCertificates.quality],
    permits: ['Import License', 'BIS Registration'],
    dutyRates: {
      bcd: 20,
      igst: 18,
      socialWelfareSurcharge: 10,
      compensationCess: 0,
      totalDuty: 28.84,
      effectiveDate: new Date('2024-02-01'),
      preferentialRates: [
        {
          country: 'Singapore',
          agreementName: 'CECA',
          rate: 0,
          conditions: ['Certificate of Origin required']
        },
        {
          country: 'Japan',
          agreementName: 'CEPA',
          rate: 10,
          conditions: ['35% value addition required']
        }
      ]
    },
    requiredDocuments: sampleDocuments,
    restrictions: [
      {
        type: 'Licensing',
        description: 'BIS registration mandatory under CRS scheme',
        conditions: ['Valid BIS license required before import']
      }
    ],
    specialConditions: [
      'IMEI registration required',
      'E-waste management compliance mandatory'
    ],
    lastUpdated: new Date('2024-03-01'),
    source: 'DGFT'
  },

  // Textiles - Cotton Fabrics
  {
    id: 'comp-002',
    hsnCode: '52081100',
    productDescription: 'Plain Weave Cotton Fabrics, unbleached',
    categoryCode: 'TEXTILES',
    licenses: [sampleLicenses.textiles[0]],
    certificates: sampleCertificates.general,
    permits: [],
    dutyRates: {
      bcd: 10,
      igst: 12,
      socialWelfareSurcharge: 10,
      totalDuty: 23.32,
      effectiveDate: new Date('2024-02-01')
    },
    requiredDocuments: sampleDocuments,
    specialConditions: [
      'Pre-shipment inspection may be required',
      'Textile Committee NOC required for certain varieties'
    ],
    lastUpdated: new Date('2024-03-01'),
    source: 'CBIC'
  },

  // Chemicals - Organic Chemicals
  {
    id: 'comp-003',
    hsnCode: '29339900',
    productDescription: 'Other heterocyclic compounds with nitrogen',
    categoryCode: 'CHEMICALS',
    licenses: [sampleLicenses.chemicals[0]],
    certificates: [...sampleCertificates.general, ...sampleCertificates.quality],
    permits: ['CPCB NOC', 'SPCB NOC'],
    dutyRates: {
      bcd: 7.5,
      igst: 18,
      socialWelfareSurcharge: 10,
      totalDuty: 26.93,
      effectiveDate: new Date('2024-02-01')
    },
    requiredDocuments: [
      ...sampleDocuments,
      {
        id: 'doc-chem-001',
        name: 'Material Safety Data Sheet',
        category: DocumentCategory.CERTIFICATE,
        description: 'MSDS showing chemical properties and hazards',
        mandatory: true
      },
      {
        id: 'doc-chem-002',
        name: 'UN Classification Certificate',
        category: DocumentCategory.CERTIFICATE,
        description: 'UN number and classification for dangerous goods',
        mandatory: true
      }
    ],
    restrictions: [
      {
        type: 'Restriction',
        description: 'Subject to environmental clearance',
        conditions: ['Valid pollution control NOC required']
      }
    ],
    lastUpdated: new Date('2024-03-01'),
    source: 'DGFT'
  },

  // Food Products - Coffee
  {
    id: 'comp-004',
    hsnCode: '09011110',
    productDescription: 'Coffee beans, not roasted, not decaffeinated, Arabica',
    categoryCode: 'FOOD',
    licenses: [sampleLicenses.food[0], sampleLicenses.food[1]],
    certificates: sampleCertificates.general,
    permits: ['FSSAI License', 'Plant Quarantine Permit'],
    dutyRates: {
      bcd: 30,
      igst: 5,
      socialWelfareSurcharge: 10,
      totalDuty: 36.65,
      effectiveDate: new Date('2024-02-01'),
      preferentialRates: [
        {
          country: 'Vietnam',
          agreementName: 'ASEAN-India FTA',
          rate: 27,
          conditions: ['Certificate of Origin Form AI required']
        }
      ]
    },
    requiredDocuments: [
      ...sampleDocuments,
      {
        id: 'doc-food-001',
        name: 'Health Certificate',
        category: DocumentCategory.CERTIFICATE,
        description: 'Certificate from exporting country health authority',
        mandatory: true
      },
      {
        id: 'doc-food-002',
        name: 'Phytosanitary Certificate',
        category: DocumentCategory.CERTIFICATE,
        description: 'Plant health certificate from exporting country',
        mandatory: true
      },
      {
        id: 'doc-food-003',
        name: 'Non-GMO Certificate',
        category: DocumentCategory.CERTIFICATE,
        description: 'Certificate stating product is not genetically modified',
        mandatory: false
      }
    ],
    restrictions: [
      {
        type: 'Licensing',
        description: 'FSSAI import license mandatory',
        conditions: ['Valid FSSAI license required', 'Product must meet FSSAI standards']
      }
    ],
    specialConditions: [
      'Import allowed only through specified ports',
      'Sample testing may be required'
    ],
    lastUpdated: new Date('2024-03-01'),
    source: 'DGFT'
  },

  // Auto Parts
  {
    id: 'comp-005',
    hsnCode: '87089900',
    productDescription: 'Other parts and accessories for motor vehicles',
    categoryCode: 'AUTOMOTIVE',
    licenses: [],
    certificates: [...sampleCertificates.general, ...sampleCertificates.quality],
    permits: [],
    dutyRates: {
      bcd: 15,
      igst: 28,
      socialWelfareSurcharge: 10,
      totalDuty: 46.77,
      effectiveDate: new Date('2024-02-01'),
      preferentialRates: [
        {
          country: 'Thailand',
          agreementName: 'India-Thailand FTA',
          rate: 12.5,
          conditions: ['Certificate of Origin Form IT required']
        },
        {
          country: 'Korea',
          agreementName: 'India-Korea CEPA',
          rate: 7.5,
          conditions: ['35% value addition required']
        }
      ]
    },
    requiredDocuments: sampleDocuments,
    specialConditions: [
      'AIS standards compliance required for safety-critical parts',
      'Type approval may be required for certain components'
    ],
    lastUpdated: new Date('2024-03-01'),
    source: 'CBIC'
  },

  // Pharmaceuticals
  {
    id: 'comp-006',
    hsnCode: '30049099',
    productDescription: 'Other medicaments in measured doses',
    categoryCode: 'PHARMACEUTICALS',
    licenses: [sampleLicenses.pharmaceuticals[0]],
    certificates: sampleCertificates.general,
    permits: ['Drug Import License', 'NOC from DCGI'],
    dutyRates: {
      bcd: 10,
      igst: 12,
      socialWelfareSurcharge: 10,
      totalDuty: 23.32,
      effectiveDate: new Date('2024-02-01')
    },
    requiredDocuments: [
      ...sampleDocuments,
      {
        id: 'doc-pharma-001',
        name: 'WHO-GMP Certificate',
        category: DocumentCategory.CERTIFICATE,
        description: 'Good Manufacturing Practices certification',
        mandatory: true
      },
      {
        id: 'doc-pharma-002',
        name: 'Certificate of Analysis',
        category: DocumentCategory.CERTIFICATE,
        description: 'Batch-wise analysis certificate',
        mandatory: true
      },
      {
        id: 'doc-pharma-003',
        name: 'Stability Data',
        category: DocumentCategory.OTHER,
        description: 'Stability study data for the drug',
        mandatory: true
      }
    ],
    restrictions: [
      {
        type: 'Licensing',
        description: 'Import allowed only with valid drug license',
        conditions: [
          'Drug registration required',
          'Import license (Form 10) mandatory',
          'Port of entry restrictions apply'
        ]
      },
      {
        type: 'Prohibition',
        description: 'Certain drugs prohibited for import',
        applicableCountries: ['All'],
        exemptions: ['For R&D with NOC']
      }
    ],
    specialConditions: [
      'Cold chain maintenance required for certain drugs',
      'Batch-wise testing at CDSCO labs',
      'Import allowed only through specified ports'
    ],
    lastUpdated: new Date('2024-03-01'),
    source: 'DGFT'
  },

  // Steel Products
  {
    id: 'comp-007',
    hsnCode: '72104900',
    productDescription: 'Flat-rolled products of iron/steel, zinc plated',
    categoryCode: 'METALS',
    licenses: [],
    certificates: [...sampleCertificates.general, ...sampleCertificates.quality],
    permits: [],
    dutyRates: {
      bcd: 7.5,
      igst: 18,
      socialWelfareSurcharge: 10,
      antidumpingDuty: 15, // Example ADD for certain countries
      totalDuty: 42.98,
      effectiveDate: new Date('2024-02-01')
    },
    requiredDocuments: [
      ...sampleDocuments,
      {
        id: 'doc-steel-001',
        name: 'Mill Test Certificate',
        category: DocumentCategory.CERTIFICATE,
        description: 'Certificate showing chemical composition and mechanical properties',
        mandatory: true
      }
    ],
    restrictions: [
      {
        type: 'Restriction',
        description: 'Subject to BIS quality standards',
        conditions: ['Must meet IS specifications']
      }
    ],
    specialConditions: [
      'Anti-dumping duty applicable for imports from China, Vietnam',
      'Minimum import price monitoring'
    ],
    lastUpdated: new Date('2024-03-01'),
    source: 'CBIC'
  },

  // Machinery
  {
    id: 'comp-008',
    hsnCode: '84295190',
    productDescription: 'Other front-end shovel loaders',
    categoryCode: 'MACHINERY',
    licenses: [],
    certificates: sampleCertificates.general,
    permits: [],
    dutyRates: {
      bcd: 7.5,
      igst: 28,
      socialWelfareSurcharge: 10,
      totalDuty: 37.78,
      effectiveDate: new Date('2024-02-01')
    },
    requiredDocuments: [
      ...sampleDocuments,
      {
        id: 'doc-mach-001',
        name: 'CE Certificate',
        category: DocumentCategory.CERTIFICATE,
        description: 'Conformité Européenne marking certificate',
        mandatory: false
      },
      {
        id: 'doc-mach-002',
        name: 'Technical Specifications',
        category: DocumentCategory.OTHER,
        description: 'Detailed technical specifications sheet',
        mandatory: true
      }
    ],
    specialConditions: [
      'Second-hand machinery import subject to additional conditions',
      'Age limit of 7 years for used machinery'
    ],
    lastUpdated: new Date('2024-03-01'),
    source: 'DGFT'
  }
];

// Helper function to search compliance requirements
export function searchComplianceRequirements(
  query: string
): ComplianceRequirement[] {
  const searchTerm = query.toLowerCase();

  return complianceDatabase.filter(req => {
    return (
      req.hsnCode.toLowerCase().includes(searchTerm) ||
      req.productDescription.toLowerCase().includes(searchTerm) ||
      req.categoryCode?.toLowerCase().includes(searchTerm)
    );
  });
}

// Helper function to get requirement by HSN code
export function getRequirementByHSN(hsnCode: string): ComplianceRequirement | null {
  return complianceDatabase.find(req => req.hsnCode === hsnCode) || null;
}

// Helper function to get requirements by category
export function getRequirementsByCategory(category: string): ComplianceRequirement[] {
  return complianceDatabase.filter(req => req.categoryCode === category.toUpperCase());
}

// Helper function to get all unique categories
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  complianceDatabase.forEach(req => {
    if (req.categoryCode) {
      categories.add(req.categoryCode);
    }
  });
  return Array.from(categories);
}

// Helper function to get all HSN codes with descriptions
export function getAllHSNCodes(): Array<{ code: string; description: string }> {
  return complianceDatabase.map(req => ({
    code: req.hsnCode,
    description: req.productDescription
  }));
}