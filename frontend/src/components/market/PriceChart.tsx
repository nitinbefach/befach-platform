'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  LineChart as LineChartIcon,
  Download,
  Maximize2,
  Settings,
  Calendar
} from 'lucide-react';
import { Commodity, PricePoint, TimeRange } from '@/types/market';
import { formatCurrency, formatDate, getChartColors } from '@/utils/marketHelpers';

interface PriceChartProps {
  commodities: Commodity[];
  selectedCommodities?: string[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  height?: number;
  showControls?: boolean;
  chartType?: 'line' | 'area' | 'bar';
  onChartTypeChange?: (type: 'line' | 'area' | 'bar') => void;
}

export function PriceChart({
  commodities,
  selectedCommodities = [],
  timeRange,
  onTimeRangeChange,
  height = 400,
  showControls = true,
  chartType = 'line',
  onChartTypeChange
}: PriceChartProps) {
  const [localChartType, setLocalChartType] = useState<'line' | 'area' | 'bar'>(chartType);
  const [showMovingAverage, setShowMovingAverage] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  // Filter commodities based on selection
  const displayCommodities = selectedCommodities.length > 0
    ? commodities.filter(c => selectedCommodities.includes(c.id))
    : commodities.slice(0, 1); // Show first commodity by default

  if (displayCommodities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            Select a commodity to view price chart
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const prepareChartData = () => {
    // Get all unique dates from all commodities
    const allDates = new Set<string>();
    displayCommodities.forEach(commodity => {
      commodity.history.forEach(point => {
        allDates.add(point.date);
      });
    });

    // Sort dates
    const sortedDates = Array.from(allDates).sort();

    // Create data points for each date
    return sortedDates.map(date => {
      const dataPoint: any = {
        date,
        formattedDate: formatDate(date, 'short')
      };

      displayCommodities.forEach(commodity => {
        const historyPoint = commodity.history.find(h => h.date === date);
        if (historyPoint) {
          dataPoint[commodity.id] = historyPoint.price;
          dataPoint[`${commodity.id}_volume`] = historyPoint.volume;
        }
      });

      return dataPoint;
    });
  };

  const chartData = prepareChartData();

  // Calculate moving average
  const calculateMA = (data: any[], commodityId: string, period: number = 20) => {
    return data.map((item, index) => {
      if (index < period - 1) return { ...item, [`${commodityId}_ma`]: null };

      const sum = data
        .slice(index - period + 1, index + 1)
        .reduce((acc, d) => acc + (d[commodityId] || 0), 0);

      return {
        ...item,
        [`${commodityId}_ma`]: parseFloat((sum / period).toFixed(2))
      };
    });
  };

  // Add moving averages if enabled
  let finalChartData = chartData;
  if (showMovingAverage) {
    displayCommodities.forEach(commodity => {
      finalChartData = calculateMA(finalChartData, commodity.id);
    });
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">{formatDate(label, 'short')}</p>
          {payload.map((entry: any, index: number) => {
            if (entry.dataKey.includes('_ma')) {
              return (
                <p key={index} className="text-sm" style={{ color: entry.color }}>
                  MA(20): {formatCurrency(entry.value)}
                </p>
              );
            }
            if (entry.dataKey.includes('_volume')) {
              return null; // Skip volume in tooltip
            }
            const commodity = displayCommodities.find(c => c.id === entry.dataKey);
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {commodity?.name}: {formatCurrency(entry.value)}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Render chart based on type
  const renderChart = () => {
    const chartProps = {
      data: finalChartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const commonAxisProps = {
      xAxis: {
        dataKey: 'formattedDate',
        angle: -45,
        textAnchor: 'end',
        height: 80
      },
      yAxis: {
        tickFormatter: (value: number) => formatCurrency(value)
      }
    };

    switch (localChartType) {
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {displayCommodities.map((commodity, index) => (
              <React.Fragment key={commodity.id}>
                <Area
                  type="monotone"
                  dataKey={commodity.id}
                  name={commodity.name}
                  stroke={getChartColors(index)}
                  fill={getChartColors(index)}
                  fillOpacity={0.3}
                />
                {showMovingAverage && (
                  <Line
                    type="monotone"
                    dataKey={`${commodity.id}_ma`}
                    name={`${commodity.name} MA(20)`}
                    stroke={getChartColors(index)}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )}
              </React.Fragment>
            ))}
            <Brush dataKey="formattedDate" height={30} stroke="#8884d8" />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {displayCommodities.map((commodity, index) => (
              <Bar
                key={commodity.id}
                dataKey={commodity.id}
                name={commodity.name}
                fill={getChartColors(index)}
              />
            ))}
          </BarChart>
        );

      case 'line':
      default:
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {displayCommodities.map((commodity, index) => (
              <React.Fragment key={commodity.id}>
                <Line
                  type="monotone"
                  dataKey={commodity.id}
                  name={commodity.name}
                  stroke={getChartColors(index)}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                {showMovingAverage && (
                  <Line
                    type="monotone"
                    dataKey={`${commodity.id}_ma`}
                    name={`${commodity.name} MA(20)`}
                    stroke={getChartColors(index)}
                    strokeDasharray="5 5"
                    strokeOpacity={0.7}
                    dot={false}
                  />
                )}
                {/* Add reference line for previous close */}
                <ReferenceLine
                  y={commodity.previousPrice}
                  stroke={getChartColors(index)}
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                />
              </React.Fragment>
            ))}
            <Brush dataKey="formattedDate" height={30} stroke="#8884d8" />
          </LineChart>
        );
    }
  };

  return (
    <Card className="chart-card">
      <CardHeader>
        <div className="chart-header">
          <CardTitle className="chart-title">
            <TrendingUp className="h-5 w-5" />
            Price Chart
            {displayCommodities.length === 1 && (
              <span className="text-sm font-normal text-gray-600">
                - {displayCommodities[0].name}
              </span>
            )}
          </CardTitle>

          {showControls && (
            <div className="chart-controls">
              {/* Time Range Selector */}
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={(value) => value && onTimeRangeChange(value as TimeRange)}
                className="bg-gray-100 rounded-lg p-1"
              >
                <ToggleGroupItem value="1D" size="sm">1D</ToggleGroupItem>
                <ToggleGroupItem value="1W" size="sm">1W</ToggleGroupItem>
                <ToggleGroupItem value="1M" size="sm">1M</ToggleGroupItem>
                <ToggleGroupItem value="3M" size="sm">3M</ToggleGroupItem>
                <ToggleGroupItem value="6M" size="sm">6M</ToggleGroupItem>
                <ToggleGroupItem value="1Y" size="sm">1Y</ToggleGroupItem>
                <ToggleGroupItem value="ALL" size="sm">All</ToggleGroupItem>
              </ToggleGroup>

              {/* Chart Type Selector */}
              <ToggleGroup
                type="single"
                value={localChartType}
                onValueChange={(value) => {
                  if (value) {
                    setLocalChartType(value as 'line' | 'area' | 'bar');
                    onChartTypeChange?.(value as 'line' | 'area' | 'bar');
                  }
                }}
                className="bg-gray-100 rounded-lg p-1"
              >
                <ToggleGroupItem value="line" size="sm">
                  <LineChartIcon className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="area" size="sm">
                  <TrendingUp className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="bar" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>

              {/* Additional Controls */}
              <button
                className={`chart-control-btn ${showMovingAverage ? 'active' : ''}`}
                onClick={() => setShowMovingAverage(!showMovingAverage)}
              >
                MA
              </button>
              <button
                className="chart-control-btn"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                className="chart-control-btn"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>

        {/* Chart Legend/Info */}
        {displayCommodities.length === 1 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Current Price:</span>
              <p className="font-medium">{formatCurrency(displayCommodities[0].currentPrice)}</p>
            </div>
            <div>
              <span className="text-gray-600">Previous Close:</span>
              <p className="font-medium">{formatCurrency(displayCommodities[0].previousPrice)}</p>
            </div>
            <div>
              <span className="text-gray-600">Day Range:</span>
              <p className="font-medium">
                {formatCurrency(Math.min(...chartData.map(d => d[displayCommodities[0].id] || 0)))} -
                {formatCurrency(Math.max(...chartData.map(d => d[displayCommodities[0].id] || 0)))}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Volume:</span>
              <p className="font-medium">{displayCommodities[0].volume.toLocaleString()} {displayCommodities[0].unit}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}