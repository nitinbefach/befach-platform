'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Star,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Bell,
  Trash2,
  Eye,
  RefreshCw,
  Plus,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Commodity, WatchlistItem } from '@/types/market';
import {
  formatCurrency,
  formatPercent,
  getTrendIcon,
  getValueColor,
  generateSparklineData,
  getRelativeTime
} from '@/utils/marketHelpers';
import { useWatchlist } from '@/context/MarketContext';
import { marketDataService } from '@/services/marketData';

interface WatchlistWidgetProps {
  onCommodityClick?: (commodity: Commodity) => void;
  onAddClick?: () => void;
  compact?: boolean;
}

export function WatchlistWidget({
  onCommodityClick,
  onAddClick,
  compact = false
}: WatchlistWidgetProps) {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load commodity data for watchlist items
  useEffect(() => {
    const loadWatchlistData = async () => {
      if (watchlist.length === 0) {
        setCommodities([]);
        return;
      }

      setLoading(true);
      try {
        const commodityPromises = watchlist.map(item =>
          marketDataService.getCommodityById(item.commodityId)
        );
        const commodityData = await Promise.all(commodityPromises);
        setCommodities(commodityData.filter(c => c !== null) as Commodity[]);
      } catch (error) {
        console.error('Error loading watchlist data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlistData();
  }, [watchlist]);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const commodityPromises = watchlist.map(item =>
        marketDataService.getCommodityById(item.commodityId)
      );
      const commodityData = await Promise.all(commodityPromises);
      setCommodities(commodityData.filter(c => c !== null) as Commodity[]);
    } catch (error) {
      console.error('Error refreshing watchlist data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle delete
  const handleDelete = (commodityId: string) => {
    removeFromWatchlist(commodityId);
    setDeleteConfirm(null);
  };

  // Get watchlist item for a commodity
  const getWatchlistItem = (commodityId: string): WatchlistItem | undefined => {
    return watchlist.find(item => item.commodityId === commodityId);
  };

  if (loading && watchlist.length > 0) {
    return (
      <Card className={compact ? 'h-full' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5" />
            My Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (watchlist.length === 0) {
    return (
      <Card className={compact ? 'h-full' : ''}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5" />
              My Watchlist
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">Your watchlist is empty</p>
            <Button onClick={onAddClick} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Commodities
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`watchlist-widget ${compact ? 'h-full' : ''}`}>
        <CardHeader className="watchlist-header">
          <div className="flex justify-between items-center">
            <CardTitle className="watchlist-title">
              <Star className="h-5 w-5" />
              My Watchlist
              <Badge variant="secondary">{watchlist.length}</Badge>
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddClick}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3">
          <ScrollArea className={compact ? 'h-[400px]' : 'h-auto max-h-[600px]'}>
            <div className="space-y-2">
              {commodities.map((commodity) => {
                const sparklineData = generateSparklineData(commodity, 7);
                const watchlistItem = getWatchlistItem(commodity.id);

                return (
                  <div
                    key={commodity.id}
                    className="watchlist-item"
                    onClick={() => onCommodityClick?.(commodity)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{commodity.name}</h4>
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {commodity.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{commodity.origin}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onCommodityClick?.(commodity);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Bell className="h-4 w-4 mr-2" />
                            Set Alert
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(commodity.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-lg font-semibold">
                          {formatCurrency(commodity.currentPrice)}
                        </p>
                        <p className="text-xs text-gray-500">per {commodity.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getValueColor(commodity.changePercent)}`}>
                          {getTrendIcon(commodity.changePercent)} {formatPercent(commodity.changePercent)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(Math.abs(commodity.change))}
                        </p>
                      </div>
                    </div>

                    {!compact && (
                      <div className="h-12 mb-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sparklineData.map(d => ({ value: d.value }))}>
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke={commodity.changePercent >= 0 ? '#10b981' : '#ef4444'}
                              strokeWidth={1}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Vol: {commodity.volume.toLocaleString()}</span>
                      {watchlistItem && (
                        <span>Added {getRelativeTime(watchlistItem.addedAt)}</span>
                      )}
                    </div>

                    {/* Target Price Indicator */}
                    {watchlistItem?.targetPrice && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Target Price:</span>
                          <span className="font-medium">
                            {formatCurrency(watchlistItem.targetPrice)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${commodity.currentPrice >= watchlistItem.targetPrice
                                ? 'bg-green-500'
                                : 'bg-orange-400'
                              }`}
                              style={{
                                width: `${Math.min(
                                  (commodity.currentPrice / watchlistItem.targetPrice) * 100,
                                  100
                                )}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {commodities.length > 5 && !compact && (
            <div className="mt-3 pt-3 border-t text-center">
              <Button variant="ghost" size="sm" className="text-xs">
                View All {commodities.length} Items
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Watchlist?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the commodity from your watchlist. You can add it back anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}