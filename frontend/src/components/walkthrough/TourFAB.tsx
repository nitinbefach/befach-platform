'use client';

import { Compass } from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';

interface TourFABProps {
  onStart: () => void;
}

export default function TourFAB({ onStart }: TourFABProps) {
  const { isMobile } = useMobile();

  return (
    <>
      <button
        className="tour-fab"
        onClick={onStart}
        title="Take a Tour"
        aria-label="Take a guided tour"
      >
        <Compass size={isMobile ? 20 : 22} />
      </button>
      <style jsx>{`
        .tour-fab {
          position: fixed;
          bottom: ${isMobile ? 'calc(150px + env(safe-area-inset-bottom, 0px))' : '84px'};
          right: ${isMobile ? '16px' : '24px'};
          z-index: 900;
          width: ${isMobile ? '46px' : '48px'};
          height: ${isMobile ? '46px' : '48px'};
          border-radius: 50%;
          background: #ffffff;
          color: #f97316;
          border: 2px solid #fed7aa;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        .tour-fab:hover {
          background: #f97316;
          color: #ffffff;
          border-color: #f97316;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}
