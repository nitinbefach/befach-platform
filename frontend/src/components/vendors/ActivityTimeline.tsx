'use client';

import { useState, useMemo } from 'react';
import { VendorActivity, ACTIVITY_TYPE_CONFIG, formatActivityDate, groupActivitiesByDate } from '@/lib/vendors';

interface ActivityTimelineProps {
  activities: VendorActivity[];
  limit?: number;
  showFilters?: boolean;
  showAddNote?: boolean;
  onAddNote?: (note: string) => void;
}

type ActivityFilter = VendorActivity['type'] | 'all';

export function ActivityTimeline({
  activities,
  limit,
  showFilters = true,
  showAddNote = false,
  onAddNote
}: ActivityTimelineProps) {
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Filter activities
  const filteredActivities = useMemo(() => {
    let result = filter === 'all'
      ? activities
      : activities.filter(a => a.type === filter);

    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }, [activities, filter, limit]);

  // Group by date
  const groupedActivities = useMemo(() =>
    groupActivitiesByDate(filteredActivities),
    [filteredActivities]
  );

  // Get unique activity types for filter
  const availableTypes = useMemo(() => {
    const types = new Set(activities.map(a => a.type));
    return Array.from(types);
  }, [activities]);

  const handleAddNote = () => {
    if (newNote.trim() && onAddNote) {
      onAddNote(newNote.trim());
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  if (activities.length === 0) {
    return (
      <div className="activity-timeline empty">
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p>No activity recorded yet</p>
          {showAddNote && onAddNote && (
            <button className="add-note-btn" onClick={() => setIsAddingNote(true)}>
              Add a note
            </button>
          )}
        </div>

        <style jsx>{`
          .activity-timeline.empty {
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
            margin: 0 0 16px 0;
            font-size: 14px;
          }

          .add-note-btn {
            padding: 8px 16px;
            background: var(--accent-primary);
            border: none;
            border-radius: 6px;
            color: white;
            font-size: 13px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="activity-timeline">
      {/* Header with filters */}
      {showFilters && (
        <div className="timeline-header">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {availableTypes.map(type => {
              const config = ACTIVITY_TYPE_CONFIG[type];
              const IconComponent = config.icon;
              return (
                <button
                  key={type}
                  className={`filter-tab ${filter === type ? 'active' : ''}`}
                  onClick={() => setFilter(type)}
                >
                  <span className="filter-icon"><IconComponent size={12} /></span>
                  {config.label}
                </button>
              );
            })}
          </div>

          {showAddNote && onAddNote && !isAddingNote && (
            <button className="add-note-trigger" onClick={() => setIsAddingNote(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Note
            </button>
          )}
        </div>
      )}

      {/* Add Note Form */}
      {isAddingNote && (
        <div className="add-note-form">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note..."
            rows={3}
            autoFocus
          />
          <div className="add-note-actions">
            <button className="cancel-btn" onClick={() => { setIsAddingNote(false); setNewNote(''); }}>
              Cancel
            </button>
            <button
              className="save-btn"
              onClick={handleAddNote}
              disabled={!newNote.trim()}
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="timeline-content">
        {Object.entries(groupedActivities).map(([date, dayActivities]) => (
          <div key={date} className="timeline-day">
            <div className="day-header">
              <span className="day-date">{date}</span>
            </div>

            <div className="day-activities">
              {dayActivities.map((activity, index) => {
                const config = ACTIVITY_TYPE_CONFIG[activity.type];
                const IconComponent = config.icon;
                return (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-connector">
                      <div
                        className="activity-icon"
                        style={{
                          background: `${config.color}20`,
                          color: config.color
                        }}
                      >
                        <IconComponent size={16} />
                      </div>
                      {index < dayActivities.length - 1 && (
                        <div className="connector-line" />
                      )}
                    </div>

                    <div className="activity-content">
                      <div className="activity-header">
                        <h4 className="activity-title">{activity.title}</h4>
                        <span className="activity-time">
                          {formatActivityDate(activity.createdAt)}
                        </span>
                      </div>
                      <p className="activity-description">{activity.description}</p>

                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="activity-metadata">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <span key={key} className="metadata-tag">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Show More */}
      {limit && activities.length > limit && (
        <div className="show-more">
          <button className="show-more-btn">
            View all {activities.length} activities
          </button>
        </div>
      )}

      <style jsx>{`
        .activity-timeline {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
        }

        .timeline-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-tertiary);
        }

        .filter-tabs {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .filter-tab {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: transparent;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-tab:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .filter-tab.active {
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-weight: 500;
        }

        .filter-icon {
          font-size: 12px;
        }

        .add-note-trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--accent-primary);
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .add-note-form {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-tertiary);
        }

        .add-note-form textarea {
          width: 100%;
          padding: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          resize: none;
        }

        .add-note-form textarea:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .add-note-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 10px;
        }

        .cancel-btn {
          padding: 8px 14px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
        }

        .save-btn {
          padding: 8px 14px;
          background: var(--accent-primary);
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 13px;
          cursor: pointer;
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .timeline-content {
          padding: 16px;
        }

        .timeline-day {
          margin-bottom: 20px;
        }

        .timeline-day:last-child {
          margin-bottom: 0;
        }

        .day-header {
          margin-bottom: 12px;
        }

        .day-date {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .day-activities {
          display: flex;
          flex-direction: column;
        }

        .activity-item {
          display: flex;
          gap: 12px;
        }

        .activity-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 32px;
          flex-shrink: 0;
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .connector-line {
          width: 2px;
          flex: 1;
          min-height: 16px;
          background: var(--border-color);
          margin: 4px 0;
        }

        .activity-content {
          flex: 1;
          padding-bottom: 16px;
        }

        .activity-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 4px;
        }

        .activity-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .activity-time {
          font-size: 11px;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .activity-description {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        .activity-metadata {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .metadata-tag {
          padding: 2px 8px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .show-more {
          padding: 12px 16px;
          border-top: 1px solid var(--border-color);
          text-align: center;
        }

        .show-more-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
        }

        .show-more-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}

export default ActivityTimeline;
