'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface CollapsibleSectionProps {
  title: string;
  icon?: React.ElementType;
  defaultOpen?: boolean;
  children: ReactNode;
  summary?: ReactNode;
  className?: string;
}

export function CollapsibleSection({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
  summary,
  className = ''
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`collapsible-section ${className}`}>
      <button
        className="section-header-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {Icon && <Icon size={20} className="section-icon" />}
        <span className="section-title">{title}</span>
        <ChevronDown
          size={20}
          className={`chevron ${isOpen ? 'open' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="section-content-wrapper"
          >
            <div className="section-content">
              {children}
            </div>
          </motion.div>
        ) : summary ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section-summary"
          >
            {summary}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style jsx>{`
        .collapsible-section {
          background: var(--bg-secondary);
          border-radius: 14px;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .section-header-btn {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 16px;
          background: none;
          border: none;
          cursor: pointer;
          gap: 12px;
          min-height: 56px;
        }

        .section-header-btn:hover {
          background: var(--bg-tertiary);
        }

        :global(.section-icon) {
          color: #f97316;
          flex-shrink: 0;
        }

        .section-title {
          flex: 1;
          text-align: left;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        :global(.chevron) {
          color: var(--text-secondary);
          transition: transform 0.25s ease;
          flex-shrink: 0;
        }

        :global(.chevron.open) {
          transform: rotate(180deg);
        }

        .section-content-wrapper {
          overflow: hidden;
        }

        .section-content {
          padding: 0 16px 16px 16px;
        }

        .section-summary {
          padding: 0 16px 16px 16px;
        }
      `}</style>
    </div>
  );
}
