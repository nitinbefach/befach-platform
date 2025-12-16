'use client';

import { useState } from 'react';
import {
  getScoreColor,
  getScoreBgColor,
  getGrade,
  getGradeDescription,
  getGradeStyle,
  getTrendStyle,
  METRIC_LABELS
} from '@/lib/healthScore';
import { HealthScoreBreakdown } from '@/lib/vendors';

interface HealthScoreBadgeProps {
  score: number;
  breakdown?: HealthScoreBreakdown;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  showGrade?: boolean;
  showTrend?: boolean;
  trend?: 'up' | 'down' | 'stable';
  onClick?: () => void;
  className?: string;
}

export function HealthScoreBadge({
  score,
  breakdown,
  size = 'md',
  showTooltip = true,
  showGrade = false,
  showTrend = false,
  trend,
  onClick,
  className = ''
}: HealthScoreBadgeProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const color = getScoreColor(score);
  const bgColor = getScoreBgColor(score);
  const grade = getGrade(score);
  const gradeStyle = getGradeStyle(grade);
  const trendStyle = trend ? getTrendStyle(trend) : null;

  const sizes = {
    sm: { badge: '24px', font: '11px', icon: '8px' },
    md: { badge: '32px', font: '13px', icon: '10px' },
    lg: { badge: '44px', font: '16px', icon: '12px' }
  };

  const sizeConfig = sizes[size];

  return (
    <div
      className={`health-score-badge ${className}`}
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Score Circle */}
      <div
        className="score-circle"
        style={{
          width: sizeConfig.badge,
          height: sizeConfig.badge,
          background: bgColor,
          border: `2px solid ${color}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: sizeConfig.font,
          fontWeight: 700,
          color: color,
          position: 'relative'
        }}
      >
        {score}

        {/* Trend Indicator */}
        {showTrend && trendStyle && (
          <span
            className="trend-indicator"
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              fontSize: sizeConfig.icon,
              color: trendStyle.color,
              fontWeight: 'bold'
            }}
          >
            {trendStyle.icon}
          </span>
        )}
      </div>

      {/* Grade Badge */}
      {showGrade && (
        <span
          className="grade-badge"
          style={{
            marginLeft: '6px',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: size === 'sm' ? '10px' : '11px',
            fontWeight: 600,
            background: gradeStyle.bgColor,
            color: gradeStyle.color,
            border: `1px solid ${gradeStyle.borderColor}`
          }}
        >
          {grade}
        </span>
      )}

      {/* Tooltip */}
      {showTooltip && isTooltipVisible && (
        <div className="health-tooltip">
          <div className="tooltip-header">
            <span className="tooltip-score" style={{ color }}>
              {score}
            </span>
            <span className="tooltip-grade" style={{ background: gradeStyle.bgColor, color: gradeStyle.color }}>
              Grade {grade}
            </span>
          </div>

          <p className="tooltip-description">{getGradeDescription(grade)}</p>

          {breakdown && (
            <div className="tooltip-breakdown">
              {Object.entries(breakdown).map(([key, value]) => {
                const metric = METRIC_LABELS[key as keyof HealthScoreBreakdown];
                const metricColor = getScoreColor(value);
                return (
                  <div key={key} className="breakdown-row">
                    <span className="breakdown-icon">{metric.icon}</span>
                    <span className="breakdown-label">{metric.label}</span>
                    <div className="breakdown-bar">
                      <div
                        className="breakdown-fill"
                        style={{
                          width: `${value}%`,
                          background: metricColor
                        }}
                      />
                    </div>
                    <span className="breakdown-value" style={{ color: metricColor }}>
                      {Math.round(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {trend && trendStyle && (
            <div className="tooltip-trend" style={{ color: trendStyle.color }}>
              {trendStyle.icon} {trendStyle.label}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .health-score-badge {
          display: inline-flex;
          align-items: center;
          position: relative;
        }

        .health-tooltip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 14px;
          width: 220px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          animation: tooltipFadeIn 0.2s ease;
        }

        .health-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: var(--border-color);
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .tooltip-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .tooltip-score {
          font-size: 24px;
          font-weight: 700;
        }

        .tooltip-grade {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .tooltip-description {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0 0 12px 0;
        }

        .tooltip-breakdown {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .breakdown-row {
          display: grid;
          grid-template-columns: 16px 60px 1fr 28px;
          align-items: center;
          gap: 6px;
        }

        .breakdown-icon {
          font-size: 12px;
        }

        .breakdown-label {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .breakdown-bar {
          height: 4px;
          background: var(--bg-tertiary);
          border-radius: 2px;
          overflow: hidden;
        }

        .breakdown-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .breakdown-value {
          font-size: 11px;
          font-weight: 600;
          text-align: right;
        }

        .tooltip-trend {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
          font-size: 11px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </div>
  );
}

// Compact inline score display (for tables)
export function HealthScoreInline({ score, size = 'sm' }: { score: number; size?: 'sm' | 'md' }) {
  const color = getScoreColor(score);
  const grade = getGrade(score);

  return (
    <span
      className="health-score-inline"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: size === 'sm' ? '12px' : '14px',
        fontWeight: 600,
        color
      }}
    >
      <span
        style={{
          width: size === 'sm' ? '18px' : '22px',
          height: size === 'sm' ? '18px' : '22px',
          borderRadius: '50%',
          background: getScoreBgColor(score),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size === 'sm' ? '10px' : '12px'
        }}
      >
        {grade}
      </span>
      {score}
    </span>
  );
}

export default HealthScoreBadge;
