'use client';

import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { formatCurrency } from '@/utils/calculatorUtils';

interface WaterfallChartProps {
  data: {
    fobValue: number;
    freight: number;
    insurance: number;
    basicCustomsDuty: number;
    socialWelfareSurcharge: number;
    igst: number;
    portCharges: number;
    customsClearance: number;
    inlandTransport: number;
    otherCharges: number;
    totalLandedCost: number;
  };
  currency?: string;
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const isIncrease = data.payload.type === 'increase';
    const isTotal = data.payload.type === 'total';

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className={`text-lg font-bold ${isTotal ? 'text-blue-600' : isIncrease ? 'text-red-600' : 'text-green-600'}`}>
          {isIncrease ? '+' : ''}{formatCurrency(Math.abs(data.payload.value))}
        </p>
        {data.payload.cumulative && (
          <p className="text-sm text-gray-600 mt-1">
            Running Total: {formatCurrency(data.payload.cumulative)}
          </p>
        )}
        {data.payload.percentage && (
          <p className="text-xs text-gray-500">
            {data.payload.percentage}% of FOB
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Custom label renderer
const renderCustomLabel = (props: any) => {
  const { x, y, width, height, value, fill } = props;
  if (!value || Math.abs(value) < 100) return null; // Don't show small values

  const isPositive = value > 0;
  const labelY = isPositive ? y - 5 : y + height + 15;

  return (
    <text
      x={x + width / 2}
      y={labelY}
      fill={fill}
      textAnchor="middle"
      className="text-xs font-semibold"
    >
      {isPositive && '+'}{formatCurrency(value).replace('₹', '')}
    </text>
  );
};

export default function WaterfallChart({ data, currency = 'INR' }: WaterfallChartProps) {
  // Prepare waterfall data
  const waterfallData = [];
  let cumulative = 0;

  // Starting point - FOB Value
  cumulative = data.fobValue;
  waterfallData.push({
    name: 'FOB Value',
    value: data.fobValue,
    cumulative: cumulative,
    start: 0,
    type: 'total',
    color: '#3B82F6',
    percentage: 100
  });

  // Add Freight
  waterfallData.push({
    name: 'Freight',
    value: data.freight,
    start: cumulative,
    cumulative: cumulative + data.freight,
    type: 'increase',
    color: '#10B981',
    percentage: ((data.freight / data.fobValue) * 100).toFixed(1)
  });
  cumulative += data.freight;

  // Add Insurance
  waterfallData.push({
    name: 'Insurance',
    value: data.insurance,
    start: cumulative,
    cumulative: cumulative + data.insurance,
    type: 'increase',
    color: '#F59E0B',
    percentage: ((data.insurance / data.fobValue) * 100).toFixed(1)
  });
  cumulative += data.insurance;

  // CIF Value checkpoint
  const cifValue = data.fobValue + data.freight + data.insurance;
  waterfallData.push({
    name: 'CIF Value',
    value: cifValue,
    cumulative: cifValue,
    start: 0,
    type: 'subtotal',
    color: '#6B7280',
    percentage: ((cifValue / data.fobValue) * 100).toFixed(1)
  });

  // Add Basic Customs Duty
  waterfallData.push({
    name: 'Basic Duty',
    value: data.basicCustomsDuty,
    start: cumulative,
    cumulative: cumulative + data.basicCustomsDuty,
    type: 'increase',
    color: '#EF4444',
    percentage: ((data.basicCustomsDuty / data.fobValue) * 100).toFixed(1)
  });
  cumulative += data.basicCustomsDuty;

  // Add Social Welfare Surcharge
  waterfallData.push({
    name: 'SW Surcharge',
    value: data.socialWelfareSurcharge,
    start: cumulative,
    cumulative: cumulative + data.socialWelfareSurcharge,
    type: 'increase',
    color: '#DC2626',
    percentage: ((data.socialWelfareSurcharge / data.fobValue) * 100).toFixed(1)
  });
  cumulative += data.socialWelfareSurcharge;

  // Add IGST
  waterfallData.push({
    name: 'IGST',
    value: data.igst,
    start: cumulative,
    cumulative: cumulative + data.igst,
    type: 'increase',
    color: '#B91C1C',
    percentage: ((data.igst / data.fobValue) * 100).toFixed(1)
  });
  cumulative += data.igst;

  // Add Port Charges
  if (data.portCharges > 0) {
    waterfallData.push({
      name: 'Port Charges',
      value: data.portCharges,
      start: cumulative,
      cumulative: cumulative + data.portCharges,
      type: 'increase',
      color: '#8B5CF6',
      percentage: ((data.portCharges / data.fobValue) * 100).toFixed(1)
    });
    cumulative += data.portCharges;
  }

  // Add Customs Clearance
  if (data.customsClearance > 0) {
    waterfallData.push({
      name: 'Customs Clear',
      value: data.customsClearance,
      start: cumulative,
      cumulative: cumulative + data.customsClearance,
      type: 'increase',
      color: '#7C3AED',
      percentage: ((data.customsClearance / data.fobValue) * 100).toFixed(1)
    });
    cumulative += data.customsClearance;
  }

  // Add Inland Transport
  if (data.inlandTransport > 0) {
    waterfallData.push({
      name: 'Inland Trans',
      value: data.inlandTransport,
      start: cumulative,
      cumulative: cumulative + data.inlandTransport,
      type: 'increase',
      color: '#6D28D9',
      percentage: ((data.inlandTransport / data.fobValue) * 100).toFixed(1)
    });
    cumulative += data.inlandTransport;
  }

  // Add Other Charges
  if (data.otherCharges > 0) {
    waterfallData.push({
      name: 'Other',
      value: data.otherCharges,
      start: cumulative,
      cumulative: cumulative + data.otherCharges,
      type: 'increase',
      color: '#4C1D95',
      percentage: ((data.otherCharges / data.fobValue) * 100).toFixed(1)
    });
    cumulative += data.otherCharges;
  }

  // Final Total
  waterfallData.push({
    name: 'Total Landed',
    value: data.totalLandedCost,
    cumulative: data.totalLandedCost,
    start: 0,
    type: 'total',
    color: '#059669',
    percentage: ((data.totalLandedCost / data.fobValue) * 100).toFixed(1)
  });

  // Calculate max value for Y-axis
  const maxValue = Math.max(...waterfallData.map(d => d.cumulative || 0));

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Buildup Waterfall</h3>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Starting FOB</div>
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(data.fobValue)}
            </div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-sm text-gray-600">Total Additions</div>
            <div className="text-lg font-bold text-red-600">
              +{formatCurrency(data.totalLandedCost - data.fobValue)}
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">Final Landed</div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(data.totalLandedCost)}
            </div>
          </div>
        </div>

        {/* Waterfall Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={waterfallData}
            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={[0, maxValue * 1.1]}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Floating bars for increases */}
            <Bar dataKey="value" fill="#8884d8" barSize={40}>
              <LabelList
                dataKey="value"
                position="top"
                content={renderCustomLabel}
              />
              {waterfallData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>

            {/* Connector line */}
            <Line
              type="step"
              dataKey="cumulative"
              stroke="#94A3B8"
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-600">Base/Total</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-600">Freight & Insurance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-gray-600">Duties & Taxes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-xs text-gray-600">Additional Charges</span>
          </div>
        </div>

        {/* Cost Increase Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Cost Increase Analysis</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Logistics (Freight + Insurance)</span>
              <span className="font-medium">
                +{((data.freight + data.insurance) / data.fobValue * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Government Levies (Duties + Taxes)</span>
              <span className="font-medium text-red-600">
                +{(((data.basicCustomsDuty + data.socialWelfareSurcharge + data.igst) / data.fobValue) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Handling & Others</span>
              <span className="font-medium">
                +{(((data.portCharges + data.customsClearance + data.inlandTransport + data.otherCharges) / data.fobValue) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-300 font-bold">
              <span className="text-gray-700">Total Cost Increase</span>
              <span className="text-green-600">
                +{(((data.totalLandedCost - data.fobValue) / data.fobValue) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}