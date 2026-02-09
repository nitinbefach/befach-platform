'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import {
  FaHistory,
  FaSearch,
  FaFilter,
  FaDownload,
  FaTrash,
  FaEye,
  FaCopy,
  FaStar,
  FaRegStar,
  FaChevronLeft,
  FaChevronRight,
  FaTable,
  FaTh,
  FaFileExcel,
  FaFilePdf,
  FaFileCsv,
  FaSortAmountDown,
  FaSortAmountUp,
  FaCalendarAlt,
} from 'react-icons/fa';
import { historyStorage, type CalculationRecord, type FilterCriteria } from '@/lib/historyStorage';
import calculatorService from '@/services/calculatorService';
import { CalculationRecord as APICalculationRecord } from '@/types/calculator';
import styles from './page.module.css';

const ITEMS_PER_PAGE = 10;

export default function HistoryPage() {
  const router = useRouter();
  const { triggerTimeBasedFeedback, promptElement } = useFeedbackTrigger();

  useEffect(() => {
    triggerTimeBasedFeedback('cost-calculator-history', 20000);
  }, [triggerTimeBasedFeedback]);

  // State
  const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
  const [filteredCalculations, setFilteredCalculations] = useState<CalculationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [sortBy, setSortBy] = useState<'date' | 'cost' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState<FilterCriteria>({
    dateRange: undefined,
    costRange: undefined,
    shippingModes: [],
    isFavorite: undefined,
  });

  // Convert API record format to legacy format for backward compatibility
  const convertAPIToLegacy = (apiRecord: any): CalculationRecord => {
    return {
      id: apiRecord.id,
      version: 1, // Add version field for compatibility
      input: {
        productName: apiRecord.input?.productDetails?.productName || apiRecord.input?.productName || '',
        hsnCode: apiRecord.input?.productDetails?.hsnCode || apiRecord.input?.hsnCode || '',
        fobValue: (apiRecord.input?.productDetails?.fobValue || apiRecord.input?.fobValue || 0).toString(),
        currency: apiRecord.input?.productDetails?.currency || apiRecord.input?.currency || 'USD',
        weight: (apiRecord.input?.productDetails?.weight || apiRecord.input?.weight)?.toString(),
        dutyRate: (apiRecord.result?.duties?.dutyRate || apiRecord.result?.dutyRate || 0).toString(),
        shippingMode: apiRecord.input?.shippingDetails?.shippingMode || apiRecord.input?.shippingMode || '',
        originPort: apiRecord.input?.shippingDetails?.originPort || apiRecord.input?.originPort || '',
        destinationPort: apiRecord.input?.shippingDetails?.destinationPort || apiRecord.input?.destinationPort || '',
        estimatedDays: (apiRecord.input?.shippingDetails?.transitDays || apiRecord.input?.estimatedDays)?.toString(),
        freightCost: (apiRecord.input?.shippingDetails?.freightCost || apiRecord.input?.freightCost || 0).toString(),
        insuranceRequired: apiRecord.input?.shippingDetails?.insuranceRequired || apiRecord.input?.insuranceRequired || false,
        insuranceAmount: (apiRecord.input?.shippingDetails?.insuranceAmount || apiRecord.input?.insuranceAmount)?.toString(),
        packingCharges: (apiRecord.input?.additionalCosts?.packingCharges || apiRecord.input?.packingCharges)?.toString(),
        inlandFreight: (apiRecord.input?.additionalCosts?.inlandFreight || apiRecord.input?.inlandFreight)?.toString(),
        customCharges: apiRecord.input?.additionalCosts?.customCharges || apiRecord.input?.customCharges || [],
        totalAdditionalCosts: (apiRecord.result?.additionalCosts?.totalAdditional || apiRecord.result?.totalAdditionalCosts || 0).toString()
      },
      result: {
        cifValue: apiRecord.result?.cifValue?.totalCif || apiRecord.result?.cifValue || 0,
        customsDuty: apiRecord.result?.duties?.basicCustomsDuty || apiRecord.result?.customsDuty || 0,
        gst: apiRecord.result?.duties?.igst || apiRecord.result?.gst || 0,
        totalLandedCost: apiRecord.result?.totalCost?.landedCost || apiRecord.result?.totalLandedCost || 0,
        breakdownPercentages: apiRecord.result?.totalCost?.costBreakdown || apiRecord.result?.breakdownPercentages || {}
      },
      metadata: apiRecord.metadata || { calculatedAt: new Date().toISOString() }
    };
  };

  // Load calculations
  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = async () => {
    setLoading(true);
    try {
      // Try fetching from API first
      const response = await calculatorService.getCalculations({
        page: 1,
        limit: 1000, // Fetch all for now, will handle pagination later
        sortBy: sortBy === 'name' ? undefined : sortBy,
        sortOrder
      });

      if (response.data && response.data.length > 0) {
        // Convert API records to legacy format
        const convertedRecords = response.data.map(convertAPIToLegacy);
        setCalculations(convertedRecords);
        setFilteredCalculations(convertedRecords);
      } else {
        // If no data from API, try localStorage
        const localRecords = historyStorage.getAll({
          sortBy,
          sortOrder,
        });
        setCalculations(localRecords);
        setFilteredCalculations(localRecords);
      }
    } catch (error) {
      console.error('Error fetching from API, falling back to localStorage:', error);
      // Fallback to localStorage
      const localRecords = historyStorage.getAll({
        sortBy,
        sortOrder,
      });
      setCalculations(localRecords);
      setFilteredCalculations(localRecords);
    } finally {
      setLoading(false);
    }
  };

  // Apply search and filters
  useEffect(() => {
    let filtered = [...calculations];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(calc => {
        const searchText = [
          calc.input.productName,
          calc.input.hsnCode,
          calc.input.originPort,
          calc.input.destinationPort,
          calc.metadata.notes,
        ].filter(Boolean).join(' ').toLowerCase();
        return searchText.includes(searchQuery.toLowerCase());
      });
    }

    // Apply filters
    if (filters.isFavorite !== undefined) {
      filtered = filtered.filter(calc => calc.metadata.isFavorite === filters.isFavorite);
    }

    if (filters.shippingModes && filters.shippingModes.length > 0) {
      filtered = filtered.filter(calc =>
        filters.shippingModes!.includes(calc.input.shippingMode)
      );
    }

    if (filters.dateRange) {
      filtered = filtered.filter(calc => {
        const date = new Date(calc.metadata.calculatedAt);
        return date >= filters.dateRange!.start && date <= filters.dateRange!.end;
      });
    }

    if (filters.costRange && filters.costRange.min !== undefined) {
      filtered = filtered.filter(calc => {
        if (!calc.result) return false;
        return calc.result.totalLandedCost >= filters.costRange!.min &&
               calc.result.totalLandedCost <= filters.costRange!.max;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.metadata.calculatedAt).getTime() -
                      new Date(b.metadata.calculatedAt).getTime();
          break;
        case 'cost':
          comparison = (a.result?.totalLandedCost || 0) - (b.result?.totalLandedCost || 0);
          break;
        case 'name':
          comparison = a.input.productName.localeCompare(b.input.productName);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredCalculations(filtered);
    setCurrentPage(1);
  }, [searchQuery, filters, calculations, sortBy, sortOrder]);

  // Pagination
  const paginatedCalculations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredCalculations.slice(start, end);
  }, [filteredCalculations, currentPage]);

  const totalPages = Math.ceil(filteredCalculations.length / ITEMS_PER_PAGE);

  // Statistics
  const stats = useMemo(() => historyStorage.getStats(), [calculations]);

  // Handlers
  const handleView = (id: string) => {
    router.push(`/cost-calculator/results/${id}`);
  };

  const handleDuplicate = (calc: CalculationRecord) => {
    // Save to context and navigate to wizard
    localStorage.setItem('duplicateCalculation', JSON.stringify(calc.input));
    router.push('/cost-calculator');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this calculation?')) {
      try {
        // Try deleting from API first
        await calculatorService.deleteCalculation(id);
        // Also delete from localStorage
        historyStorage.delete(id);
      } catch (error) {
        console.error('Error deleting from API, removing from localStorage:', error);
        // Fallback to localStorage deletion
        historyStorage.delete(id);
      }
      loadCalculations();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedItems.size} calculation(s)?`)) {
      const itemsToDelete = Array.from(selectedItems);

      // Delete from API and localStorage
      for (const id of itemsToDelete) {
        try {
          await calculatorService.deleteCalculation(id);
        } catch (error) {
          console.error(`Error deleting ${id} from API:`, error);
        }
      }

      // Also delete from localStorage
      historyStorage.bulkDelete(itemsToDelete);
      setSelectedItems(new Set());
      loadCalculations();
    }
  };

  const handleToggleFavorite = async (calc: CalculationRecord) => {
    const updatedMetadata = {
      ...calc.metadata,
      isFavorite: !calc.metadata.isFavorite,
    };

    try {
      // Try updating via API first
      await calculatorService.updateCalculation(calc.id, {
        metadata: updatedMetadata
      });
      // Also update localStorage
      historyStorage.update(calc.id, {
        metadata: updatedMetadata
      });
    } catch (error) {
      console.error('Error updating favorite status in API, updating localStorage only:', error);
      // Fallback to localStorage update
      historyStorage.update(calc.id, {
        metadata: updatedMetadata
      });
    }

    loadCalculations();
  };

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedCalculations.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedCalculations.map(c => c.id)));
    }
  };

  const handleExportCSV = () => {
    const csv = historyStorage.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculations-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const formatCurrency = (value: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading calculation history...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTitle}>
            <FaHistory className={styles.headerIcon} />
            <h1>Calculation History</h1>
          </div>
          <div className={styles.headerActions}>
            <Link href="/cost-calculator" className={styles.btnPrimary}>
              + New Calculation
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalCalculations}</div>
            <div className={styles.statLabel}>Total Calculations</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {formatCurrency(stats.averageLandedCost)}
            </div>
            <div className={styles.statLabel}>Average Cost</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {formatCurrency(stats.totalDutiesPaid)}
            </div>
            <div className={styles.statLabel}>Total Duties</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {stats.thisWeekCount}
              <span className={styles.statChange}>
                {stats.thisWeekCount > stats.lastWeekCount ? '↑' : '↓'}
                {Math.abs(stats.thisWeekCount - stats.lastWeekCount)}
              </span>
            </div>
            <div className={styles.statLabel}>This Week</div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.controlsLeft}>
          {/* Search */}
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products, HSN codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={styles.btnOutline}
          >
            <FaFilter /> Filters
            {(filters.isFavorite !== undefined ||
              filters.shippingModes?.length ||
              filters.dateRange) && (
              <span className={styles.filterBadge}>Active</span>
            )}
          </button>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy as any);
              setSortOrder(newSortOrder as any);
            }}
            className={styles.sortSelect}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="cost-desc">Highest Cost</option>
            <option value="cost-asc">Lowest Cost</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>

        <div className={styles.controlsRight}>
          {/* View Mode */}
          <div className={styles.viewToggle}>
            <button
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? styles.active : ''}
            >
              <FaTable />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={viewMode === 'card' ? styles.active : ''}
            >
              <FaTh />
            </button>
          </div>

          {/* Export */}
          <button onClick={handleExportCSV} className={styles.btnOutline}>
            <FaDownload /> Export CSV
          </button>

          {/* Bulk Delete */}
          {selectedItems.size > 0 && (
            <button onClick={handleBulkDelete} className={styles.btnDanger}>
              <FaTrash /> Delete ({selectedItems.size})
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <label>Date Range</label>
            <div className={styles.dateInputs}>
              <input
                type="date"
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: {
                    start: e.target.value ? new Date(e.target.value) : new Date(),
                    end: filters.dateRange?.end || new Date(),
                  }
                })}
                className={styles.dateInput}
              />
              <span>to</span>
              <input
                type="date"
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: {
                    start: filters.dateRange?.start || new Date(),
                    end: e.target.value ? new Date(e.target.value) : new Date(),
                  }
                })}
                className={styles.dateInput}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Shipping Mode</label>
            <div className={styles.checkboxGroup}>
              {['sea', 'air', 'road'].map(mode => (
                <label key={mode} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={filters.shippingModes?.includes(mode) || false}
                    onChange={(e) => {
                      const modes = new Set(filters.shippingModes || []);
                      if (e.target.checked) {
                        modes.add(mode);
                      } else {
                        modes.delete(mode);
                      }
                      setFilters({ ...filters, shippingModes: Array.from(modes) });
                    }}
                  />
                  {mode.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.isFavorite === true}
                onChange={(e) => setFilters({
                  ...filters,
                  isFavorite: e.target.checked ? true : undefined
                })}
              />
              Favorites Only
            </label>
          </div>

          <button
            onClick={() => {
              setFilters({});
              setShowFilters(false);
            }}
            className={styles.btnLink}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Results */}
      <div className={styles.results}>
        {filteredCalculations.length === 0 ? (
          <div className={styles.emptyState}>
            <FaHistory className={styles.emptyIcon} />
            <h3>No calculations found</h3>
            <p>Try adjusting your search or filters</p>
            <Link href="/cost-calculator" className={styles.btnPrimary}>
              Create New Calculation
            </Link>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedItems.size === paginatedCalculations.length && selectedItems.size > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Product</th>
                  <th>HSN Code</th>
                  <th>FOB Value</th>
                  <th>Total Cost</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCalculations.map((calc) => (
                  <tr key={calc.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.has(calc.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedItems);
                          if (e.target.checked) {
                            newSelected.add(calc.id);
                          } else {
                            newSelected.delete(calc.id);
                          }
                          setSelectedItems(newSelected);
                        }}
                      />
                    </td>
                    <td className={styles.productCell}>
                      <div className={styles.productName}>{calc.input.productName}</div>
                      {calc.metadata.isFavorite && <FaStar className={styles.favoriteIcon} />}
                    </td>
                    <td className={styles.hsnCell}>{calc.input.hsnCode}</td>
                    <td>{formatCurrency(parseFloat(calc.input.fobValue))}</td>
                    <td className={styles.totalCost}>
                      {calc.result ? formatCurrency(calc.result.totalLandedCost) : '-'}
                    </td>
                    <td className={styles.routeCell}>
                      <div className={styles.route}>
                        <span>{calc.input.originPort.split(' - ')[0]}</span>
                        <span>→</span>
                        <span>{calc.input.destinationPort.split(' - ')[0]}</span>
                      </div>
                      <div className={styles.shippingMode}>{calc.input.shippingMode}</div>
                    </td>
                    <td>{formatDate(calc.metadata.calculatedAt)}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleView(calc.id)}
                          className={styles.actionBtn}
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDuplicate(calc)}
                          className={styles.actionBtn}
                          title="Duplicate"
                        >
                          <FaCopy />
                        </button>
                        <button
                          onClick={() => handleToggleFavorite(calc)}
                          className={styles.actionBtn}
                          title={calc.metadata.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {calc.metadata.isFavorite ? <FaStar /> : <FaRegStar />}
                        </button>
                        <button
                          onClick={() => handleDelete(calc.id)}
                          className={styles.actionBtn}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Card View */
          <div className={styles.cardGrid}>
            {paginatedCalculations.map((calc) => (
              <div key={calc.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <input
                    type="checkbox"
                    checked={selectedItems.has(calc.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedItems);
                      if (e.target.checked) {
                        newSelected.add(calc.id);
                      } else {
                        newSelected.delete(calc.id);
                      }
                      setSelectedItems(newSelected);
                    }}
                  />
                  <div className={styles.cardTitle}>
                    {calc.input.productName}
                    {calc.metadata.isFavorite && <FaStar className={styles.favoriteIcon} />}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardRow}>
                    <span>HSN Code:</span>
                    <span>{calc.input.hsnCode}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span>FOB Value:</span>
                    <span>{formatCurrency(parseFloat(calc.input.fobValue))}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span>Total Cost:</span>
                    <span className={styles.totalCost}>
                      {calc.result ? formatCurrency(calc.result.totalLandedCost) : '-'}
                    </span>
                  </div>
                  <div className={styles.cardRow}>
                    <span>Route:</span>
                    <span className={styles.route}>
                      {calc.input.originPort.split(' - ')[0]} → {calc.input.destinationPort.split(' - ')[0]}
                    </span>
                  </div>
                  <div className={styles.cardRow}>
                    <span>Date:</span>
                    <span>{formatDate(calc.metadata.calculatedAt)}</span>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <button
                    onClick={() => handleView(calc.id)}
                    className={styles.cardAction}
                  >
                    <FaEye /> View
                  </button>
                  <button
                    onClick={() => handleDuplicate(calc)}
                    className={styles.cardAction}
                  >
                    <FaCopy /> Duplicate
                  </button>
                  <button
                    onClick={() => handleDelete(calc.id)}
                    className={styles.cardAction}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={styles.paginationBtn}
          >
            <FaChevronLeft />
          </button>
          <div className={styles.paginationInfo}>
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={styles.paginationBtn}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
      {promptElement}
    </div>
  );
}