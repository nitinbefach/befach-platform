'use client';

import AppLayout from '@/components/layout/AppLayout';
import FeedbackDashboard from '@/components/feedback/FeedbackDashboard';

export default function FeedbackPage() {
  return (
    <AppLayout>
      <div className="feedback-page">
        <div className="content-header">
          <h1>Feedback & Reviews</h1>
          <p>Track user feedback, NPS scores, and feature satisfaction across Befach</p>
        </div>

        <FeedbackDashboard />
      </div>

      <style jsx>{`
        .feedback-page {
          max-width: 1200px;
        }
      `}</style>
    </AppLayout>
  );
}
