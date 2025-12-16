'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import {
  Calculator,
  TrendingUp,
  Package,
  DollarSign,
  Clock,
  ArrowRight,
  FileText,
  BarChart3,
  Upload,
  History,
  Plus,
  Eye,
  Copy,
  Trash2
} from 'lucide-react';
import styles from './page.module.css';

interface RecentCalculation {
  id: string;
  productName: string;
  hsnCode: string;
  totalCost: number;
  createdAt: string;
  origin: string;
  quantity: number;
}

export default function CostCalculatorLanding() {
  const router = useRouter();
  const [recentCalculations, setRecentCalculations] = useState<RecentCalculation[]>([]);
  const [stats, setStats] = useState({
    totalCalculations: 0,
    averageCost: 0,
    totalDutySaved: 0,
    lastCalculated: null as Date | null,
  });

  useEffect(() => {
    // Load recent calculations from localStorage
    const loadRecentCalculations = () => {
      const saved = localStorage.getItem('befach-calculations-history');
      if (saved) {
        try {
          const history = JSON.parse(saved);
          const recent = history
            .slice(0, 5)
            .map((calc: any) => ({
              id: calc.id,
              productName: calc.input?.productName || 'Unknown Product',
              hsnCode: calc.input?.hsnCode || 'N/A',
              totalCost: calc.totalLandedCost || 0,
              createdAt: calc.calculatedAt,
              origin: calc.input?.originCountry || 'Unknown',
              quantity: calc.input?.quantity || 0,
            }));
          setRecentCalculations(recent);

          // Calculate stats
          const totalCalcs = history.length;
          const avgCost = history.reduce((acc: number, calc: any) =>
            acc + (calc.totalLandedCost || 0), 0) / (totalCalcs || 1);
          const totalDuty = history.reduce((acc: number, calc: any) =>
            acc + (calc.totalDuties || 0), 0);
          const lastCalc = history[0]?.calculatedAt ? new Date(history[0].calculatedAt) : null;

          setStats({
            totalCalculations: totalCalcs,
            averageCost: avgCost,
            totalDutySaved: totalDuty * 0.1, // Assuming 10% savings
            lastCalculated: lastCalc,
          });
        } catch (error) {
          console.error('Error loading calculations:', error);
        }
      }
    };

    loadRecentCalculations();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDeleteCalculation = (id: string) => {
    const saved = localStorage.getItem('befach-calculations-history');
    if (saved) {
      const history = JSON.parse(saved);
      const updated = history.filter((calc: any) => calc.id !== id);
      localStorage.setItem('befach-calculations-history', JSON.stringify(updated));
      setRecentCalculations(prev => prev.filter(calc => calc.id !== id));
    }
  };

  return (
    <AppLayout searchPlaceholder="Search calculations...">
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <Calculator className={styles.heroIcon} />
            Landed Cost Calculator
          </h1>
          <p className={styles.heroDescription}>
            Calculate complete import costs including customs duties, GST, freight, and insurance with our intelligent step-by-step wizard
          </p>
        </div>

        <div className={styles.heroCTA}>
          <button
            onClick={() => router.push('/cost-calculator/new')}
            className={styles.ctaButton}
          >
            <Plus size={20} />
            Start New Calculation
            <ArrowRight size={18} />
          </button>
          <div className={styles.ctaSubtext}>
            Takes only 2 minutes • No registration required
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Calculator />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalCalculations}</div>
            <div className={styles.statLabel}>Total Calculations</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <TrendingUp />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{formatCurrency(stats.averageCost)}</div>
            <div className={styles.statLabel}>Average Cost</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <DollarSign />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{formatCurrency(stats.totalDutySaved)}</div>
            <div className={styles.statLabel}>Estimated Savings</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Clock />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {stats.lastCalculated
                ? `${Math.floor((Date.now() - stats.lastCalculated.getTime()) / (1000 * 60 * 60))}h ago`
                : 'Never'
              }
            </div>
            <div className={styles.statLabel}>Last Calculated</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <button
            className={styles.actionCard}
            onClick={() => router.push('/cost-calculator/new')}
          >
            <Calculator className={styles.actionIcon} />
            <span>New Calculation</span>
          </button>

          <Link href="/cost-calculator/history" className={styles.actionCard}>
            <History className={styles.actionIcon} />
            <span>View History</span>
          </Link>

          <button className={styles.actionCard}>
            <FileText className={styles.actionIcon} />
            <span>Load Template</span>
          </button>

          <button className={styles.actionCard}>
            <Upload className={styles.actionIcon} />
            <span>Import CSV</span>
          </button>

          <button className={styles.actionCard}>
            <BarChart3 className={styles.actionIcon} />
            <span>Compare Costs</span>
          </button>
        </div>
      </div>

      {/* Recent Calculations */}
      {recentCalculations.length > 0 && (
        <div className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Calculations</h2>
            <Link href="/cost-calculator/history" className={styles.viewAllLink}>
              View All History
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.recentTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCell}>Product</div>
              <div className={styles.tableCell}>HSN Code</div>
              <div className={styles.tableCell}>Origin</div>
              <div className={styles.tableCell}>Quantity</div>
              <div className={styles.tableCell}>Total Cost</div>
              <div className={styles.tableCell}>Date</div>
              <div className={styles.tableCell}>Actions</div>
            </div>

            {recentCalculations.map((calc) => (
              <div key={calc.id} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <div className={styles.productName}>{calc.productName}</div>
                </div>
                <div className={styles.tableCell}>
                  <span className={styles.hsnCode}>{calc.hsnCode}</span>
                </div>
                <div className={styles.tableCell}>{calc.origin}</div>
                <div className={styles.tableCell}>{calc.quantity}</div>
                <div className={styles.tableCell}>
                  <span className={styles.totalCost}>{formatCurrency(calc.totalCost)}</span>
                </div>
                <div className={styles.tableCell}>
                  <span className={styles.date}>{formatDate(calc.createdAt)}</span>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => router.push(`/cost-calculator/results/${calc.id}`)}
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className={styles.actionBtn}
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleDeleteCalculation(calc.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recentCalculations.length === 0 && (
        <div className={styles.emptyState}>
          <Package size={64} className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No calculations yet</h3>
          <p className={styles.emptyDescription}>
            Start your first landed cost calculation to see it appear here
          </p>
          <button
            onClick={() => router.push('/cost-calculator/new')}
            className={styles.emptyButton}
          >
            <Plus size={20} />
            Create Your First Calculation
          </button>
        </div>
      )}
    </AppLayout>
  );
}