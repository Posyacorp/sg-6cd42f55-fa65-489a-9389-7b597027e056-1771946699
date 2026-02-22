import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, TrendingUp, Award } from "lucide-react";
import { FilteredChart } from "@/components/charts/FilteredChart";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";

export default function AdminAnchorsPage() {
  // Anchor performance data
  const anchorPerformanceData = [
    { date: "2026-02-01", earnings: 45000, sessions: 320, rating: 4.8, category: "top", level: "diamond" },
    { date: "2026-02-05", earnings: 52000, sessions: 380, rating: 4.9, category: "top", level: "diamond" },
    { date: "2026-02-10", earnings: 48000, sessions: 350, rating: 4.7, category: "top", level: "platinum" },
    { date: "2026-02-15", earnings: 58000, sessions: 420, rating: 4.9, category: "rising", level: "diamond" },
    { date: "2026-02-20", earnings: 62000, sessions: 450, rating: 5.0, category: "rising", level: "diamond" },
  ];

  // Anchor level distribution
  const levelDistributionData = [
    { name: "Diamond", value: 8, category: "premium", earnings: 450000 },
    { name: "Platinum", value: 15, category: "premium", earnings: 380000 },
    { name: "Gold", value: 28, category: "standard", earnings: 280000 },
    { name: "Silver", value: 45, category: "standard", earnings: 180000 },
    { name: "Bronze", value: 62, category: "entry", earnings: 95000 },
  ];

  return (
    <>
      <SEO title="Anchors - Admin Dashboard" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Anchor Management</h1>
              <p className="text-muted-foreground mt-1">
                Monitor and manage platform anchors
              </p>
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Anchor
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Anchors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">158</div>
                <Badge variant="secondary" className="mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +5.2%
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <Badge className="mt-1 bg-green-500">Online</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  4.8
                  <Award className="ml-2 h-5 w-5 text-yellow-500" />
                </div>
                <Badge variant="secondary" className="mt-1">Excellent</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,924</div>
                <Badge variant="secondary" className="mt-1">This month</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Filtered Performance Chart */}
          <FilteredChart
            title="Anchor Performance Trends"
            description="Analyze anchor performance with multi-dimensional filtering"
            data={anchorPerformanceData}
            filterConfig={{
              dateRange: true,
              categories: [
                { label: "Top Performers", value: "top" },
                { label: "Rising Stars", value: "rising" },
              ],
              metrics: [
                { label: "Earnings", value: "earnings" },
                { label: "Sessions", value: "sessions" },
                { label: "Rating", value: "rating" },
              ],
              search: true,
            }}
          >
            {(filteredData, activeFilters) => (
              <LineChart
                title="Performance Metrics"
                data={filteredData}
                dataKeys={activeFilters.selectedMetrics.map((metric) => ({
                  key: metric,
                  color: metric === "earnings" ? "#10b981" : 
                         metric === "sessions" ? "#3b82f6" : "#f59e0b"
                }))}
                xAxisKey="date"
                height={350}
              />
            )}
          </FilteredChart>

          {/* Filtered Level Distribution */}
          <FilteredChart
            title="Anchor Level Distribution"
            description="View anchor distribution across experience levels and earnings"
            data={levelDistributionData}
            filterConfig={{
              categories: [
                { label: "Premium Tiers", value: "premium" },
                { label: "Standard Tiers", value: "standard" },
                { label: "Entry Level", value: "entry" },
              ],
              search: true,
            }}
          >
            {(filteredData) => (
              <BarChart
                title="Level Distribution"
                data={filteredData}
                dataKeys={[
                  { key: "value", color: "#3b82f6", name: "Anchor Count" },
                  { key: "earnings", color: "#10b981", name: "Total Earnings" }
                ]}
                xAxisKey="name"
                height={300}
              />
            )}
          </FilteredChart>

          {/* Anchor List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Anchor Directory</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search anchors..."
                      className="pl-8 w-[250px]"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Anchor directory table will be populated with real data
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}