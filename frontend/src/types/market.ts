// Market Data Types and Interfaces

export interface PricePoint {
  date: string;
  price: number;
  volume: number;
}

export interface Commodity {
  id: string;
  name: string;
  category: 'Electronics' | 'Textiles' | 'Agricultural' | 'Industrial' | 'Consumer Goods';
  origin: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  unit: string;
  history: PricePoint[];
  description?: string;
  hsCode?: string;
  minOrderQuantity?: number;
  leadTime?: string;
  suppliers?: number;
  lastUpdated?: string;
}

export interface MarketOverview {
  totalVolume: number;
  totalValue: number;
  activeMarkets: number;
  activeCommodities: number;
  topGainer: {
    name: string;
    change: number;
    id: string;
  };
  topLoser: {
    name: string;
    change: number;
    id: string;
  };
  lastUpdated: string;
}

export interface MarketFilters {
  timeRange: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
  categories: string[];
  origins: string[];
  priceRange?: [number, number];
  searchQuery?: string;
  sortBy?: 'name' | 'price' | 'change' | 'volume';
  sortDirection?: 'asc' | 'desc';
}

export interface WatchlistItem {
  commodityId: string;
  addedAt: string;
  targetPrice?: number;
  notes?: string;
}

export interface PriceAlert {
  id: string;
  commodityId: string;
  commodityName: string;
  condition: 'above' | 'below' | 'change';
  threshold: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
  notificationMethod: 'email' | 'sms' | 'push' | 'all';
}

export interface TradeRoute {
  origin: string;
  destination: string;
  commodities: string[];
  averageLeadTime: number;
  totalVolume: number;
}

export interface MarketTrend {
  period: string;
  trend: 'bullish' | 'bearish' | 'stable';
  confidence: number;
  factors: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  relatedCommodities: string[];
  impact: 'low' | 'medium' | 'high';
  sentiment: 'positive' | 'negative' | 'neutral';
  url?: string;
}

export interface MarketEvent {
  id: string;
  title: string;
  date: string;
  type: 'economic' | 'seasonal' | 'regulatory' | 'geopolitical';
  impact: 'low' | 'medium' | 'high';
  affectedCommodities: string[];
  description: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
  }[];
}

export interface SparklineData {
  value: number;
  timestamp: string;
}

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
  format: 'csv' | 'excel' | 'pdf';
}

// API Response Types
export interface MarketDataResponse {
  success: boolean;
  data: {
    overview: MarketOverview;
    trending: Commodity[];
    watchlist?: Commodity[];
  };
  timestamp: string;
  error?: string;
}

export interface CommodityHistoryResponse {
  success: boolean;
  data: {
    commodity: Commodity;
    history: PricePoint[];
    statistics: {
      high52Week: number;
      low52Week: number;
      average: number;
      volatility: number;
    };
  };
  timestamp: string;
}

// Enums for constants
export enum TimeRange {
  OneDay = '1D',
  OneWeek = '1W',
  OneMonth = '1M',
  ThreeMonths = '3M',
  SixMonths = '6M',
  OneYear = '1Y',
  All = 'ALL'
}

export enum CommodityCategory {
  Electronics = 'Electronics',
  Textiles = 'Textiles',
  Agricultural = 'Agricultural',
  Industrial = 'Industrial',
  ConsumerGoods = 'Consumer Goods'
}

export enum TradingStatus {
  Open = 'open',
  Closed = 'closed',
  Holiday = 'holiday',
  Suspended = 'suspended'
}