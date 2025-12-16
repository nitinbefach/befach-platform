interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  iconBgColor?: string;
}

export default function StatCard({ label, value, trend, icon, iconBgColor = 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)' }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
          <div className="stat-trend">{trend}</div>
        </div>
        <div className="stat-icon-box" style={{ background: iconBgColor }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

