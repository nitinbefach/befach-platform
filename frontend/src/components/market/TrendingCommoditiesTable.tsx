'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Eye,
  Star,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { Commodity } from '@/types/market';
import {
  formatCurrency,
  formatPercent,
  formatLargeNumber,
  getTrendIcon,
  getValueColor,
  exportToCSV,
  generateSparklineData
} from '@/utils/marketHelpers';
import { useWatchlist } from '@/context/MarketContext';

interface TrendingCommoditiesTableProps {
  commodities: Commodity[];
  loading?: boolean;
  onCommodityClick?: (commodity: Commodity) => void;
  showActions?: boolean;
}

type SortField = 'name' | 'currentPrice' | 'changePercent' | 'volume' | 'origin';
type SortDirection = 'asc' | 'desc';

export function TrendingCommoditiesTable({
  commodities,
  loading,
  onCommodityClick,
  showActions = true
}: TrendingCommoditiesTableProps) {
  const [sortField, setSortField] = useState<SortField>('changePercent');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort commodities
  const sortedCommodities = React.useMemo(() => {
    let filtered = [...commodities];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.origin.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [commodities, sortField, sortDirection, searchQuery]);

  // Toggle row expansion
  const toggleRowExpansion = (commodityId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(commodityId)) {
      newExpanded.delete(commodityId);
    } else {
      newExpanded.add(commodityId);
    }
    setExpandedRows(newExpanded);
  };

  // Handle watchlist toggle
  const handleWatchlistToggle = (commodityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWatchlist(commodityId)) {
      removeFromWatchlist(commodityId);
    } else {
      addToWatchlist(commodityId);
    }
  };

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  // Custom tooltip for sparkline
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="text-sm font-medium">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Commodities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="commodities-table">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <CardTitle className="chart-title">
            <TrendingUp className="h-5 w-5" />
            Trending Commodities
          </CardTitle>
          <div className="flex gap-2">
            <div className="filter-search" style={{ minWidth: 'auto', flex: '0' }}>
              <Search />
              <Input
                placeholder="Search commodities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(sortedCommodities, 'trending_commodities.csv')}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent style={{ padding: 0 }}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Commodity
                    {renderSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('origin')}
                >
                  <div className="flex items-center">
                    Origin
                    {renderSortIcon('origin')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right"
                  onClick={() => handleSort('currentPrice')}
                >
                  <div className="flex items-center justify-end">
                    Price
                    {renderSortIcon('currentPrice')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right"
                  onClick={() => handleSort('changePercent')}
                >
                  <div className="flex items-center justify-end">
                    Change
                    {renderSortIcon('changePercent')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right"
                  onClick={() => handleSort('volume')}
                >
                  <div className="flex items-center justify-end">
                    Volume
                    {renderSortIcon('volume')}
                  </div>
                </TableHead>
                <TableHead className="text-center">7D Trend</TableHead>
                {showActions && <TableHead className="text-center">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCommodities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showActions ? 7 : 6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <AlertCircle className="h-8 w-8" />
                      <p>No commodities found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {sortedCommodities.map((commodity) => {
                    const sparklineData = generateSparklineData(commodity, 7);
                    const isExpanded = expandedRows.has(commodity.id);
                    const inWatchlist = isInWatchlist(commodity.id);

                    return (
                      <React.Fragment key={commodity.id}>
                        <TableRow
                          className="cursor-pointer"
                          onClick={() => onCommodityClick?.(commodity)}
                        >
                          <TableCell>
                            <div className="commodity-cell">
                              <span className="commodity-name">{commodity.name}</span>
                              <span className="commodity-category">
                                {commodity.category}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{commodity.origin}</TableCell>
                          <TableCell className="text-right">
                            <div className="price-cell">
                              <div>
                                {formatCurrency(commodity.currentPrice)}
                              </div>
                              <div className="price-unit">
                                per {commodity.unit}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className={`change-cell ${commodity.changePercent >= 0 ? 'change-positive' : 'change-negative'}`}>
                              <div className="change-percent">
                                <span>{getTrendIcon(commodity.changePercent)}</span>
                                <span>{formatPercent(commodity.changePercent)}</span>
                              </div>
                              <div className="change-value">
                                {formatCurrency(Math.abs(commodity.change))}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right volume-cell">
                            {formatLargeNumber(commodity.volume)} {commodity.unit}
                          </TableCell>
                          <TableCell>
                            <div className="sparkline-cell">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sparklineData.map(d => ({ value: d.value }))}>
                                  <Tooltip content={<CustomTooltip />} />
                                  <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={commodity.changePercent >= 0 ? '#10b981' : '#ef4444'}
                                    strokeWidth={1.5}
                                    dot={false}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </TableCell>
                          {showActions && (
                            <TableCell>
                              <div className="action-buttons" onClick={e => e.stopPropagation()}>
                                <button
                                  className="action-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRowExpansion(commodity.id);
                                  }}
                                >
                                  {isExpanded ? (
                                    <ChevronUp />
                                  ) : (
                                    <ChevronDown />
                                  )}
                                </button>
                                <button
                                  className={`action-btn ${inWatchlist ? 'active' : ''}`}
                                  onClick={(e) => handleWatchlistToggle(commodity.id, e)}
                                >
                                  <Star
                                    className={inWatchlist ? 'fill-current' : ''}
                                  />
                                </button>
                                <button
                                  className="action-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onCommodityClick?.(commodity);
                                  }}
                                >
                                  <Eye />
                                </button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={showActions ? 7 : 6}>
                              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-600">HS Code</p>
                                    <p className="font-medium">{commodity.hsCode || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Min Order</p>
                                    <p className="font-medium">
                                      {commodity.minOrderQuantity
                                        ? `${formatLargeNumber(commodity.minOrderQuantity)} ${commodity.unit}`
                                        : 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Lead Time</p>
                                    <p className="font-medium">{commodity.leadTime || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Suppliers</p>
                                    <p className="font-medium">{commodity.suppliers || 0} active</p>
                                  </div>
                                </div>
                                {commodity.description && (
                                  <div>
                                    <p className="text-sm text-gray-600">Description</p>
                                    <p className="text-sm">{commodity.description}</p>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </TableBody>
          </Table>
        </div>

        {sortedCommodities.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <p>Showing {sortedCommodities.length} of {commodities.length} commodities</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}