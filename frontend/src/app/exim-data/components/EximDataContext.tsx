'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  ShipmentRecord,
  TraderSummary,
  TraderDetail,
  EximSearchParams,
  EximSidebarFilters,
  EximStats,
  CountryBreakdown,
  HSCodeBreakdown,
} from '@/types/exim';
import { eximDataService } from '@/services/eximDataService';
import { captureFeatureAction } from '@/lib/posthogEvents';

export type TabId = 'shipments' | 'summary' | 'consignee' | 'shipper';

export const TABS = [
  { id: 'shipments' as TabId, label: 'Shipments' },
  { id: 'summary' as TabId, label: 'Summary' },
  { id: 'consignee' as TabId, label: 'Consignee' },
  { id: 'shipper' as TabId, label: 'Shipper' },
];

const defaultFilters: EximSidebarFilters = {
  removeDuplicates: true,
  removeToOrder: false,
  removeBankingEntity: false,
  removeShippingEntity: false,
  consigneeFilter: [],
  shipperFilter: [],
};

interface EximDataContextValue {
  // Search
  searchParams: EximSearchParams | null;
  hasSearched: boolean;
  loading: boolean;
  handleSearch: (params: EximSearchParams) => Promise<void>;

  // Results
  shipments: ShipmentRecord[];
  totalCount: number;
  stats: EximStats | null;
  consignees: TraderSummary[];
  shippers: TraderSummary[];
  countries: CountryBreakdown[];
  hsCodes: HSCodeBreakdown[];

  // Pagination & Sort
  page: number;
  sortField: string;
  sortDir: string;
  handlePageChange: (page: number) => void;
  handleSortChange: (field: string, dir: string) => void;

  // Filters
  sidebarFilters: EximSidebarFilters;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  handleFilterChange: (filters: EximSidebarFilters) => void;

  // UI
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  // Trader modal
  traderModal: { isOpen: boolean; trader: TraderDetail | null; role: 'consignee' | 'shipper' };
  openTraderModal: (id: string, role: 'consignee' | 'shipper') => Promise<void>;
  closeTraderModal: () => void;
  handleViewShipments: (name: string, role: 'consignee' | 'shipper') => void;

  // Export
  handleExportCSV: () => void;

  // Computed
  totalValue: number;
}

const EximDataContext = createContext<EximDataContextValue | null>(null);

export function EximDataProvider({ children }: { children: ReactNode }) {
  // Search state
  const [searchParams, setSearchParams] = useState<EximSearchParams | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Results state
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState<EximStats | null>(null);
  const [consignees, setConsignees] = useState<TraderSummary[]>([]);
  const [shippers, setShippers] = useState<TraderSummary[]>([]);
  const [countries, setCountries] = useState<CountryBreakdown[]>([]);
  const [hsCodes, setHsCodes] = useState<HSCodeBreakdown[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<TabId>('shipments');
  const [sidebarFilters, setSidebarFilters] = useState<EximSidebarFilters>(defaultFilters);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  // Modal state
  const [traderModal, setTraderModal] = useState<{
    isOpen: boolean;
    trader: TraderDetail | null;
    role: 'consignee' | 'shipper';
  }>({ isOpen: false, trader: null, role: 'consignee' });

  // Main search handler
  const handleSearch = useCallback(async (params: EximSearchParams) => {
    setLoading(true);
    setSearchParams(params);
    setHasSearched(true);
    setPage(1);

    try {
      const [shipmentResult, statsResult, consigneeResult, shipperResult, countryResult, hsResult] =
        await Promise.all([
          eximDataService.searchShipments(params, sidebarFilters, 1, sortField, sortDir),
          eximDataService.getStats(params),
          eximDataService.getConsignees(params),
          eximDataService.getShippers(params),
          eximDataService.getCountryBreakdown(params),
          eximDataService.getHSCodeBreakdown(params),
        ]);

      setShipments(shipmentResult.shipments);
      setTotalCount(shipmentResult.totalCount);
      setStats(statsResult);
      setConsignees(consigneeResult);
      setShippers(shipperResult);
      setCountries(countryResult);
      setHsCodes(hsResult);
      captureFeatureAction('exim_data', 'searched', { query: params.keyword, results: shipmentResult.totalCount });
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, [sidebarFilters, sortField, sortDir]);

  // Re-fetch shipments when filters/sort/page change
  const refetchShipments = useCallback(async (
    filters: EximSidebarFilters,
    pageNum: number,
    sField: string,
    sDir: string,
  ) => {
    if (!searchParams) return;
    setLoading(true);
    try {
      const result = await eximDataService.searchShipments(searchParams, filters, pageNum, sField, sDir);
      setShipments(result.shipments);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error('Refetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleFilterChange = useCallback((newFilters: EximSidebarFilters) => {
    setSidebarFilters(newFilters);
    setPage(1);
    refetchShipments(newFilters, 1, sortField, sortDir);
  }, [refetchShipments, sortField, sortDir]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    refetchShipments(sidebarFilters, newPage, sortField, sortDir);
  }, [refetchShipments, sidebarFilters, sortField, sortDir]);

  const handleSortChange = useCallback((field: string, dir: string) => {
    setSortField(field);
    setSortDir(dir);
    setPage(1);
    refetchShipments(sidebarFilters, 1, field, dir);
  }, [refetchShipments, sidebarFilters]);

  // Trader detail modal
  const openTraderModal = useCallback(async (id: string, role: 'consignee' | 'shipper') => {
    const trader = await eximDataService.getTraderDetail(id, role);
    setTraderModal({ isOpen: true, trader, role });
  }, []);

  const closeTraderModal = useCallback(() => {
    setTraderModal({ isOpen: false, trader: null, role: 'consignee' });
  }, []);

  const handleViewShipments = useCallback((name: string, role: 'consignee' | 'shipper') => {
    setTraderModal({ isOpen: false, trader: null, role: 'consignee' });
    if (searchParams) {
      const newParams: EximSearchParams = {
        ...searchParams,
        searchField: role === 'consignee' ? 'consignee' : 'shipper',
        searchTerms: [name],
        operator: 'contains',
      };
      setActiveTab('shipments');
      handleSearch(newParams);
    }
  }, [searchParams, handleSearch]);

  const handleExportCSV = useCallback(() => {
    eximDataService.exportCSV(shipments);
  }, [shipments]);

  const totalValue = shipments.reduce((sum, s) => sum + s.valueUSD, 0)
    || countries.reduce((sum, c) => sum + c.valueUSD, 0);

  const value: EximDataContextValue = {
    searchParams,
    hasSearched,
    loading,
    handleSearch,
    shipments,
    totalCount,
    stats,
    consignees,
    shippers,
    countries,
    hsCodes,
    page,
    sortField,
    sortDir,
    handlePageChange,
    handleSortChange,
    sidebarFilters,
    sidebarCollapsed,
    setSidebarCollapsed,
    handleFilterChange,
    activeTab,
    setActiveTab,
    traderModal,
    openTraderModal,
    closeTraderModal,
    handleViewShipments,
    handleExportCSV,
    totalValue,
  };

  return (
    <EximDataContext.Provider value={value}>
      {children}
    </EximDataContext.Provider>
  );
}

export function useEximData() {
  const context = useContext(EximDataContext);
  if (!context) {
    throw new Error('useEximData must be used within EximDataProvider');
  }
  return context;
}
