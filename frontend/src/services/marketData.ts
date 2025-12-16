import {
  Commodity,
  MarketOverview,
  PricePoint,
  MarketDataResponse,
  CommodityHistoryResponse,
  NewsItem,
  MarketEvent,
  TimeRange
} from '@/types/market';

// Mock data generator functions
const generatePriceHistory = (basePrice: number, days: number, volatility: number = 0.1): PricePoint[] => {
  const history: PricePoint[] = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate realistic price fluctuations
    const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
    currentPrice = Math.max(currentPrice + change, basePrice * 0.5);

    history.push({
      date: date.toISOString(),
      price: parseFloat(currentPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 10000) + 5000
    });
  }

  return history;
};

// Mock commodity data
const mockCommodities: Commodity[] = [
  {
    id: 'led-bulbs-syska',
    name: 'LED Bulbs (Syska)',
    category: 'Electronics',
    origin: 'China',
    currentPrice: 450.00,
    previousPrice: 485.00,
    change: -35.00,
    changePercent: -7.22,
    volume: 15000,
    unit: 'units',
    history: generatePriceHistory(450, 30, 0.08),
    description: '9W LED bulbs, warm white, pack of 10',
    hsCode: '8539.50',
    minOrderQuantity: 1000,
    leadTime: '15-20 days',
    suppliers: 12,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'mobile-acc-samsung',
    name: 'Mobile Accessories (Samsung)',
    category: 'Electronics',
    origin: 'Vietnam',
    currentPrice: 1200.00,
    previousPrice: 1150.00,
    change: 50.00,
    changePercent: 4.35,
    volume: 8500,
    unit: 'units',
    history: generatePriceHistory(1200, 30, 0.06),
    description: 'Original Samsung chargers and cables',
    hsCode: '8504.40',
    minOrderQuantity: 500,
    leadTime: '10-15 days',
    suppliers: 8,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'cotton-fabric-premium',
    name: 'Cotton Fabric (Premium)',
    category: 'Textiles',
    origin: 'Bangladesh',
    currentPrice: 850.00,
    previousPrice: 820.00,
    change: 30.00,
    changePercent: 3.66,
    volume: 25000,
    unit: 'meters',
    history: generatePriceHistory(850, 30, 0.05),
    description: '100% premium cotton fabric, 60 inch width',
    hsCode: '5208.11',
    minOrderQuantity: 5000,
    leadTime: '20-25 days',
    suppliers: 15,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'rice-basmati-1121',
    name: 'Basmati Rice 1121',
    category: 'Agricultural',
    origin: 'India',
    currentPrice: 1450.00,
    previousPrice: 1380.00,
    change: 70.00,
    changePercent: 5.07,
    volume: 50000,
    unit: 'kg',
    history: generatePriceHistory(1450, 30, 0.07),
    description: 'Premium 1121 Basmati Rice, long grain',
    hsCode: '1006.30',
    minOrderQuantity: 10000,
    leadTime: '25-30 days',
    suppliers: 20,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'smart-watches-mi',
    name: 'Smart Watches (Mi Band)',
    category: 'Electronics',
    origin: 'China',
    currentPrice: 2500.00,
    previousPrice: 2600.00,
    change: -100.00,
    changePercent: -3.85,
    volume: 5000,
    unit: 'units',
    history: generatePriceHistory(2500, 30, 0.09),
    description: 'Mi Band 7 fitness tracker',
    hsCode: '9102.12',
    minOrderQuantity: 200,
    leadTime: '12-18 days',
    suppliers: 6,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'tea-darjeeling',
    name: 'Darjeeling Tea',
    category: 'Agricultural',
    origin: 'India',
    currentPrice: 3200.00,
    previousPrice: 3000.00,
    change: 200.00,
    changePercent: 6.67,
    volume: 12000,
    unit: 'kg',
    history: generatePriceHistory(3200, 30, 0.06),
    description: 'Premium Darjeeling tea, first flush',
    hsCode: '0902.10',
    minOrderQuantity: 1000,
    leadTime: '15-20 days',
    suppliers: 10,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'laptop-bags',
    name: 'Laptop Bags',
    category: 'Consumer Goods',
    origin: 'China',
    currentPrice: 750.00,
    previousPrice: 780.00,
    change: -30.00,
    changePercent: -3.85,
    volume: 7500,
    unit: 'units',
    history: generatePriceHistory(750, 30, 0.04),
    description: 'Waterproof laptop bags, 15.6 inch',
    hsCode: '4202.92',
    minOrderQuantity: 500,
    leadTime: '18-22 days',
    suppliers: 9,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'spices-turmeric',
    name: 'Turmeric Powder',
    category: 'Agricultural',
    origin: 'India',
    currentPrice: 180.00,
    previousPrice: 175.00,
    change: 5.00,
    changePercent: 2.86,
    volume: 35000,
    unit: 'kg',
    history: generatePriceHistory(180, 30, 0.03),
    description: 'Organic turmeric powder, high curcumin',
    hsCode: '0910.30',
    minOrderQuantity: 5000,
    leadTime: '20-25 days',
    suppliers: 18,
    lastUpdated: new Date().toISOString()
  }
];

// Mock market overview
const generateMarketOverview = (): MarketOverview => {
  const topGainer = mockCommodities.reduce((max, commodity) =>
    commodity.changePercent > max.changePercent ? commodity : max
  );

  const topLoser = mockCommodities.reduce((min, commodity) =>
    commodity.changePercent < min.changePercent ? commodity : min
  );

  return {
    totalVolume: mockCommodities.reduce((sum, c) => sum + c.volume, 0),
    totalValue: mockCommodities.reduce((sum, c) => sum + (c.currentPrice * c.volume), 0),
    activeMarkets: 12,
    activeCommodities: mockCommodities.length,
    topGainer: {
      name: topGainer.name,
      change: topGainer.changePercent,
      id: topGainer.id
    },
    topLoser: {
      name: topLoser.name,
      change: topLoser.changePercent,
      id: topLoser.id
    },
    lastUpdated: new Date().toISOString()
  };
};

// Mock news data
const mockNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'LED Bulb Prices Drop Due to Oversupply',
    summary: 'Chinese manufacturers report excess inventory leading to price drops in LED bulbs across Asian markets.',
    source: 'Trade Asia Weekly',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    relatedCommodities: ['led-bulbs-syska'],
    impact: 'high',
    sentiment: 'negative',
    url: '#'
  },
  {
    id: 'news-2',
    title: 'India Increases Rice Export Quotas',
    summary: 'Government announces 20% increase in basmati rice export quotas for Q1 2025.',
    source: 'Agricultural Times',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    relatedCommodities: ['rice-basmati-1121'],
    impact: 'medium',
    sentiment: 'positive',
    url: '#'
  },
  {
    id: 'news-3',
    title: 'Vietnam Electronics Hub Expansion',
    summary: 'Samsung announces major expansion of manufacturing facilities in Vietnam.',
    source: 'Tech Trade Daily',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    relatedCommodities: ['mobile-acc-samsung'],
    impact: 'medium',
    sentiment: 'positive',
    url: '#'
  }
];

// Mock market events
const mockEvents: MarketEvent[] = [
  {
    id: 'event-1',
    title: 'China Manufacturing PMI Release',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'economic',
    impact: 'high',
    affectedCommodities: ['led-bulbs-syska', 'smart-watches-mi', 'laptop-bags'],
    description: 'Monthly manufacturing index release expected to impact electronics pricing'
  },
  {
    id: 'event-2',
    title: 'Harvest Season - India',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'seasonal',
    impact: 'medium',
    affectedCommodities: ['rice-basmati-1121', 'tea-darjeeling', 'spices-turmeric'],
    description: 'Annual harvest season begins, expected to affect agricultural commodity prices'
  }
];

// Service class
class MarketDataService {
  // Simulate API delay
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async getTrendingCommodities(filters?: any): Promise<Commodity[]> {
    await this.delay(500);

    let filteredCommodities = [...mockCommodities];

    if (filters) {
      if (filters.categories && filters.categories.length > 0) {
        filteredCommodities = filteredCommodities.filter(c =>
          filters.categories.includes(c.category)
        );
      }

      if (filters.origins && filters.origins.length > 0) {
        filteredCommodities = filteredCommodities.filter(c =>
          filters.origins.includes(c.origin)
        );
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredCommodities = filteredCommodities.filter(c =>
          c.name.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query) ||
          c.origin.toLowerCase().includes(query)
        );
      }

      // Sorting
      if (filters.sortBy) {
        filteredCommodities.sort((a, b) => {
          let aVal, bVal;
          switch (filters.sortBy) {
            case 'name':
              aVal = a.name;
              bVal = b.name;
              break;
            case 'price':
              aVal = a.currentPrice;
              bVal = b.currentPrice;
              break;
            case 'change':
              aVal = a.changePercent;
              bVal = b.changePercent;
              break;
            case 'volume':
              aVal = a.volume;
              bVal = b.volume;
              break;
            default:
              aVal = a.changePercent;
              bVal = b.changePercent;
          }

          if (filters.sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }
    }

    return filteredCommodities;
  }

  async getMarketOverview(): Promise<MarketOverview> {
    await this.delay(300);
    return generateMarketOverview();
  }

  async getCommodityById(id: string): Promise<Commodity | null> {
    await this.delay(200);
    return mockCommodities.find(c => c.id === id) || null;
  }

  async getCommodityHistory(
    commodityId: string,
    timeRange: TimeRange
  ): Promise<CommodityHistoryResponse> {
    await this.delay(400);

    const commodity = mockCommodities.find(c => c.id === commodityId);
    if (!commodity) {
      throw new Error('Commodity not found');
    }

    // Generate history based on time range
    let days = 30;
    switch (timeRange) {
      case TimeRange.OneDay:
        days = 1;
        break;
      case TimeRange.OneWeek:
        days = 7;
        break;
      case TimeRange.OneMonth:
        days = 30;
        break;
      case TimeRange.ThreeMonths:
        days = 90;
        break;
      case TimeRange.SixMonths:
        days = 180;
        break;
      case TimeRange.OneYear:
        days = 365;
        break;
      case TimeRange.All:
        days = 730;
        break;
    }

    const history = generatePriceHistory(commodity.currentPrice, days);
    const prices = history.map(h => h.price);

    return {
      success: true,
      data: {
        commodity,
        history,
        statistics: {
          high52Week: Math.max(...prices),
          low52Week: Math.min(...prices),
          average: prices.reduce((a, b) => a + b, 0) / prices.length,
          volatility: this.calculateVolatility(prices)
        }
      },
      timestamp: new Date().toISOString()
    };
  }

  async getMarketData(): Promise<MarketDataResponse> {
    await this.delay(500);

    return {
      success: true,
      data: {
        overview: generateMarketOverview(),
        trending: mockCommodities.slice(0, 5),
        watchlist: []
      },
      timestamp: new Date().toISOString()
    };
  }

  async getNews(commodityId?: string): Promise<NewsItem[]> {
    await this.delay(300);

    if (commodityId) {
      return mockNews.filter(news =>
        news.relatedCommodities.includes(commodityId)
      );
    }

    return mockNews;
  }

  async getMarketEvents(): Promise<MarketEvent[]> {
    await this.delay(300);
    return mockEvents;
  }

  async searchCommodities(query: string): Promise<Commodity[]> {
    await this.delay(200);

    const searchTerm = query.toLowerCase();
    return mockCommodities.filter(c =>
      c.name.toLowerCase().includes(searchTerm) ||
      c.category.toLowerCase().includes(searchTerm) ||
      c.origin.toLowerCase().includes(searchTerm) ||
      c.description?.toLowerCase().includes(searchTerm)
    );
  }

  async getCategories(): Promise<string[]> {
    return ['Electronics', 'Textiles', 'Agricultural', 'Industrial', 'Consumer Goods'];
  }

  async getOrigins(): Promise<string[]> {
    const origins = [...new Set(mockCommodities.map(c => c.origin))];
    return origins.sort();
  }

  async exportData(commodities: Commodity[], format: 'csv' | 'excel'): Promise<Blob> {
    await this.delay(500);

    if (format === 'csv') {
      const headers = ['Name', 'Category', 'Origin', 'Current Price', 'Change %', 'Volume'];
      const rows = commodities.map(c => [
        c.name,
        c.category,
        c.origin,
        c.currentPrice.toString(),
        c.changePercent.toFixed(2),
        c.volume.toString()
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return new Blob([csvContent], { type: 'text/csv' });
    }

    // For Excel, we'd need a library like xlsx
    // For now, return CSV with Excel mime type
    const headers = ['Name', 'Category', 'Origin', 'Current Price', 'Change %', 'Volume'];
    const rows = commodities.map(c => [
      c.name,
      c.category,
      c.origin,
      c.currentPrice.toString(),
      c.changePercent.toFixed(2),
      c.volume.toString()
    ]);

    const csvContent = [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n');

    return new Blob([csvContent], { type: 'application/vnd.ms-excel' });
  }

  private calculateVolatility(prices: number[]): number {
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance) / mean * 100; // Return as percentage
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService();

// Export mock data for direct use if needed
export { mockCommodities, mockNews, mockEvents };