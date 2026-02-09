'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserModeContext';
import calculatorService from '@/services/calculatorService';
import { CalculationRecord } from '@/types/calculator';
import { LucideIcon } from 'lucide-react';
import {
  Package, TrendingUp, Users, Brain,
  Star, FileText, ShoppingCart, DollarSign,
  Clock, AlertCircle, CheckCircle
} from 'lucide-react';

// ============ TYPES ============

export interface SubmittedRequirement {
  id: string;
  productDescription: string;
  quantity: string;
  unit: string;
  targetPrice: string;
  additionalDetails: string;
  status: 'Pending' | 'In Review' | 'Sourcing' | 'Completed';
  submittedAt: string;
}

export interface MetricData {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
  subValue: string;
  change: string;
}

export interface DetailedMetric {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export interface QuickAction {
  icon: LucideIcon;
  title: string;
  count: string;
  href: string;
  color: string;
}

export interface ActiveOrder {
  id: string;
  product: string;
  status: string;
  statusColor: string;
  eta: string;
  value: string;
  supplier: string;
}

export interface Activity {
  icon: LucideIcon;
  text: string;
  time: string;
}

export interface TopSupplier {
  name: string;
  orders: number;
  value: string;
  rating: number;
  country: string;
}

export interface MarketInsight {
  commodity: string;
  hsn: string;
  origin: string;
  value: string;
  growth: string;
  color: string;
}

// ============ CONSTANTS ============

export const COLORS = ['#f97316', '#8b5cf6', '#10b981', '#3b82f6'];

// ============ MOCK DATA ============

export const orderData = [
  { month: 'Jan', orders: 12, revenue: 24500, savings: 2940 },
  { month: 'Feb', orders: 19, revenue: 38200, savings: 4584 },
  { month: 'Mar', orders: 15, revenue: 31500, savings: 3780 },
  { month: 'Apr', orders: 25, revenue: 52000, savings: 6240 },
  { month: 'May', orders: 22, revenue: 47300, savings: 5676 },
  { month: 'Jun', orders: 30, revenue: 64800, savings: 7776 },
];

export const savingsData = [
  { name: 'Electronics', value: 35, savings: 8540 },
  { name: 'Textiles', value: 25, savings: 6100 },
  { name: 'Machinery', value: 20, savings: 4880 },
  { name: 'Others', value: 20, savings: 4880 },
];

export const supplierPerformance = [
  { subject: 'Quality', A: 90, fullMark: 100 },
  { subject: 'Delivery Time', A: 85, fullMark: 100 },
  { subject: 'Price', A: 92, fullMark: 100 },
  { subject: 'Communication', A: 88, fullMark: 100 },
  { subject: 'Flexibility', A: 80, fullMark: 100 },
];

export const shipmentStatus = [
  { status: 'In Transit', count: 8, color: '#3b82f6' },
  { status: 'Delivered', count: 24, color: '#10b981' },
  { status: 'Processing', count: 5, color: '#f59e0b' },
  { status: 'Delayed', count: 2, color: '#ef4444' },
];

export const costComparison = [
  { month: 'Jan', market: 26500, actual: 24500 },
  { month: 'Feb', market: 41200, actual: 38200 },
  { month: 'Mar', market: 34000, actual: 31500 },
  { month: 'Apr', market: 56100, actual: 52000 },
  { month: 'May', market: 51000, actual: 47300 },
  { month: 'Jun', market: 69900, actual: 64800 },
];

export const topSuppliers: TopSupplier[] = [
  { name: 'Nitin Supplier', orders: 12, value: '$28,500', rating: 4.8, country: 'India' },
  { name: 'Global Tech Parts', orders: 18, value: '$42,300', rating: 4.9, country: 'China' },
  { name: 'Asia Manufacturing Co', orders: 8, value: '$19,800', rating: 4.6, country: 'Vietnam' },
  { name: 'Euro Components Ltd', orders: 15, value: '$35,200', rating: 4.7, country: 'Germany' },
];

export const activeOrdersData: ActiveOrder[] = [
  {
    id: 'ORD-2024-0847',
    product: 'Organic Turmeric Powder',
    status: 'In Transit',
    statusColor: '#f59e0b',
    eta: 'Dec 5, 2024',
    value: '$2,500',
    supplier: 'Nitin Supplier',
  },
  {
    id: 'ORD-2024-0812',
    product: 'Black Pepper - Premium Grade',
    status: 'Customs Clearance',
    statusColor: '#3b82f6',
    eta: 'Dec 1, 2024',
    value: '$3,850',
    supplier: 'Global Tech Parts',
  }
];

export const recentActivityData: Activity[] = [
  { icon: Package, text: 'Order ORD-2024-0847 shipped from Vietnam', time: '2 hours ago' },
  { icon: FileText, text: 'Commercial Invoice generated', time: '5 hours ago' },
  { icon: CheckCircle, text: 'Quote accepted for Organic Turmeric', time: '2 days ago' },
];

export const marketInsightsData: MarketInsight[] = [
  { commodity: 'LED Bulbs', hsn: '94054090', origin: 'China', value: '$850M', growth: '+12%', color: '#10b981' },
  { commodity: 'Mobile Accessories', hsn: '85177900', origin: 'Vietnam', value: '$650M', growth: '+18%', color: '#10b981' },
  { commodity: 'Textiles', hsn: '52085100', origin: 'Bangladesh', value: '$1.2B', growth: '-5%', color: '#ef4444' },
];

// ============ HELPER FUNCTIONS ============

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

// ============ CONTEXT ============

interface DashboardContextValue {
  // User/org info
  organization: { name?: string } | null;

