'use client';

interface EmptyStateProps {
  searchQuery: string;
  onSubmitRequirement: () => void;
  onInviteSupplier: () => void;
}

export default function EmptyState({ searchQuery, onSubmitRequirement, onInviteSupplier }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon">🔍</div>
      <h2>No suppliers found for your search</h2>
      <p>We searched our database but couldn&apos;t find suppliers matching &ldquo;{searchQuery || 'your criteria'}&rdquo;</p>
      <div className="empty-cta">
        <div className="cta-box primary">
          <h3>💡 Let us find suppliers FOR you</h3>
          <p>Share your requirement and our team will identify and verify matching suppliers within 24-48 hours.</p>
          <button className="btn-submit-req" onClick={onSubmitRequirement}>Share Your Requirement →</button>
        </div>
        <div className="cta-divider">OR</div>
        <div className="cta-box secondary">
          <p>Already have a supplier in mind?</p>
          <button className="btn-invite" onClick={onInviteSupplier}>Invite them to Befach</button>
        </div>
      </div>
      <style jsx>{`
        .empty-state { text-align: center; padding: 60px 20px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; }
        .empty-icon { font-size: 4rem; margin-bottom: 20px; }
        .empty-state h2 { font-size: 1.5rem; color: var(--text-primary); margin: 0 0 12px; }
        .empty-state > p { color: var(--text-secondary); margin: 0 0 40px; }
        .empty-cta { max-width: 500px; margin: 0 auto; }
        .cta-box { background: var(--bg-secondary); border-radius: 16px; padding: 24px; margin-bottom: 20px; }
        .cta-box.primary { border: 1px solid rgba(249, 115, 22, 0.3); }
        .cta-box h3 { color: #f97316; margin: 0 0 12px; }
        .cta-box p { color: var(--text-secondary); margin: 0 0 16px; line-height: 1.5; }
        .btn-submit-req { background: linear-gradient(135deg, #f97316, #ea580c); color: white; border: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-submit-req:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4); }
        .cta-divider { color: var(--text-muted); margin: 20px 0; }
        .cta-box.secondary { background: transparent; border: 1px dashed var(--border-color); }
        .btn-invite { background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); padding: 12px 24px; border-radius: 8px; font-weight: 500; cursor: pointer; }
        .btn-invite:hover { border-color: var(--accent-primary); }
      `}</style>
    </div>
  );
}
