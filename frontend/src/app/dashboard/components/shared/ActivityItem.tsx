'use client';

import { LucideIcon } from 'lucide-react';

export interface ActivityItemProps {
  activity: {
    text: string;
    time: string;
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
  };
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = activity.icon;
  const iconColor = activity.iconColor || '#f97316';
  const iconBgColor = activity.iconBgColor || `${iconColor}15`;

  return (
    <div className="activity-item">
      <div className="activity-icon-wrapper" style={{ backgroundColor: iconBgColor }}>
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div className="activity-content">
        <p className="activity-text">{activity.text}</p>
        <span className="activity-time">{activity.time}</span>
      </div>

      <style jsx>{`
        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .activity-item:hover {
          background: #f8fafc;
        }

        .activity-icon-wrapper {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-text {
          font-size: 0.875rem;
          color: #334155;
          margin: 0 0 0.25rem 0;
          line-height: 1.4;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
