import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Filter } from "lucide-react";
import { FilteredChart } from "@/components/charts/FilteredChart";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";

export default function AdminUsersPage() {
  // User growth data with categories and dates
  const userGrowthData = [
    { date: "2026-01-15", total: 1200, active: 890, premium: 310, free: 890, category: "regular" },
    { date: "2026-01-22", total: 1450, active: 1050, premium: 380, free: 1070, category: "regular" },
    { date: "2026-01-29", total: 1680, active: 1220, premium: 450, free: 1230, category: "growth" },
    { date: "2026-02-05", total: 1920, active: 1410, premium: 520, free: 1400, category: "growth" },
    { date: "2026-02-12", total: 2180, active: 1620, premium: 600, free: 1580, category: "growth" },
    { date: "2026-02-19", total: 2450, active: 1850, premium: 690, free: 1760, category: "regular" },
  ];

  // User activity breakdown
  const activityData = [
    { name: "Daily Active", value: 1850, category: "active", type: "engagement" },
    { name: "Weekly Active", value: 2100, category: "active", type: "engagement" },
    { name: "Monthly Active", value: 2450, category: "active", type: "engagement" },
    { name: "Inactive (7d)", value: 350, category: "inactive", type: "retention" },
    { name: "Inactive (30d)", value: 600, category: "inactive", type: "retention" },
  ];

  return (
    <>
      <SEO title="Users - Admin Dashboard" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground mt-1">
                Monitor and manage platform users
              </p>
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,450</div>
                <Badge variant="secondary" className="mt-1">+12.5%</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,850</div>
                <Badge variant="secondary" className="mt-1">75.5%</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Premium Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">690</div>
                <Badge variant="secondary" className="mt-1">28.2%</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  New This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <Badge variant="secondary" className="mt-1">+8.3%</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Filtered User Growth Chart */}
          <FilteredChart
            title="User Growth Analysis"
            description="Track user growth with advanced filtering options"
            data={userGrowthData}
            filterConfig={{
              dateRange: true,
              categories: [
                { label: "Regular Growth", value: "regular" },
                { label: "High Growth", value: "growth" },
              ],
              metrics: [
                { label: "Total Users", value: "total" },
                { label: "Active Users", value: "active" },
                { label: "Premium Users", value: "premium" },
                { label: "Free Users", value: "free" },
              ],
              search: true,
            }}
          >
            {(filteredData, activeFilters) => (
              <LineChart
                title="User Growth"
                data={filteredData}
                dataKeys={activeFilters.selectedMetrics.map((metric) => ({
                  key: metric,
                  color: metric === "total" ? "#3b82f6" : 
                         metric === "active" ? "#10b981" :
                         metric === "premium" ? "#f59e0b" : "#6366f1"
                }))}
                xAxisKey="date"
                height={350}
              />
            )}
          </FilteredChart>

          {/* Filtered Activity Breakdown */}
          <FilteredChart
            title="User Activity Breakdown"
            description="Analyze user engagement and retention metrics"
            data={activityData}
            filterConfig={{
              categories: [
                { label: "Active Users", value: "active" },
                { label: "Inactive Users", value: "inactive" },
              ],
              search: true,
            }}
          >
            {(filteredData) => (
              <BarChart
                title="Activity Breakdown"
                data={filteredData}
                dataKeys={[{ key: "value", color: "#3b82f6" }]}
                xAxisKey="name"
                height={300}
              />
            )}
          </FilteredChart>

          {/* User List Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Users</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8 w-[250px]"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                User list table will be populated with real data from backend
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}