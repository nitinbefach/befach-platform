'use client';

import { useState } from 'react';
import { Vendor, HealthScoreBreakdown, PerformanceEntry } from '@/lib/vendors';
import {
  getScoreColor,
  getGrade,
  getGradeStyle,
  getGradeDescription,
  METRIC_LABELS,
  calculateTrend,
  getTrendStyle
} from '@/lib/healthScore';

interface VendorScorecardProps {
  vendor: Vendor;
  showPeriodSelector?: boolean;
  compact?: boolean;
}

type Period = '30d' | '60d' | '90d' | 'all';

export function VendorScorecard({ vendor, showPeriodSelector = true, compact = false }: VendorScorecardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('90d');

  const { healthScore, healthScoreBreakdown, performanceHistory } = vendor;
  const grade = getGrade(healthScore);
  const gradeStyle = getGradeStyle(grade);
  const trend = calculateTrend(performanceHistory || []);
  const trendStyle = getTrendStyle(trend);

  // Filter performance data by period
  const getFilteredPerformance = (): PerformanceEntry[] => {
    if (!performanceHistory || performanceHistory.length === 0) return [];

    const now = new Date();
    const cutoffDate = new Date();

    switch (selectedPeriod) {
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '60d':
        cutoffDate.setDate(now.getDate() - 60);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case 'all':
      default:
        return performanceHistory;
    }

    return performanceHistory.filter(entry => new Date(entry.recordedAt) >= cutoffDate);
  };

  const filteredPerformance = getFilteredPerformance();

  // Calculate averages from performance history
  const avgDeliveryRate = filteredPerformance.length > 0
    ? Math.round(filteredPerformance.reduce((sum, e) => sum + e.onTimeDeliveryRate, 0) / filteredPerformance.length)
    : 0;
  const avgResponseTime = filteredPerformance.length > 0
    ? Math.round(filteredPerformance.reduce((sum, e) => sum + e.responseTimeHours, 0) / filteredPerformance.length)
    : 0;
  const avgDefectRate = filteredPerformance.length > 0
    ? (filteredPerformance.reduce((sum, e) => sum + e.defectRate, 0) / filteredPerformance.length).toFixed(1)
    : '0';

  if (compact) {
    return (
      <div className="scorecard-compact">
        {/* Compact Grade Display */}
        <div className="compact-header">
          <div className="grade-circle" style={{ background: gradeStyle.bgColor, borderColor: gradeStyle.borderColor }}>
            <span className="grade-letter" style={{ color: gradeStyle.color }}>{grade}</span>
            <span className="grade-score">{healthScore}</span>
          </div>
          <div className="compact-trend" style={{ color: trendStyle.color }}>
            {trendStyle.icon} {trendStyle.label}
          </div>
        </div>

        {/* Mini Breakdown Bars */}
        <div className="compact-bars">
          {Object.entries(healthScoreBreakdown).map(([key, value]) => {
            const metric = METRIC_LABELS[key as keyof HealthScoreBreakdown];
            return (
              <div key={key} className="compact-bar-row">
                <span className="compact-bar-label">{metric.icon}</span>
                <div className="compact-bar">
                  <div
                    className="compact-bar-fill"
                    style={{
                      width: `${value}%`,
                      background: getScoreColor(value)
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <style jsx>{`
          .scorecard-compact {
            padding: 12px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 10px;
          }

          .compact-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
          }

          .grade-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .grade-letter {
            font-size: 18px;
            font-weight: 700;
            line-height: 1;
          }

          .grade-score {
            font-size: 11px;
            color: var(--text-secondary);
          }

          .compact-trend {
            font-size: 12px;
            font-weight: 500;
          }

          .compact-bars {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .compact-bar-row {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .compact-bar-label {
            font-size: 12px;
            width: 16px;
          }

          .compact-bar {
            flex: 1;
            height: 6px;
            background: var(--bg-tertiary);
            border-radius: 3px;
            overflow: hidden;
          }

          .compact-bar-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.3s ease;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="vendor-scorecard">
      {/* Header */}
      <div className="scorecard-header">
        <div className="score-section">
          {/* SVG Circular Progress */}
          <div className="score-ring">
            <svg viewBox="0 0 100 100" className="progress-svg">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--bg-tertiary)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={getScoreColor(healthScore)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(healthScore / 100) * 264} 264`}
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            </svg>
            <div className="score-content">
              <span className="score-value">{healthScore}</span>
              <span className="score-label">Health</span>
            </div>
          </div>

          <div className="grade-info">
            <div
              className="grade-badge"
              style={{
                background: gradeStyle.bgColor,
                color: gradeStyle.color,
                borderColor: gradeStyle.borderColor
              }}
            >
              Grade {grade}
            </div>
            <p className="grade-description">{getGradeDescription(grade)}</p>
            <div className="trend-indicator" style={{ color: trendStyle.color }}>
              <span className="trend-icon">{trendStyle.icon}</span>
              <span>{trendStyle.label}</span>
            </div>
          </div>
        </div>

        {showPeriodSelector && (
          <div className="period-selector">
            {(['30d', '60d', '90d', 'all'] as Period[]).map(period => (
              <button
                key={period}
                className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(period)}
              >
                {period === 'all' ? 'All' : period}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Breakdown Cards */}
      <div className="breakdown-grid">
        {Object.entries(healthScoreBreakdown).map(([key, value]) => {
          const metric = METRIC_LABELS[key as keyof HealthScoreBreakdown];
          const color = getScoreColor(value);
          return (
            <div key={key} className="breakdown-card">
              <div className="breakdown-header">
                <span className="breakdown-icon">{metric.icon}</span>
                <span className="breakdown-title">{metric.label}</span>
              </div>
              <div className="breakdown-score" style={{ color }}>{Math.round(value)}</div>
              <div className="breakdown-bar-container">
                <div className="breakdown-bar-bg">
                  <div
                    className="breakdown-bar-fill"
                    style={{ width: `${value}%`, background: color }}
                  />
                </div>
              </div>
              <p className="breakdown-description">{metric.description}</p>
            </div>
          );
        })}
      </div>

      {/* Performance Summary */}
      {filteredPerformance.length > 0 && (
        <div className="performance-summary">
          <h4>Performance Summary</h4>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value">{avgDeliveryRate}%</span>
              <span className="stat-label">On-Time Delivery</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{avgResponseTime}h</span>
              <span className="stat-label">Avg Response Time</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{avgDefectRate}%</span>
              <span className="stat-label">Defect Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{filteredPerformance.reduce((sum, e) => sum + e.ordersDelivered, 0)}</span>
              <span className="stat-label">Orders Delivered</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .vendor-scorecard {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
        }

        .scorecard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .score-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .score-ring {
          position: relative;
          width: 100px;
          height: 100px;
        }

        .progress-svg {
          width: 100%;
          height: 100%;
        }

        .score-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .score-value {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }

        .score-label {
          font-size: 11px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .grade-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .grade-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid;
          width: fit-content;
        }

        .grade-description {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0;
        }

        .trend-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .trend-icon {
          font-size: 14px;
        }

        .period-selector {
          display: flex;
          gap: 4px;
          background: var(--bg-tertiary);
          padding: 4px;
          border-radius: 8px;
        }

        .period-btn {
          padding: 6px 12px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .period-btn:hover {
          color: var(--text-primary);
        }

        .period-btn.active {
          background: var(--bg-secondary);
          color: var(--text-primary);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .breakdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .breakdown-card {
          background: var(--bg-tertiary);
          border-radius: 10px;
          padding: 14px;
        }

        .breakdown-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .breakdown-icon {
          font-size: 16px;
        }

        .breakdown-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .breakdown-score {
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 8px;
        }

        .breakdown-bar-container {
          margin-bottom: 8px;
        }

        .breakdown-bar-bg {
          height: 6px;
          background: var(--bg-secondary);
          border-radius: 3px;
          overflow: hidden;
        }

        .breakdown-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .breakdown-description {
          font-size: 11px;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.3;
        }

        .performance-summary {
          background: var(--bg-tertiary);
          border-radius: 10px;
          padding: 16px;
        }

        .performance-summary h4 {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 12px 0;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 11px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .scorecard-header {
            flex-direction: column;
            gap: 16px;
          }

          .breakdown-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .summary-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default VendorScorecard;
