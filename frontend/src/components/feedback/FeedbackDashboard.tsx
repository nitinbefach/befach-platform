'use client';

import { useState, useEffect } from 'react';
import { Download, TrendingUp, Star, Users, MessageSquare, ThumbsUp, ThumbsDown, Minus, Trash2 } from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';
import {
  getFeedbackList,
  getFeedbackStats,
  initializeFeedback,
  downloadFeedbackCSV,
  deleteFeedback,
  FEEDBACK_FEATURES,
  type FeedbackEntry,
  type FeedbackStats,
  type FeedbackFilters,
  type FeedbackType,
  type Sentiment
} from '@/lib/feedback';

export default function FeedbackDashboard() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [filters, setFilters] = useState<FeedbackFilters>({});
  const { isMobile } = useMobile();

  const loadData = () => {
    initializeFeedback();
    const list = getFeedbackList(filters);
    setEntries(list);
    setStats(getFeedbackStats());
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleDelete = (id: string) => {
    deleteFeedback(id);
    loadData();
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatResponse = (entry: FeedbackEntry): string => {
    if (typeof entry.response === 'object') return 'Survey completed';
    if (entry.type === 'thumbs') return entry.response === 'up' ? 'Thumbs Up' : 'Thumbs Down';
    if (entry.type === 'emoji') return String(entry.response).charAt(0).toUpperCase() + String(entry.response).slice(1);
    if (entry.type === 'nps') return `${entry.response}/10`;
    if (entry.type === 'stars') return `${entry.response}/5 stars`;
    if (entry.type === 'scale') return `${entry.response}/5`;
    return String(entry.response);
  };

  const getSentimentIcon = (sentiment: Sentiment) => {
    if (sentiment === 'positive') return <ThumbsUp size={14} />;
    if (sentiment === 'negative') return <ThumbsDown size={14} />;
    return <Minus size={14} />;
  };

  if (!stats) return null;

  const npsColor = stats.npsScore >= 50 ? '#10b981' : stats.npsScore >= 0 ? '#f59e0b' : '#ef4444';
  const totalSentiment = stats.sentimentBreakdown.positive + stats.sentimentBreakdown.neutral + stats.sentimentBreakdown.negative;

  return (
    <div className="feedback-dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon nps-icon"><TrendingUp size={20} /></div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: npsColor }}>{stats.npsScore}</span>
            <span className="stat-label">NPS Score</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rating-icon"><Star size={20} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.avgRating}</span>
            <span className="stat-label">Avg Rating</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon response-icon"><MessageSquare size={20} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.responseRate}%</span>
            <span className="stat-label">Comment Rate</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total-icon"><Users size={20} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalResponses}</span>
            <span className="stat-label">Total Responses</span>
          </div>
        </div>
      </div>

      {/* Two-column layout: Feature Scores + Sentiment */}
      <div className="middle-row">
        {/* Feature Satisfaction */}
        <div className="card">
          <h3 className="card-title">Feature Satisfaction</h3>
          <div className="feature-bars">
            {Object.entries(stats.featureScores).map(([feature, data]) => (
              <div key={feature} className="feature-bar-row">
                <div className="feature-bar-label">
                  <span>{FEEDBACK_FEATURES[feature] || feature}</span>
                  <span className="feature-bar-value">{data.avg}/5 ({data.count})</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(data.avg / 5) * 100}%`,
                      background: data.avg >= 4 ? '#10b981' : data.avg >= 3 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
              </div>
            ))}
            {Object.keys(stats.featureScores).length === 0 && (
              <p className="empty-text">No rating data yet</p>
            )}
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="card">
          <h3 className="card-title">Sentiment Breakdown</h3>
          <div className="sentiment-section">
            <div className="sentiment-bar-track">
              {totalSentiment > 0 && (
                <>
                  <div
                    className="sentiment-segment positive-seg"
                    style={{ width: `${(stats.sentimentBreakdown.positive / totalSentiment) * 100}%` }}
                  />
                  <div
                    className="sentiment-segment neutral-seg"
                    style={{ width: `${(stats.sentimentBreakdown.neutral / totalSentiment) * 100}%` }}
                  />
                  <div
                    className="sentiment-segment negative-seg"
                    style={{ width: `${(stats.sentimentBreakdown.negative / totalSentiment) * 100}%` }}
                  />
                </>
              )}
            </div>
            <div className="sentiment-legend">
              <div className="legend-item">
                <span className="legend-dot positive-dot" />
                <span>Positive ({stats.sentimentBreakdown.positive})</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot neutral-dot" />
                <span>Neutral ({stats.sentimentBreakdown.neutral})</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot negative-dot" />
                <span>Negative ({stats.sentimentBreakdown.negative})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="card table-card">
        <div className="table-header">
          <h3 className="card-title">All Feedback</h3>
          <div className="table-actions">
            <select
              value={filters.feature || ''}
              onChange={(e) => setFilters(f => ({ ...f, feature: e.target.value || undefined }))}
            >
              <option value="">All Features</option>
              {Object.entries(FEEDBACK_FEATURES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={filters.type || ''}
              onChange={(e) => setFilters(f => ({ ...f, type: (e.target.value as FeedbackType) || undefined }))}
            >
              <option value="">All Types</option>
              <option value="stars">Stars</option>
              <option value="thumbs">Thumbs</option>
              <option value="scale">Scale</option>
              <option value="emoji">Emoji</option>
              <option value="nps">NPS</option>
              <option value="survey">Survey</option>
            </select>
            <select
              value={filters.sentiment || ''}
              onChange={(e) => setFilters(f => ({ ...f, sentiment: (e.target.value as Sentiment) || undefined }))}
            >
              <option value="">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
            <button className="export-btn" onClick={downloadFeedbackCSV} title="Export CSV">
              <Download size={14} />
              {!isMobile && <span>Export</span>}
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Feature</th>
                <th>Type</th>
                <th>Response</th>
                <th>Sentiment</th>
                {!isMobile && <th>Comments</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 && (
                <tr>
                  <td colSpan={isMobile ? 6 : 7} className="empty-row">
                    No feedback matches your filters
                  </td>
                </tr>
              )}
              {entries.map(entry => (
                <tr key={entry.id}>
                  <td className="date-cell">{formatDate(entry.timestamp)}</td>
                  <td>
                    <span className="feature-badge">
                      {FEEDBACK_FEATURES[entry.feature] || entry.feature}
                    </span>
                  </td>
                  <td className="type-cell">{entry.type}</td>
                  <td>{formatResponse(entry)}</td>
                  <td>
                    <span className={`sentiment-badge ${entry.sentiment}`}>
                      {getSentimentIcon(entry.sentiment)}
                      {entry.sentiment}
                    </span>
                  </td>
                  {!isMobile && (
                    <td className="comment-cell">
                      {entry.comments || <span className="no-comment">—</span>}
                    </td>
                  )}
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(entry.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .feedback-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid #e5e7eb;
        }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .nps-icon { background: #ede9fe; color: #7c3aed; }
        .rating-icon { background: #fef3c7; color: #f59e0b; }
        .response-icon { background: #dbeafe; color: #3b82f6; }
        .total-icon { background: #d1fae5; color: #10b981; }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
        }
        .stat-label {
          font-size: 13px;
          color: #6b7280;
        }

        /* Middle Row */
        .middle-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }
        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 16px;
        }

        /* Feature Bars */
        .feature-bars {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .feature-bar-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .feature-bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #374151;
        }
        .feature-bar-value {
          color: #6b7280;
          font-size: 12px;
        }
        .bar-track {
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        .empty-text {
          color: #9ca3af;
          font-size: 14px;
          text-align: center;
          padding: 20px 0;
        }

        /* Sentiment Section */
        .sentiment-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .sentiment-bar-track {
          height: 24px;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          background: #f3f4f6;
        }
        .sentiment-segment {
          height: 100%;
          transition: width 0.5s ease;
        }
        .positive-seg { background: #10b981; }
        .neutral-seg { background: #f59e0b; }
        .negative-seg { background: #ef4444; }
        .sentiment-legend {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #6b7280;
        }
        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .positive-dot { background: #10b981; }
        .neutral-dot { background: #f59e0b; }
        .negative-dot { background: #ef4444; }

        /* Table Card */
        .table-card {
          padding: 0;
        }
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          flex-wrap: wrap;
          gap: 12px;
        }
        .table-header .card-title {
          margin-bottom: 0;
        }
        .table-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .table-actions select {
          padding: 6px 10px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 13px;
          color: #374151;
          background: white;
          cursor: pointer;
        }
        .table-actions select:focus {
          outline: none;
          border-color: #f97316;
        }
        .export-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f97316;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .export-btn:hover {
          background: #ea580c;
        }

        /* Table */
        .table-wrapper {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        thead th {
          padding: 10px 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        tbody td {
          padding: 12px 16px;
          font-size: 13px;
          color: #374151;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: middle;
        }
        tbody tr:hover {
          background: #f9fafb;
        }
        .date-cell {
          white-space: nowrap;
          color: #6b7280;
          font-size: 12px;
        }
        .type-cell {
          text-transform: capitalize;
        }
        .feature-badge {
          display: inline-block;
          padding: 2px 8px;
          background: #f3f4f6;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
        }
        .sentiment-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }
        .sentiment-badge.positive {
          background: #d1fae5;
          color: #065f46;
        }
        .sentiment-badge.neutral {
          background: #fef3c7;
          color: #92400e;
        }
        .sentiment-badge.negative {
          background: #fee2e2;
          color: #991b1b;
        }
        .comment-cell {
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #6b7280;
          font-size: 12px;
        }
        .no-comment {
          color: #d1d5db;
        }
        .empty-row {
          text-align: center;
          color: #9ca3af;
          padding: 32px 16px !important;
        }
        .delete-btn {
          background: none;
          border: none;
          color: #d1d5db;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          transition: all 0.15s;
        }
        .delete-btn:hover {
          color: #ef4444;
          background: #fee2e2;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .middle-row {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .stat-card {
            padding: 14px;
            gap: 10px;
          }
          .stat-icon {
            width: 36px;
            height: 36px;
          }
          .stat-value {
            font-size: 20px;
          }
          .table-header {
            padding: 12px 14px;
          }
          .table-actions select {
            font-size: 12px;
            padding: 5px 6px;
          }
          thead th {
            padding: 8px 10px;
            font-size: 11px;
          }
          tbody td {
            padding: 10px;
            font-size: 12px;
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
          .stat-card {
            padding: 12px;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
