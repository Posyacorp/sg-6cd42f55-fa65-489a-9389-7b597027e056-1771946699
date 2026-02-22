import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, Calendar } from "lucide-react";
import { InteractiveAreaChart } from "@/components/charts/InteractiveAreaChart";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { BarChart } from "@/components/charts/BarChart";

export default function AgencyDashboard() {
  // Commission trends data (12 months)
  const commissionData = [
    { name: "Jan", value: 12500 },
    { name: "Feb", value: 15200 },
    { name: "Mar", value: 18900 },
    { name: "Apr", value: 16700 },
    { name: "May", value: 21300 },
    { name: "Jun", value: 24800 },
    { name: "Jul", value: 22400 },
    { name: "Aug", value: 28900 },
    { name: "Sep", value: 31200 },
    { name: "Oct", value: 35600 },
    { name: "Nov", value: 38900 },
    { name: "Dec", value: 42300 },
  ];

  // Top anchors comparison (90 days)
  const anchorComparisonData = [
    { name: "Week 1", anchor1: 4200, anchor2: 3800, anchor3: 3200 },
    { name: "Week 2", anchor1: 4500, anchor2: 4100, anchor3: 3500 },
    { name: "Week 3", anchor1: 4800, anchor2: 4400, anchor3: 3800 },
    { name: "Week 4", anchor1: 5200, anchor2: 4600, anchor3: 4100 },
    { name: "Week 5", anchor1: 5500, anchor2: 4900, anchor3: 4400 },
    { name: "Week 6", anchor1: 5800, anchor2: 5200, anchor3: 4700 },
    { name: "Week 7", anchor1: 6100, anchor2: 5500, anchor3: 5000 },
    { name: "Week 8", anchor1: 6400, anchor2: 5800, anchor3: 5300 },
    { name: "Week 9", anchor1: 6700, anchor2: 6100, anchor3: 5600 },
    { name: "Week 10", anchor1: 7000, anchor2: 6400, anchor3: 5900 },
    { name: "Week 11", anchor1: 7300, anchor2: 6700, anchor3: 6200 },
    { name: "Week 12", anchor1: 7600, anchor2: 7000, anchor3: 6500 },
  ];

  // Revenue streams breakdown
  const revenueStreamsData = [
    { name: "Direct Commission", value: 125000, color: "#3b82f6" },
    { name: "Performance Bonus", value: 48000, color: "#10b981" },
    { name: "Referral Earnings", value: 32000, color: "#f59e0b" },
    { name: "Tier Rewards", value: 18500, color: "#8b5cf6" },
  ];

  const comparisonMetrics = [
    { key: "anchor1", label: "Sarah M.", color: "#3b82f6" },
    { key: "anchor2", label: "Alex K.", color: "#10b981" },
    { key: "anchor3", label: "Emma R.", color: "#f59e0b" },
  ];

  return (
    <>
      <SEO 
        title="Agency Dashboard - Pukaarly"
        description="Manage your agency, track anchors, and monitor commission earnings"
      />
      
      <DashboardLayout role="agency">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Agency Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Overview of your agency performance and earnings
              </p>
            </div>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$42,350</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Anchors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+3</span> new this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+5.2%</span> improvement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$223.5K</div>
                <p className="text-xs text-muted-foreground">
                  Total anchor earnings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Commission Trends Chart */}
          <InteractiveAreaChart
            title="Commission Trends"
            description="Track your commission growth over time - use range selector to zoom into specific periods"
            data={commissionData}
            dataKey="value"
            color="#3b82f6"
            valuePrefix="$"
          />

          {/* Anchor Performance Comparison */}
          <ComparisonChart
            title="Top Anchor Performance Comparison"
            description="Compare earnings trends of your top-performing anchors over the last 90 days"
            data={anchorComparisonData}
            metrics={comparisonMetrics}
            valuePrefix="$"
          />

          {/* Revenue Streams Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Streams Breakdown</CardTitle>
              <CardDescription>
                Distribution of agency income sources this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={revenueStreamsData}
                dataKeys={[{ key: "value", color: "#3b82f6", name: "Amount" }]}
                xAxisKey="name"
                height={300}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invite New Anchor</CardTitle>
                <CardDescription>Expand your network</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Send Invitation</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Request Withdrawal</CardTitle>
                <CardDescription>Withdraw your earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">Withdraw Funds</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Report</CardTitle>
                <CardDescription>Detailed analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">View Report</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}