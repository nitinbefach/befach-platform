'use client';

import { useState, useMemo } from 'react';
import { PerformanceEntry } from '@/lib/vendors';

interface PerformanceChartProps {
  performanceHistory: PerformanceEntry[];
  height?: number;
}

type MetricKey = 'onTimeDeliveryRate' | 'qualityRating' | 'responseTimeHours' | 'defectRate';

const METRICS: { key: MetricKey; label: string; color: string; unit: string; scale: number }[] = [
  { key: 'onTimeDeliveryRate', label: 'On-Time Delivery', color: '#10B981', unit: '%', scale: 100 },
  { key: 'qualityRating', label: 'Quality Rating', color: '#3B82F6', unit: '/5', scale: 5 },
  { key: 'responseTimeHours', label: 'Response Time', color: '#F59E0B', unit: 'h', scale: 72 },
  { key: 'defectRate', label: 'Defect Rate', color: '#EF4444', unit: '%', scale: 20 }
];

export function PerformanceChart({ performanceHistory, height = 200 }: PerformanceChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('onTimeDeliveryRate');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const currentMetric = METRICS.find(m => m.key === activeMetric)!;

  // Sort by period and get last 6 entries
  const sortedData = useMemo(() => {
    return [...performanceHistory]
      .sort((a, b) => a.period.localeCompare(b.period))
      .slice(-6);
  }, [performanceHistory]);

  if (sortedData.length === 0) {
    return (
      <div className="performance-chart empty">
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
            <path d="M3 3v18h18" />
            <path d="M18 9l-5 5-4-4-3 3" />
          </svg>
          <p>No performance data available yet</p>
        </div>

        <style jsx>{`
          .performance-chart.empty {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .empty-state {
            text-align: center;
            color: var(--text-secondary);
          }

          .empty-state svg {
            margin-bottom: 12px;
            opacity: 0.5;
          }

          .empty-state p {
            margin: 0;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  // Calculate chart dimensions
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 100; // Percentage
  const chartHeight = height - padding.top - padding.bottom;

  // Generate points for SVG path
  const getPoints = () => {
    const xStep = 100 / (sortedData.length - 1 || 1);
    const points = sortedData.map((entry, i) => {
      const value = entry[activeMetric];
      const normalizedValue = activeMetric === 'responseTimeHours'
        ? Math.max(0, 100 - (value / currentMetric.scale) * 100) // Invert for response time (lower is better)
        : (value / currentMetric.scale) * 100;
      const y = chartHeight - (normalizedValue / 100) * chartHeight;
      return {
        x: i * xStep,
        y,
        value,
        period: entry.period
      };
    });
    return points;
  };

  const points = getPoints();

  // Generate SVG path
  const linePath = points.map((p, i) =>
    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
  ).join(' ');

  // Generate area path (for gradient fill)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  // Format month label
  const formatMonth = (period: string) => {
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  // Format value based on metric
  const formatValue = (value: number) => {
    if (activeMetric === 'qualityRating') return value.toFixed(1);
    if (activeMetric === 'responseTimeHours') return Math.round(value);
    return Math.round(value);
  };

  return (
    <div className="performance-chart">
      {/* Metric Selector */}
      <div className="metric-selector">
        {METRICS.map(metric => (
          <button
            key={metric.key}
            className={`metric-btn ${activeMetric === metric.key ? 'active' : ''}`}
            onClick={() => setActiveMetric(metric.key)}
            style={{
              '--metric-color': metric.color
            } as React.CSSProperties}
          >
            <span className="metric-dot" style={{ background: metric.color }} />
            {metric.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-container" style={{ height }}>
        <svg
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          className="chart-svg"
        >
          <defs>
            <linearGradient id={`gradient-${activeMetric}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={currentMetric.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={currentMetric.color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <g className="grid-lines">
            {[0, 25, 50, 75, 100].map(pct => {
              const y = padding.top + chartHeight - (pct / 100) * chartHeight;
              return (
                <line
                  key={pct}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="var(--border-color)"
                  strokeWidth="0.3"
                  strokeDasharray="1 1"
                />
              );
            })}
          </g>

          {/* Area fill */}
          <path
            d={areaPath}
            fill={`url(#gradient-${activeMetric})`}
            transform={`translate(0, ${padding.top})`}
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={currentMetric.color}
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(0, ${padding.top})`}
          />

          {/* Data points */}
          {points.map((point, i) => (
            <g key={i} transform={`translate(0, ${padding.top})`}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === i ? 2 : 1.2}
                fill={currentMetric.color}
                stroke="var(--bg-secondary)"
                strokeWidth="0.4"
                style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}
        </svg>

        {/* Y-axis labels */}
        <div className="y-axis">
          {[100, 75, 50, 25, 0].map(pct => {
            const value = activeMetric === 'responseTimeHours'
              ? Math.round((100 - pct) / 100 * currentMetric.scale)
              : Math.round(pct / 100 * currentMetric.scale);
            return (
              <span key={pct} className="y-label">
                {value}{currentMetric.unit}
              </span>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="x-axis">
          {points.map((point, i) => (
            <span key={i} className="x-label">
              {formatMonth(point.period)}
            </span>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredPoint !== null && (
          <div
            className="chart-tooltip"
            style={{
              left: `${points[hoveredPoint].x}%`,
              top: `${padding.top + points[hoveredPoint].y - 10}px`
            }}
          >
            <div className="tooltip-value" style={{ color: currentMetric.color }}>
              {formatValue(points[hoveredPoint].value)}{currentMetric.unit}
            </div>
            <div className="tooltip-period">
              {formatMonth(points[hoveredPoint].period)}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .performance-chart {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
        }

        .metric-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .metric-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .metric-btn:hover {
          border-color: var(--metric-color);
          color: var(--text-primary);
        }

        .metric-btn.active {
          background: var(--bg-secondary);
          border-color: var(--metric-color);
          color: var(--text-primary);
          box-shadow: 0 0 0 1px var(--metric-color);
        }

        .metric-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .chart-container {
          position: relative;
          padding-left: 45px;
          padding-bottom: 30px;
        }

        .chart-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .y-axis {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px 0;
        }

        .y-label {
          font-size: 10px;
          color: var(--text-muted);
          text-align: right;
          width: 40px;
        }

        .x-axis {
          position: absolute;
          left: 45px;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: space-between;
          padding: 8px 0 0;
        }

        .x-label {
          font-size: 10px;
          color: var(--text-muted);
          text-align: center;
        }

        .chart-tooltip {
          position: absolute;
          transform: translate(-50%, -100%);
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 6px 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          pointer-events: none;
          z-index: 10;
        }

        .tooltip-value {
          font-size: 14px;
          font-weight: 600;
          line-height: 1;
        }

        .tooltip-period {
          font-size: 10px;
          color: var(--text-secondary);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}

export default PerformanceChart;
