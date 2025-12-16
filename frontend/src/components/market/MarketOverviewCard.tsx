'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, Package, Globe } from 'lucide-react';
import { MarketOverview } from '@/types/market';
import { formatCurrency, formatLargeNumber, formatPercent, getRelativeTime } from '@/utils/marketHelpers';

interface MarketOverviewCardProps {
  overview: MarketOverview | null;
  loading?: boolean;
}

export function MarketOverviewCard({ overview, loading }: MarketOverviewCardProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2 w-20"></div>
                <div className="h-8 bg-gray-300 rounded w-32"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!overview) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No market data available</p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: 'Total Volume',
      value: formatLargeNumber(overview.totalVolume),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Value',
      value: formatCurrency(overview.totalValue),
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Active Markets',
      value: overview.activeMarkets.toString(),
      icon: Globe,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Active Commodities',
      value: overview.activeCommodities.toString(),
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <Card className="market-overview-card">
      <CardHeader className="card-header">
        <div className="flex justify-between items-start">
          <CardTitle className="card-title">
            <Activity className="h-5 w-5" />
            Market Overview
          </CardTitle>
          <span className="text-sm" style={{ opacity: 0.9 }}>
            {getRelativeTime(overview.lastUpdated)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="card-content">
        <div className="stat-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className={`stat-icon ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="stat-label">
                <span>{stat.label}</span>
              </div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          {/* Top Gainer */}
          <div className="market-highlight-card gainer">
            <div className="highlight-info">
              <div className="highlight-label">Top Gainer</div>
              <div className="highlight-name">{overview.topGainer.name}</div>
            </div>
            <div className="highlight-value">
              {formatPercent(overview.topGainer.change)}
            </div>
          </div>

          {/* Top Loser */}
          <div className="market-highlight-card loser">
            <div className="highlight-info">
              <div className="highlight-label">Top Loser</div>
              <div className="highlight-name">{overview.topLoser.name}</div>
            </div>
            <div className="highlight-value">
              {formatPercent(overview.topLoser.change)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}