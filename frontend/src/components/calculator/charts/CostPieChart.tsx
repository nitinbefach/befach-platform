'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Sector
} from 'recharts';
import { formatCurrency } from '@/utils/calculatorUtils';

interface CostPieChartProps {
  data: {
    fobValue: number;
    freight: number;
    insurance: number;
    totalDuties: number;
    totalAdditionalCharges: number;
  };
  currency?: string;
}

// Define colors for each segment
const COLORS = {
  'FOB Value': '#3B82F6',      // Blue
  'Freight': '#10B981',         // Green
  'Insurance': '#F59E0B',       // Amber
  'Duties & Taxes': '#EF4444',  // Red
  'Additional Charges': '#8B5CF6' // Purple
};

// Custom label component
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  if (percent < 0.05) return null; // Don't show label for small segments

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-sm font-semibold"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

// Custom active shape for interactive hover effect
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-sm font-medium">
        {formatCurrency(value)}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

// Custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-lg font-bold" style={{ color: data.fill }}>
          {formatCurrency(data.value)}
        </p>
        <p className="text-sm text-gray-600">
          {(data.percent * 100).toFixed(2)}% of total
        </p>
      </div>
    );
  }
  return null;
};

// Custom legend
const CustomLegend = (props: any) => {
  const { payload } = props;

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function CostPieChart({ data, currency = 'INR' }: CostPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Prepare data for the pie chart
  const chartData = [
    { name: 'FOB Value', value: data.fobValue },
    { name: 'Freight', value: data.freight },
    { name: 'Insurance', value: data.insurance },
    { name: 'Duties & Taxes', value: data.totalDuties },
    { name: 'Additional Charges', value: data.totalAdditionalCharges }
  ].filter(item => item.value > 0); // Filter out zero values

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Distribution</h3>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
          {chartData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div
                key={item.name}
                className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
                style={{
                  borderLeft: `4px solid ${COLORS[item.name as keyof typeof COLORS]}`,
                  backgroundColor: activeIndex === index ? '#f9fafb' : 'white'
                }}
              >
                <div className="text-xs text-gray-600">{item.name}</div>
                <div className="text-sm font-bold mt-1" style={{ color: COLORS[item.name as keyof typeof COLORS] }}>
                  {formatCurrency(item.value)}
                </div>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            );
          })}
        </div>

        {/* Pie Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Bottom Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">Total Cost:</span>
              <span className="ml-2 text-lg font-bold text-gray-800">
                {formatCurrency(total)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-600">Largest Component:</span>
              <span className="ml-2 text-sm font-semibold text-gray-700">
                {chartData.reduce((max, item) => item.value > max.value ? item : max, chartData[0]).name}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Instructions */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Hover over segments for details • Click on cards to highlight
        </div>
      </div>
    </div>
  );
}