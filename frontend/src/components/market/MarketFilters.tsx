'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Filter,
  X,
  RotateCcw,
  Search,
  Calendar,
  Globe,
  Package,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import { MarketFilters as MarketFiltersType, CommodityCategory } from '@/types/market';
import { formatCurrency } from '@/utils/marketHelpers';
import { marketDataService } from '@/services/marketData';

interface MarketFiltersProps {
  filters: MarketFiltersType;
  onFiltersChange: (filters: Partial<MarketFiltersType>) => void;
  onReset: () => void;
  showAdvanced?: boolean;
}

export function MarketFilters({
  filters,
  onFiltersChange,
  onReset,
  showAdvanced = true
}: MarketFiltersProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [origins, setOrigins] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  // Load categories and origins
  useEffect(() => {
    const loadFilterOptions = async () => {
      const [categoriesData, originsData] = await Promise.all([
        marketDataService.getCategories(),
        marketDataService.getOrigins()
      ]);
      setCategories(categoriesData);
      setOrigins(originsData);
    };
    loadFilterOptions();
  }, []);

  // Handle category selection
  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    onFiltersChange({ categories: newCategories });
  };

  // Handle origin selection
  const handleOriginToggle = (origin: string) => {
    const currentOrigins = filters.origins || [];
    const newOrigins = currentOrigins.includes(origin)
      ? currentOrigins.filter(o => o !== origin)
      : [...currentOrigins, origin];
    onFiltersChange({ origins: newOrigins });
  };

  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handlePriceRangeChangeEnd = () => {
    onFiltersChange({ priceRange: priceRange });
  };

  // Count active filters
  const activeFilterCount =
    (filters.categories?.length || 0) +
    (filters.origins?.length || 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  // Clear individual filter
  const clearFilter = (filterType: keyof MarketFiltersType) => {
    onFiltersChange({ [filterType]: undefined });
  };

  return (
    <div className="space-y-4">
      <div className="market-filters-bar">
        {/* Search Input */}
        <div className="filter-search">
          <Search />
          <Input
            placeholder="Search commodities..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
          />
        </div>

        {/* Time Range */}
        <Select
          value={filters.timeRange}
          onValueChange={(value) => onFiltersChange({ timeRange: value as MarketFiltersType['timeRange'] })}
        >
          <SelectTrigger className="filter-select">
            <Calendar />
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1D">Last 24 Hours</SelectItem>
            <SelectItem value="1W">Last 7 Days</SelectItem>
            <SelectItem value="1M">Last Month</SelectItem>
            <SelectItem value="3M">Last 3 Months</SelectItem>
            <SelectItem value="6M">Last 6 Months</SelectItem>
            <SelectItem value="1Y">Last Year</SelectItem>
            <SelectItem value="ALL">All Time</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="filter-select">
              <Package />
              Categories
              {filters.categories && filters.categories.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.categories.length}
                </Badge>
              )}
              <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm mb-3">Select Categories</h4>
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={filters.categories?.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Origin Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="filter-select">
              <Globe />
              Origins
              {filters.origins && filters.origins.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.origins.length}
                </Badge>
              )}
              <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm mb-3">Select Origins</h4>
              {origins.map((origin) => (
                <div key={origin} className="flex items-center space-x-2">
                  <Checkbox
                    id={origin}
                    checked={filters.origins?.includes(origin)}
                    onCheckedChange={() => handleOriginToggle(origin)}
                  />
                  <label
                    htmlFor={origin}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {origin}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Price Range Filter */}
        {showAdvanced && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="filter-select">
                <DollarSign />
                Price Range
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatCurrency(priceRange[0])}</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    onValueCommit={handlePriceRangeChangeEnd}
                    max={10000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="min-price" className="text-xs">Min Price</Label>
                    <Input
                      id="min-price"
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      onBlur={handlePriceRangeChangeEnd}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-price" className="text-xs">Max Price</Label>
                    <Input
                      id="max-price"
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      onBlur={handlePriceRangeChangeEnd}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Sort Options */}
        <Select
          value={`${filters.sortBy || 'change'}_${filters.sortDirection || 'desc'}`}
          onValueChange={(value) => {
            const [sortBy, sortDirection] = value.split('_');
            onFiltersChange({
              sortBy: sortBy as MarketFiltersType['sortBy'],
              sortDirection: sortDirection as MarketFiltersType['sortDirection']
            });
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="change_desc">Highest Change %</SelectItem>
            <SelectItem value="change_asc">Lowest Change %</SelectItem>
            <SelectItem value="price_desc">Highest Price</SelectItem>
            <SelectItem value="price_asc">Lowest Price</SelectItem>
            <SelectItem value="volume_desc">Highest Volume</SelectItem>
            <SelectItem value="volume_asc">Lowest Volume</SelectItem>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-1" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Reset Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.searchQuery}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter('searchQuery')}
              />
            </Badge>
          )}
          {filters.categories?.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleCategoryToggle(category)}
              />
            </Badge>
          ))}
          {filters.origins?.map((origin) => (
            <Badge key={origin} variant="secondary" className="gap-1">
              {origin}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleOriginToggle(origin)}
              />
            </Badge>
          ))}
          {filters.priceRange && (
            <Badge variant="secondary" className="gap-1">
              Price: {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter('priceRange')}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Additional advanced filters can be added here */}
              <div>
                <Label className="text-sm">Min Order Quantity</Label>
                <Input
                  type="number"
                  placeholder="e.g., 1000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Lead Time (days)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 15"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Suppliers Count</Label>
                <Input
                  type="number"
                  placeholder="e.g., 5"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">HS Code</Label>
                <Input
                  placeholder="e.g., 8539.50"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}