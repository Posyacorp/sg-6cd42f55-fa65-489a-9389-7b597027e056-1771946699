import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, X, Download } from "lucide-react";
import { format, subDays, isAfter, isBefore, parseISO } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, exportChartToPDF } from "@/lib/export";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  dateRange?: boolean;
  categories?: FilterOption[];
  metrics?: FilterOption[];
  search?: boolean;
  comparison?: boolean;
}

interface FilteredChartProps {
  title: string;
  description?: string;
  data: any[];
  filterConfig?: FilterConfig;
  children: (filteredData: any[], activeFilters: any) => React.ReactNode;
  onFilterChange?: (filters: any) => void;
}

export function FilteredChart({
  title,
  description,
  data,
  filterConfig = {},
  children,
  onFilterChange,
}: FilteredChartProps) {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [quickRange, setQuickRange] = useState("30d");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filterConfig.categories?.map((c) => c.value) || []
  );
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    filterConfig.metrics?.map((m) => m.value) || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [comparisonMode, setComparisonMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Apply quick date range
  const applyQuickRange = (range: string) => {
    setQuickRange(range);
    const to = new Date();
    let from: Date;

    switch (range) {
      case "7d":
        from = subDays(to, 7);
        break;
      case "30d":
        from = subDays(to, 30);
        break;
      case "90d":
        from = subDays(to, 90);
        break;
      case "1y":
        from = subDays(to, 365);
        break;
      case "all":
        from = new Date(0);
        break;
      default:
        from = subDays(to, 30);
    }

    setDateRange({ from, to });
  };

  // Filter data based on all active filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Date range filter
    if (filterConfig.dateRange && dateRange.from && dateRange.to) {
      result = result.filter((item) => {
        if (!item.date) return true;
        const itemDate = typeof item.date === "string" ? parseISO(item.date) : item.date;
        return (
          isAfter(itemDate, dateRange.from!) &&
          isBefore(itemDate, dateRange.to!)
        );
      });
    }

    // Category filter
    if (filterConfig.categories && selectedCategories.length > 0) {
      result = result.filter((item) =>
        selectedCategories.includes(item.category || item.type || item.name)
      );
    }

    // Search filter
    if (filterConfig.search && searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      );
    }

    return result;
  }, [data, dateRange, selectedCategories, searchQuery, filterConfig]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (quickRange !== "30d") count++;
    if (
      filterConfig.categories &&
      selectedCategories.length > 0 &&
      selectedCategories.length < (filterConfig.categories?.length || 0)
    ) {
      count++;
    }
    if (searchQuery) count++;
    if (comparisonMode) count++;
    return count;
  }, [quickRange, selectedCategories, searchQuery, comparisonMode, filterConfig]);

  // Clear all filters
  const clearFilters = () => {
    setQuickRange("30d");
    applyQuickRange("30d");
    setSelectedCategories(filterConfig.categories?.map((c) => c.value) || []);
    setSelectedMetrics(filterConfig.metrics?.map((m) => m.value) || []);
    setSearchQuery("");
    setComparisonMode(false);
  };

  // Export handlers
  const handleExport = (format: "csv" | "pdf") => {
    const exportData = filteredData;
    const filename = `${title.toLowerCase().replace(/\s+/g, "-")}-filtered`;

    if (format === "csv") {
      exportToCSV(exportData, filename);
    } else {
      exportChartToPDF(title, exportData, filename);
    }
  };

  // Notify parent of filter changes
  useMemo(() => {
    if (onFilterChange) {
      onFilterChange({
        dateRange,
        categories: selectedCategories,
        metrics: selectedMetrics,
        search: searchQuery,
        comparison: comparisonMode,
      });
    }
  }, [dateRange, selectedCategories, selectedMetrics, searchQuery, comparisonMode, onFilterChange]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Active Filters</h4>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range Filter */}
              {filterConfig.dateRange && (
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select value={quickRange} onValueChange={applyQuickRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                      <SelectItem value="1y">Last Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Custom Date Range */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from && dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM d")} -{" "}
                            {format(dateRange.to, "MMM d, yyyy")}
                          </>
                        ) : (
                          "Custom range"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange.from && dateRange.to ? dateRange as { from: Date; to: Date } : undefined}
                        onSelect={(range) => {
                          if (range) {
                            setDateRange(range);
                            setQuickRange("custom");
                          }
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Category Filter */}
              {filterConfig.categories && filterConfig.categories.length > 0 && (
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {filterConfig.categories.map((category) => (
                      <div key={category.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.value}
                          checked={selectedCategories.includes(category.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category.value]);
                            } else {
                              setSelectedCategories(
                                selectedCategories.filter((c) => c !== category.value)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={category.value}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metric Filter */}
              {filterConfig.metrics && filterConfig.metrics.length > 0 && (
                <div className="space-y-2">
                  <Label>Metrics</Label>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {filterConfig.metrics.map((metric) => (
                      <div key={metric.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={metric.value}
                          checked={selectedMetrics.includes(metric.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMetrics([...selectedMetrics, metric.value]);
                            } else {
                              setSelectedMetrics(
                                selectedMetrics.filter((m) => m !== metric.value)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={metric.value}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {metric.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Filter */}
              {filterConfig.search && (
                <div className="space-y-2">
                  <Label>Search</Label>
                  <Input
                    placeholder="Search data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Active Filter Tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {quickRange !== "30d" && (
                  <Badge variant="secondary">
                    {quickRange === "7d" && "Last 7 Days"}
                    {quickRange === "90d" && "Last 90 Days"}
                    {quickRange === "1y" && "Last Year"}
                    {quickRange === "all" && "All Time"}
                    {quickRange === "custom" && "Custom Range"}
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {comparisonMode && (
                  <Badge variant="secondary">
                    Comparison Mode
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent id={`filtered-chart-${title}`}>
        <div className="text-sm text-muted-foreground mb-4">
          Showing {filteredData.length} of {data.length} records
        </div>
        {children(filteredData, { selectedCategories, selectedMetrics })}
      </CardContent>
    </Card>
  );
}