  // Computed metrics
  metrics: MetricData[];
  detailedMetrics: DetailedMetric[];
  quickActions: QuickAction[];

  // Dynamic data
  requirements: SubmittedRequirement[];
  recentCalculations: CalculationRecord[];

  // Static data (for charts)
  activeOrders: ActiveOrder[];
  recentActivity: Activity[];
  marketInsights: MarketInsight[];

  // Loading states
  calculationsLoading: boolean;

  // Tour state
  showTour: boolean;
  setShowTour: (show: boolean) => void;
  handleCompleteTour: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const { organization, hasCompletedTour, completeTour } = useUser();

  // State
  const [showTour, setShowTour] = useState(false);
  const [requirements, setRequirements] = useState<SubmittedRequirement[]>([]);
  const [recentCalculations, setRecentCalculations] = useState<CalculationRecord[]>([]);
  const [calculationsLoading, setCalculationsLoading] = useState(false);

  // Tour effect
  useEffect(() => {
    if (searchParams.get('tour') === 'true' && !hasCompletedTour) {
      setShowTour(true);
    }
  }, [searchParams, hasCompletedTour]);

  // Load requirements from localStorage
  useEffect(() => {
    const loadRequirements = () => {
      const saved = localStorage.getItem('befach-requirements');
      if (saved) {
        try {
          const allRequirements = JSON.parse(saved);
          setRequirements(allRequirements.slice(0, 5));
        } catch (error) {
          console.error('Error loading requirements:', error);
        }
      }
    };
    loadRequirements();
  }, []);

  // Load calculations
  useEffect(() => {
    const loadCalculations = async () => {
      setCalculationsLoading(true);
      try {
        const calculations = await calculatorService.getRecentCalculations(5);
        setRecentCalculations(calculations);
      } catch (error) {
        console.error('Error loading calculations:', error);
      } finally {
        setCalculationsLoading(false);
      }
    };
    loadCalculations();
  }, []);

  // Compute metrics
  const totalOrders = orderData.reduce((sum, item) => sum + item.orders, 0);
  const totalSpend = orderData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSavings = orderData.reduce((sum, item) => sum + item.savings, 0);
  const avgSavingsPercent = ((totalSavings / totalSpend) * 100).toFixed(1);

  const metrics: MetricData[] = [
    {
      label: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      trend: '+12%',
      trendUp: true,
      subValue: `${orderData[orderData.length - 1].orders} this month`,
      change: '+8 from last month'
    },
    {
      label: 'Total Spend',
      value: `$${(totalSpend / 1000).toFixed(0)}K`,
      icon: DollarSign,
      trend: '+18%',
      trendUp: true,
      subValue: `$${(orderData[orderData.length - 1].revenue / 1000).toFixed(1)}K this month`,
      change: 'vs last month'
    },
    {
      label: 'Active Suppliers',
      value: '12',
      icon: Users,
      trend: '+25%',
      trendUp: true,
      subValue: '8 countries',
      change: '3 added this month'
    },
    {
      label: 'Avg. Savings',
      value: `${avgSavingsPercent}%`,
      icon: TrendingUp,
      trend: '+3%',
      trendUp: true,
      subValue: `$${(totalSavings / 1000).toFixed(0)}K saved`,
      change: 'vs market price'
    },
  ];

  const detailedMetrics: DetailedMetric[] = [
    { label: 'On-Time Delivery', value: '94%', icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Supplier Rating', value: '4.7/5', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Pending Approvals', value: '3', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Completed Orders', value: '24', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const quickActions: QuickAction[] = [
    {
      icon: FileText,
      title: 'Share Requirement',
      count: requirements.length > 0 ? `${requirements.length} active` : 'Start now',
      href: '/share-requirement',
      color: '#3b82f6'
    },
    {
      icon: Package,
      title: 'Track Shipment',
      count: '1 in transit',
      href: '/track-shipment',
      color: '#10b981'
    },
    {
      icon: Users,
      title: 'Find Suppliers',
      count: '12 saved',
      href: '/suppliers',
      color: '#f59e0b'
    },
    {
      icon: Brain,
      title: 'AI Assistant',
      count: 'Available',
      href: '/ai-assistant',
      color: '#8b5cf6'
    },
  ];

  const handleCompleteTour = () => {
    setShowTour(false);
    completeTour();
  };

  const value: DashboardContextValue = {
    organization,
    metrics,
    detailedMetrics,
    quickActions,
    requirements,
    recentCalculations,
    activeOrders: activeOrdersData,
    recentActivity: recentActivityData,
    marketInsights: marketInsightsData,
    calculationsLoading,
    showTour,
    setShowTour,
    handleCompleteTour,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
