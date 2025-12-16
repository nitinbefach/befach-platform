'use client';

import React, { useState } from 'react';
import {
  FileText,
  Shield,
  DollarSign,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Building,
  Globe,
  Package,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
  Download,
  Clock
} from 'lucide-react';
import { ComplianceRequirement, LicenseStatus } from '@/types/compliance';
import styles from './ComplianceResultCard.module.css';

interface ComplianceResultCardProps {
  requirement: ComplianceRequirement;
  onApplyLicense?: (licenseType: string) => void;
  onViewDetails?: (requirement: ComplianceRequirement) => void;
}

export function ComplianceResultCard({
  requirement,
  onApplyLicense,
  onViewDetails
}: ComplianceResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'licenses' | 'documents' | 'duties' | 'restrictions'>('licenses');

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: LicenseStatus) => {
    switch (status) {
      case LicenseStatus.ACTIVE:
        return styles.statusActive;
      case LicenseStatus.EXPIRED:
        return styles.statusExpired;
      case LicenseStatus.PENDING_RENEWAL:
        return styles.statusPending;
      case LicenseStatus.SUSPENDED:
        return styles.statusSuspended;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusIcon = (status: LicenseStatus) => {
    switch (status) {
      case LicenseStatus.ACTIVE:
        return <CheckCircle size={14} />;
      case LicenseStatus.EXPIRED:
      case LicenseStatus.SUSPENDED:
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  return (
    <div className={styles.card}>
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerMain}>
            <div className={styles.hsnCode}>{requirement.hsnCode}</div>
            <h3 className={styles.productDescription}>{requirement.productDescription}</h3>
            {requirement.categoryCode && (
              <span className={styles.categoryBadge}>{requirement.categoryCode}</span>
            )}
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.expandButton}
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>
        </div>

        {/* Quick Info */}
        <div className={styles.quickInfo}>
          <div className={styles.quickInfoItem}>
            <Shield size={16} />
            <span>{requirement.licenses.length} Licenses Required</span>
          </div>
          <div className={styles.quickInfoItem}>
            <FileText size={16} />
            <span>{requirement.requiredDocuments.length} Documents</span>
          </div>
          <div className={styles.quickInfoItem}>
            <DollarSign size={16} />
            <span>Total Duty: {requirement.dutyRates.totalDuty?.toFixed(2)}%</span>
          </div>
          {requirement.restrictions && requirement.restrictions.length > 0 && (
            <div className={styles.quickInfoItem}>
              <AlertCircle size={16} className={styles.warningIcon} />
              <span>{requirement.restrictions.length} Restrictions</span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={styles.expandedContent}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'licenses' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('licenses')}
            >
              <Shield size={16} />
              Licenses & Certificates
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'documents' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              <FileText size={16} />
              Required Documents
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'duties' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('duties')}
            >
              <DollarSign size={16} />
              Duty Rates
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'restrictions' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('restrictions')}
            >
              <AlertCircle size={16} />
              Restrictions
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {/* Licenses Tab */}
            {activeTab === 'licenses' && (
              <div className={styles.licensesContent}>
                <h4 className={styles.sectionTitle}>Required Licenses</h4>
                {requirement.licenses.length > 0 ? (
                  <div className={styles.licensesList}>
                    {requirement.licenses.map((license) => (
                      <div key={license.id} className={styles.licenseItem}>
                        <div className={styles.licenseHeader}>
                          <div className={styles.licenseName}>
                            <Shield size={18} />
                            <span>{license.name}</span>
                          </div>
                          <span className={`${styles.status} ${getStatusColor(license.status)}`}>
                            {getStatusIcon(license.status)}
                            {license.status}
                          </span>
                        </div>
                        <p className={styles.licenseDescription}>{license.description}</p>
                        <div className={styles.licenseDetails}>
                          <div className={styles.detailItem}>
                            <Building size={14} />
                            <span>{license.issuingAuthority}</span>
                          </div>
                          {license.processingTime && (
                            <div className={styles.detailItem}>
                              <Clock size={14} />
                              <span>{license.processingTime}</span>
                            </div>
                          )}
                          {license.expiryDate && (
                            <div className={styles.detailItem}>
                              <Calendar size={14} />
                              <span>Expires: {formatDate(license.expiryDate)}</span>
                            </div>
                          )}
                        </div>
                        {license.applicationUrl && (
                          <div className={styles.licenseActions}>
                            <button
                              className={styles.applyButton}
                              onClick={() => onApplyLicense && onApplyLicense(license.type)}
                            >
                              Apply Now
                              <ExternalLink size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No licenses required for this product</p>
                )}

                {requirement.certificates.length > 0 && (
                  <>
                    <h4 className={styles.sectionTitle}>Required Certificates</h4>
                    <div className={styles.certificatesList}>
                      {requirement.certificates.map((cert) => (
                        <div key={cert.id} className={styles.certificateItem}>
                          <FileText size={16} />
                          <div className={styles.certificateInfo}>
                            <span className={styles.certificateName}>{cert.name}</span>
                            <span className={styles.certificateIssuer}>{cert.issuingAuthority}</span>
                          </div>
                          {cert.mandatory && (
                            <span className={styles.mandatoryBadge}>Mandatory</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className={styles.documentsContent}>
                <h4 className={styles.sectionTitle}>Required Documents</h4>
                <div className={styles.documentsList}>
                  {requirement.requiredDocuments.map((doc) => (
                    <div key={doc.id} className={styles.documentItem}>
                      <div className={styles.documentHeader}>
                        <div className={styles.documentName}>
                          <FileText size={16} />
                          <span>{doc.name}</span>
                        </div>
                        {doc.mandatory ? (
                          <span className={styles.mandatoryBadge}>Mandatory</span>
                        ) : (
                          <span className={styles.optionalBadge}>Optional</span>
                        )}
                      </div>
                      <p className={styles.documentDescription}>{doc.description}</p>
                      {doc.instructions && doc.instructions.length > 0 && (
                        <ul className={styles.instructionsList}>
                          {doc.instructions.map((instruction, idx) => (
                            <li key={idx}>{instruction}</li>
                          ))}
                        </ul>
                      )}
                      {doc.templateUrl && (
                        <button className={styles.downloadButton}>
                          <Download size={14} />
                          Download Template
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Duties Tab */}
            {activeTab === 'duties' && (
              <div className={styles.dutiesContent}>
                <h4 className={styles.sectionTitle}>Duty Structure</h4>
                <div className={styles.dutyTable}>
                  <div className={styles.dutyRow}>
                    <span className={styles.dutyLabel}>Basic Customs Duty (BCD)</span>
                    <span className={styles.dutyValue}>{requirement.dutyRates.bcd}%</span>
                  </div>
                  <div className={styles.dutyRow}>
                    <span className={styles.dutyLabel}>Integrated GST (IGST)</span>
                    <span className={styles.dutyValue}>{requirement.dutyRates.igst}%</span>
                  </div>
                  <div className={styles.dutyRow}>
                    <span className={styles.dutyLabel}>Social Welfare Surcharge</span>
                    <span className={styles.dutyValue}>{requirement.dutyRates.socialWelfareSurcharge}%</span>
                  </div>
                  {requirement.dutyRates.compensationCess !== undefined && requirement.dutyRates.compensationCess > 0 && (
                    <div className={styles.dutyRow}>
                      <span className={styles.dutyLabel}>Compensation Cess</span>
                      <span className={styles.dutyValue}>{requirement.dutyRates.compensationCess}%</span>
                    </div>
                  )}
                  {requirement.dutyRates.antidumpingDuty !== undefined && requirement.dutyRates.antidumpingDuty > 0 && (
                    <div className={styles.dutyRow}>
                      <span className={styles.dutyLabel}>Anti-dumping Duty</span>
                      <span className={styles.dutyValue}>{requirement.dutyRates.antidumpingDuty}%</span>
                    </div>
                  )}
                  <div className={`${styles.dutyRow} ${styles.dutyTotal}`}>
                    <span className={styles.dutyLabel}>Total Effective Duty</span>
                    <span className={styles.dutyValue}>{requirement.dutyRates.totalDuty?.toFixed(2)}%</span>
                  </div>
                </div>

                {requirement.dutyRates.preferentialRates && requirement.dutyRates.preferentialRates.length > 0 && (
                  <>
                    <h4 className={styles.sectionTitle}>Preferential Rates</h4>
                    <div className={styles.preferentialRates}>
                      {requirement.dutyRates.preferentialRates.map((rate, idx) => (
                        <div key={idx} className={styles.preferentialRate}>
                          <div className={styles.preferentialHeader}>
                            <Globe size={16} />
                            <span>{rate.country} - {rate.agreementName}</span>
                          </div>
                          <div className={styles.preferentialDetails}>
                            <span className={styles.preferentialValue}>Duty: {rate.rate}%</span>
                            {rate.conditions && (
                              <ul className={styles.conditionsList}>
                                {rate.conditions.map((condition, cidx) => (
                                  <li key={cidx}>{condition}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Restrictions Tab */}
            {activeTab === 'restrictions' && (
              <div className={styles.restrictionsContent}>
                <h4 className={styles.sectionTitle}>Trade Restrictions & Conditions</h4>
                {requirement.restrictions && requirement.restrictions.length > 0 ? (
                  <div className={styles.restrictionsList}>
                    {requirement.restrictions.map((restriction, idx) => (
                      <div key={idx} className={styles.restrictionItem}>
                        <div className={styles.restrictionHeader}>
                          <AlertCircle size={16} className={styles.restrictionIcon} />
                          <span className={styles.restrictionType}>{restriction.type}</span>
                        </div>
                        <p className={styles.restrictionDescription}>{restriction.description}</p>
                        {restriction.conditions && restriction.conditions.length > 0 && (
                          <ul className={styles.restrictionConditions}>
                            {restriction.conditions.map((condition, cidx) => (
                              <li key={cidx}>{condition}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No restrictions apply to this product</p>
                )}

                {requirement.specialConditions && requirement.specialConditions.length > 0 && (
                  <>
                    <h4 className={styles.sectionTitle}>Special Conditions</h4>
                    <ul className={styles.specialConditions}>
                      {requirement.specialConditions.map((condition, idx) => (
                        <li key={idx}>
                          <Info size={14} />
                          <span>{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className={styles.cardFooter}>
            <div className={styles.footerInfo}>
              <span className={styles.sourceInfo}>
                Source: {requirement.source}
              </span>
              <span className={styles.updateInfo}>
                Last Updated: {formatDate(requirement.lastUpdated)}
              </span>
            </div>
            {onViewDetails && (
              <button
                className={styles.viewDetailsButton}
                onClick={() => onViewDetails(requirement)}
              >
                View Full Details
                <ExternalLink size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplianceResultCard;