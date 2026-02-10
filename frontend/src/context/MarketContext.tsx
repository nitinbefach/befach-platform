'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Commodity,
  MarketFilters,
  WatchlistItem,
  PriceAlert,
  MarketOverview,
  TimeRange
} from '@/types/market';
import { safeStorage } from '@/lib/safeStorage';

interface MarketContextType {
  // Market Data
  commodities: Commodity[];
  marketOverview: MarketOverview | null;
  loading: boolean;
  error: string | null;

  // Filters
  filters: MarketFilters;
  updateFilters: (filters: Partial<MarketFilters>) => void;
  resetFilters: () => void;

  // Watchlist
  watchlist: WatchlistItem[];
  addToWatchlist: (commodityId: string) => void;
  removeFromWatchlist: (commodityId: string) => void;
  isInWatchlist: (commodityId: string) => boolean;

  // Alerts
  alerts: PriceAlert[];
  createAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  deleteAlert: (alertId: string) => void;
  toggleAlert: (alertId: string) => void;

  // Selected Commodities for Comparison
  selectedCommodities: string[];
  toggleCommoditySelection: (commodityId: string) => void;
  clearSelectedCommodities: () => void;

  // Refresh Data
  refreshData: () => void;

  // Time Range
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const defaultFilters: MarketFilters = {
  timeRange: '1M',
  categories: [],
  origins: [],
  sortBy: 'change',
  sortDirection: 'desc'
};

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: ReactNode }) {
  // State
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MarketFilters>(defaultFilters);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.OneMonth);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        // Load watchlist
        const savedWatchlist = safeStorage.getItem('market_watchlist');
        if (savedWatchlist) {
          setWatchlist(JSON.parse(savedWatchlist));
        }

        // Load alerts
        const savedAlerts = safeStorage.getItem('market_alerts');
        if (savedAlerts) {
          setAlerts(JSON.parse(savedAlerts));
        }

        // Load filters
        const savedFilters = safeStorage.getItem('market_filters');
        if (savedFilters) {
          setFilters({ ...defaultFilters, ...JSON.parse(savedFilters) });
        }

        // Load time range
        const savedTimeRange = safeStorage.getItem('market_timerange');
        if (savedTimeRange) {
          setTimeRange(savedTimeRange as TimeRange);
        }
      } catch (error) {
        console.error('Error loading saved market data:', error);
      }
    };

    loadSavedData();
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    safeStorage.setItem('market_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    safeStorage.setItem('market_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    safeStorage.setItem('market_filters', JSON.stringify(filters));
  }, [filters]);

  // Save time range to localStorage whenever it changes
  useEffect(() => {
    safeStorage.setItem('market_timerange', timeRange);
  }, [timeRange]);

  // Filter Management
  const updateFilters = (newFilters: Partial<MarketFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Watchlist Management
  const addToWatchlist = (commodityId: string) => {
    if (!watchlist.find(item => item.commodityId === commodityId)) {
      const newItem: WatchlistItem = {
        commodityId,
        addedAt: new Date().toISOString()
      };
      setWatchlist(prev => [...prev, newItem]);
    }
  };

  const removeFromWatchlist = (commodityId: string) => {
    setWatchlist(prev => prev.filter(item => item.commodityId !== commodityId));
  };

  const isInWatchlist = (commodityId: string): boolean => {
    return watchlist.some(item => item.commodityId === commodityId);
  };

  // Alert Management
  const createAlert = (alertData: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alertData,
      id: `alert_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { ...alert, isActive: !alert.isActive }
        : alert
    ));
  };

  // Commodity Selection for Comparison
  const toggleCommoditySelection = (commodityId: string) => {
    setSelectedCommodities(prev => {
      if (prev.includes(commodityId)) {
        return prev.filter(id => id !== commodityId);
      }
      if (prev.length >= 5) {
        // Maximum 5 commodities for comparison
        return prev;
      }
      return [...prev, commodityId];
    });
  };

  const clearSelectedCommodities = () => {
    setSelectedCommodities([]);
  };

  // Refresh Data
  const refreshData = () => {
    // This will be connected to the actual API later
    setLoading(true);
    setError(null);
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // This will be replaced with actual API calls
        // For now, we'll set loading to false after a delay
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch market data');
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, timeRange]);

  const value: MarketContextType = {
    // Market Data
    commodities,
    marketOverview,
    loading,
    error,

    // Filters
    filters,
    updateFilters,
    resetFilters,

    // Watchlist
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,

    // Alerts
    alerts,
    createAlert,
    deleteAlert,
    toggleAlert,

    // Selected Commodities
    selectedCommodities,
    toggleCommoditySelection,
    clearSelectedCommodities,

    // Refresh
    refreshData,

    // Time Range
    timeRange,
    setTimeRange
  };

  return (
    <MarketContext.Provider value={value}>
      {children}
    </MarketContext.Provider>
  );
}

// Custom hook to use the MarketContext
export function useMarket() {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}

// Export specific hooks for common operations
export function useWatchlist() {
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useMarket();
  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };
}

export function useMarketFilters() {
  const { filters, updateFilters, resetFilters } = useMarket();
  return { filters, updateFilters, resetFilters };
}

export function usePriceAlerts() {
  const { alerts, createAlert, deleteAlert, toggleAlert } = useMarket();
  return { alerts, createAlert, deleteAlert, toggleAlert };
}