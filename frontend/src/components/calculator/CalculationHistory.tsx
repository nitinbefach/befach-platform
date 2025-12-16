'use client';

import React, { useState, useEffect } from 'react';
import { getSavedCalculations, clearCalculationHistory, formatCurrency } from '@/utils/calculatorUtils';
import {
  Clock,
  Trash2,
  Eye,
  Copy,
  Download,
  Search,
  Filter,
  Calendar,
  Package,
  X,
  AlertCircle
} from 'lucide-react';

interface CalculationHistoryProps {
  onLoadCalculation?: (calculation: any) => void;
  onRefresh?: () => void;
}

export default function CalculationHistory({ onLoadCalculation, onRefresh }: CalculationHistoryProps) {
  const [calculations, setCalculations] = useState<any[]>([]);
  const [filteredCalculations, setFilteredCalculations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCalculation, setSelectedCalculation] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  useEffect(() => {
    loadCalculations();
  }, []);

  useEffect(() => {
    filterAndSortCalculations();
  }, [calculations, searchTerm, sortOrder]);

  const loadCalculations = () => {
    const saved = getSavedCalculations();
    setCalculations(saved);
  };

  const filterAndSortCalculations = () => {
    let filtered = calculations;

    // Apply search filter
    if (searchTerm) {
      filtered = calculations.filter(calc =>
        calc.input.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.input.hsnCode.includes(searchTerm) ||
        calc.input.originCountry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
        case 'oldest':
          return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
        case 'highest':
          return b.totalLandedCost - a.totalLandedCost;
        case 'lowest':
          return a.totalLandedCost - b.totalLandedCost;
        default:
          return 0;
      }
    });

    setFilteredCalculations(filtered);
  };

  const handleDeleteCalculation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this calculation?')) {
      const updated = calculations.filter(calc => calc.id !== id);
      localStorage.setItem('landedCostCalculations', JSON.stringify(updated));
      loadCalculations();
      if (onRefresh) onRefresh();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all calculation history? This action cannot be undone.')) {
      clearCalculationHistory();
      loadCalculations();
      if (onRefresh) onRefresh();
    }
  };

  const handleViewDetails = (calculation: any) => {
    setSelectedCalculation(calculation);
    setShowDetailModal(true);
  };

  const handleDuplicate = (calculation: any) => {
    if (onLoadCalculation) {
      onLoadCalculation(calculation.input);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Product', 'HSN Code', 'Origin', 'Quantity', 'FOB Value', 'Total Duties', 'Landed Cost'];
    const rows = filteredCalculations.map(calc => [
      new Date(calc.savedAt).toLocaleDateString(),
      calc.input.productName,
      calc.input.hsnCode,
      calc.input.originCountry,
      calc.input.quantity,
      calc.fobValue.toFixed(2),
      calc.totalDuties.toFixed(2),
      calc.totalLandedCost.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landed-cost-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getShippingMethodLabel = (method: string) => {
    const methods: { [key: string]: string } = {
      'sea': 'Sea Freight',
      'air': 'Air Freight',
      'express': 'Express',
      'rail': 'Rail'
    };
    return methods[method] || method;
  };

  if (calculations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Calculation History</h2>
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No calculations saved yet</p>
          <p className="text-gray-400 text-sm mt-2">Your calculation history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Calculation History</h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product, HSN code, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Cost</option>
            <option value="lowest">Lowest Cost</option>
          </select>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredCalculations.length} of {calculations.length} calculations
        </div>

        {/* Calculations Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FOB Value
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Duties
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Landed Cost
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCalculations.map((calc) => (
                <tr key={calc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(calc.savedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(calc.savedAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {calc.input.productName}
                    </div>
                    <div className="text-xs text-gray-500">
                      HSN: {calc.input.hsnCode} | Qty: {calc.input.quantity}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {calc.input.originCountry}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getShippingMethodLabel(calc.input.shippingMethod)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(calc.fobValue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {calc.currency}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    <div className="text-sm font-medium text-red-600">
                      {formatCurrency(calc.totalDuties)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {calc.dutyPercentage.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    <div className="text-sm font-bold text-blue-600">
                      {formatCurrency(calc.totalLandedCost)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Per unit: {formatCurrency(calc.landedCostPerUnit)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleViewDetails(calc)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(calc)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCalculation(calc.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCalculations.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No calculations found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedCalculation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Calculation Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Product Information */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Product Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Product:</span>
                      <p className="font-medium">{selectedCalculation.input.productName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">HSN Code:</span>
                      <p className="font-medium">{selectedCalculation.input.hsnCode}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <p className="font-medium">{selectedCalculation.input.quantity}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Unit Price:</span>
                      <p className="font-medium">
                        {selectedCalculation.currency} {selectedCalculation.input.unitPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Shipping Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Origin:</span>
                      <p className="font-medium">{selectedCalculation.input.originCountry}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Shipping Method:</span>
                      <p className="font-medium">
                        {getShippingMethodLabel(selectedCalculation.input.shippingMethod)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Cost Breakdown</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2">FOB Value</td>
                        <td className="py-2 text-right font-medium">
                          {formatCurrency(selectedCalculation.fobValue)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2">Freight</td>
                        <td className="py-2 text-right font-medium">
                          {formatCurrency(selectedCalculation.freight)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2">Insurance</td>
                        <td className="py-2 text-right font-medium">
                          {formatCurrency(selectedCalculation.insurance)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2">Total Duties & Taxes</td>
                        <td className="py-2 text-right font-medium text-red-600">
                          {formatCurrency(selectedCalculation.totalDuties)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2">Additional Charges</td>
                        <td className="py-2 text-right font-medium">
                          {formatCurrency(selectedCalculation.totalAdditionalCharges)}
                        </td>
                      </tr>
                      <tr className="font-bold text-lg">
                        <td className="py-2">Total Landed Cost</td>
                        <td className="py-2 text-right text-blue-600">
                          {formatCurrency(selectedCalculation.totalLandedCost)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calculation Date */}
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calculated on {new Date(selectedCalculation.savedAt).toLocaleString()}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 p-4 flex justify-end gap-3">
              <button
                onClick={() => handleDuplicate(selectedCalculation)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Use as Template
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}