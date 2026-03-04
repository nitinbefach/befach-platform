'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { AppLayout } from '@/components/layout';
import { useMobile } from '@/hooks/useMobile';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import { useTour } from '@/hooks/useTour';
import { marketInsightsTourSteps, mobileMarketInsightsTourSteps } from '@/lib/tourSteps';
import TourFAB from '@/components/walkthrough/TourFAB';
import { MarketProvider, useMarket } from '@/context/MarketContext';
import { MarketOverviewCard } from '@/components/market/MarketOverviewCard';
import { TrendingCommoditiesTable } from '@/components/market/TrendingCommoditiesTable';
import { PriceChart } from '@/components/market/PriceChart';
import { MarketFilters } from '@/components/market/MarketFilters';
import { WatchlistWidget } from '@/components/market/WatchlistWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { marketDataService, mockCommodities } from '@/services/marketData';
import { Commodity, MarketOverview, TimeRange } from '@/types/market';
import '@/styles/market-insights.css';

function MarketInsightsInner() {
  const { isMobile } = useMobile();
  const tourSteps = isMobile ? mobileMarketInsightsTourSteps : marketInsightsTourSteps;
  const { startTour, isActive: tourActive } = useTour({ tourId: 'market-insights', steps: tourSteps });
  const {
    filters,
    updateFilters,
    resetFilters,
    timeRange,
    setTimeRange,
    selectedCommodities,
    toggleCommoditySelection
  } = useMarket();

  const { triggerTimeBasedFeedback, promptElement } = useFeedbackTrigger();
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    triggerTimeBasedFeedback('market-insights', 30000);
  }, [triggerTimeBasedFeedback]);

  // Fetch market data
  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        const [overview, trending] = await Promise.all([
          marketDataService.getMarketOverview(),
          marketDataService.getTrendingCommodities(filters)
        ]);
        setMarketOverview(overview);
        setCommodities(trending);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [filters]);

  const handleCommodityClick = (commodity: Commodity) => {
    toggleCommoditySelection(commodity.id);
    setSelectedTab('charts');
  };

  return (
    <AppLayout searchPlaceholder="Search markets, commodities, countries...">      <div className="content-header">
        <h1>Market Insights</h1>
        <p>Real-time commodity prices, market trends, and trade intelligence</p>      </div>

      {/* Market Overview Card */}
      <div id="market-overview" className="mb-6">
        <MarketOverviewCard overview={marketOverview} loading={loading} />
      </div>

      {/* Market Filters */}
      <div id="market-filters" className="mb-6">
        <MarketFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
        />
      </div>

      {/* Main Content with Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div id="market-tabs" className="lg:col-span-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="charts">Price Charts</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <TrendingCommoditiesTable
                commodities={commodities}
                loading={loading}
                onCommodityClick={handleCommodityClick}
              />
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <PriceChart
                commodities={commodities}
                selectedCommodities={selectedCommodities}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
              {selectedCommodities.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Selected for comparison:</strong> {selectedCommodities.length} commodit{selectedCommodities.length === 1 ? 'y' : 'ies'}.
                    Click on commodities in the Overview tab to add/remove them from the chart.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="opportunity-card">
                  <div className="opportunity-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </div>
                  <h3>Price Drop Alert</h3>
                  <p>LED Bulbs (Syska) prices dropped 7.22% - lowest in 3 months</p>
                  <span className="opportunity-link">View Details →</span>
                </div>

                <div className="opportunity-card">
                  <div className="opportunity-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                  </div>
                  <h3>Demand Surge</h3>
                  <p>Darjeeling Tea demand increased 6.67% - premium market opportunity</p>
                  <span className="opportunity-link">Explore Suppliers →</span>
                </div>

                <div className="opportunity-card">
                  <div className="opportunity-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="16 12 12 8 8 12"></polyline>
                      <line x1="12" y1="16" x2="12" y2="8"></line>
                    </svg>
                  </div>
                  <h3>Emerging Market</h3>
                  <p>Vietnam mobile accessories growing 4.35% - new supplier opportunities</p>
                  <span className="opportunity-link">Learn More →</span>
                </div>

                <div className="opportunity-card">
                  <div className="opportunity-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <h3>Volume Leader</h3>
                  <p>Basmati Rice 1121 - 50,000kg monthly volume, stable pricing</p>
                  <span className="opportunity-link">Contact Suppliers →</span>
                </div>

                <div className="opportunity-card">
                  <div className="opportunity-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <h3>New Product Alert</h3>
                  <p>Smart Watches (Mi Band) - Growing category with competitive pricing</p>
                  <span className="opportunity-link">Analyze Market →</span>
                </div>

                <div className="opportunity-card">
                  <div className="opportunity-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <h3>Contract Opportunity</h3>
                  <p>Cotton Fabric bulk order - 25,000m monthly requirement from Bangladesh</p>
                  <span className="opportunity-link">Submit Quote →</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar with Watchlist */}
        <div id="market-watchlist" className="lg:col-span-1">
          <WatchlistWidget
            onCommodityClick={handleCommodityClick}
            onAddClick={() => setSelectedTab('overview')}
            compact={false}
          />
        </div>
      </div>
      {!tourActive && <TourFAB onStart={startTour} />}
      {promptElement}
    </AppLayout>
  );
}

function MarketInsightsContent() {
  return (
    <Suspense fallback={null}>
      <MarketInsightsInner />
    </Suspense>
  );
}

export default function MarketInsightsPage() {
  return (
    <MarketProvider>
      <MarketInsightsContent />
    </MarketProvider>
  );
}

