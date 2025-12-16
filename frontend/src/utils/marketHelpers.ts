import { Commodity, SparklineData, TimeRange } from '@/types/market';

// Currency formatting
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format large numbers with K, M, B suffixes
export const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(1)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(1)}K`;
  }
  return num.toString();
};

// Calculate percentage change
export const calculatePercentChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Format percentage
export const formatPercent = (value: number, showSign: boolean = true): string => {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

// Generate sparkline data from price history
export const generateSparklineData = (commodity: Commodity, days: number = 7): SparklineData[] => {
  const history = commodity.history.slice(-days);
  return history.map(point => ({
    value: point.price,
    timestamp: point.date,
  }));
};

// Export commodities to CSV
export const exportToCSV = (commodities: Commodity[], filename: string = 'market_data.csv'): void => {
  // Define headers
  const headers = [
    'Name',
    'Category',
    'Origin',
    'Current Price',
    'Previous Price',
    'Change',
    'Change %',
    'Volume',
    'Unit',
    'HS Code',
    'Min Order Qty',
    'Lead Time',
    'Suppliers',
    'Last Updated'
  ];

  // Convert commodities to rows
  const rows = commodities.map(c => [
    c.name,
    c.category,
    c.origin,
    c.currentPrice.toString(),
    c.previousPrice.toString(),
    c.change.toString(),
    formatPercent(c.changePercent, false),
    c.volume.toString(),
    c.unit,
    c.hsCode || '',
    c.minOrderQuantity?.toString() || '',
    c.leadTime || '',
    c.suppliers?.toString() || '',
    c.lastUpdated || new Date().toISOString()
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Format time range for display
export const formatTimeRange = (range: TimeRange): string => {
  switch (range) {
    case TimeRange.OneDay:
      return '24 Hours';
    case TimeRange.OneWeek:
      return '7 Days';
    case TimeRange.OneMonth:
      return '1 Month';
    case TimeRange.ThreeMonths:
      return '3 Months';
    case TimeRange.SixMonths:
      return '6 Months';
    case TimeRange.OneYear:
      return '1 Year';
    case TimeRange.All:
      return 'All Time';
    default:
      return range;
  }
};

// Format date for display
export const formatDate = (dateString: string, format: 'short' | 'long' | 'time' = 'short'): string => {
  const date = new Date(dateString);

  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    case 'long':
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    case 'time':
      return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    default:
      return date.toLocaleDateString('en-IN');
  }
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 7) {
    return formatDate(dateString, 'short');
  } else if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

// Get trend direction
export const getTrendDirection = (change: number): 'up' | 'down' | 'stable' => {
  if (change > 0.5) return 'up';
  if (change < -0.5) return 'down';
  return 'stable';
};

// Get trend icon
export const getTrendIcon = (change: number): string => {
  const direction = getTrendDirection(change);
  switch (direction) {
    case 'up':
      return '↑';
    case 'down':
      return '↓';
    case 'stable':
      return '→';
    default:
      return '';
  }
};

// Get color for value (red for negative, green for positive)
export const getValueColor = (value: number): string => {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
};

// Sort commodities
export const sortCommodities = (
  commodities: Commodity[],
  sortBy: keyof Commodity,
  direction: 'asc' | 'desc' = 'desc'
): Commodity[] => {
  return [...commodities].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });
};

// Filter commodities by search query
export const filterCommodities = (
  commodities: Commodity[],
  query: string
): Commodity[] => {
  const searchTerm = query.toLowerCase();
  return commodities.filter(c =>
    c.name.toLowerCase().includes(searchTerm) ||
    c.category.toLowerCase().includes(searchTerm) ||
    c.origin.toLowerCase().includes(searchTerm)
  );
};

// Calculate moving average
export const calculateMovingAverage = (
  prices: number[],
  period: number
): number[] => {
  const result: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  return result;
};

// Get price range classification
export const getPriceRangeClass = (price: number, low52Week: number, high52Week: number): string => {
  const range = high52Week - low52Week;
  const position = ((price - low52Week) / range) * 100;

  if (position >= 80) return 'Near 52-week high';
  if (position <= 20) return 'Near 52-week low';
  if (position >= 45 && position <= 55) return 'Mid-range';
  return 'Normal trading range';
};

// Validate email for alerts
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Format volume with units
export const formatVolume = (volume: number, unit: string): string => {
  return `${formatLargeNumber(volume)} ${unit}`;
};

// Calculate RSI (Relative Strength Index)
export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) return 50; // Default neutral RSI

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const difference = prices[i] - prices[i - 1];
    if (difference > 0) {
      gains += difference;
    } else {
      losses -= difference;
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100; // No losses means RSI is 100

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return parseFloat(rsi.toFixed(2));
};

// Get market status based on time
export const getMarketStatus = (): { status: 'open' | 'closed'; message: string } => {
  const now = new Date();
  const hours = now.getHours();
  const day = now.getDay();

  // Market hours: 9 AM to 5 PM, Monday to Friday (0 = Sunday, 6 = Saturday)
  if (day === 0 || day === 6) {
    return { status: 'closed', message: 'Market closed (Weekend)' };
  }

  if (hours >= 9 && hours < 17) {
    return { status: 'open', message: 'Market open' };
  }

  return { status: 'closed', message: 'Market closed' };
};

// Generate chart colors
export const getChartColors = (index: number): string => {
  const colors = [
    '#ff6b35', // Orange
    '#667eea', // Purple
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ef4444', // Red
  ];
  return colors[index % colors.length];
};