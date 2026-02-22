import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  Activity
} from "lucide-react";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { DrillDownChart } from "@/components/charts/DrillDownChart";

export default function AdminDashboard() {
  const revenueData = [
    { month: "Jan", revenue: 180000 },
    { month: "Feb", revenue: 220000 },
    { month: "Mar", revenue: 200000 },
    { month: "Apr", revenue: 250000 },
    { month: "May", revenue: 284000 },
    { month: "Jun", revenue: 310000 },
  ];

  const userGrowth = [
    { month: "Jan", users: 8500 },
    { month: "Feb", users: 9200 },
    { month: "Mar", users: 10100 },
    { month: "Apr", users: 11200 },
    { month: "May", users: 12400 },
    { month: "Jun", users: 13800 },
  ];

  const tokenDistribution = [
    { name: "Users", value: 45 },
    { name: "Anchors", value: 30 },
    { name: "Reserve", value: 15 },
    { name: "Team", value: 10 },
  ];

  const revenueDrillDown = [
    {
      name: "Video Calls",
      value: 125000,
      drillDown: [
        { name: "1-on-1 Calls", value: 75000 },
        { name: "Group Calls", value: 35000 },
        { name: "Premium Calls", value: 15000 },
      ]
    },
    {
      name: "Gifts",
      value: 95000,
      drillDown: [
        { name: "Roses", value: 45000 },
        { name: "Hearts", value: 30000 },
        { name: "Diamonds", value: 20000 },
      ]
    },
    {
      name: "Subscriptions",
      value: 55000,
      drillDown: [
        { name: "Basic", value: 25000 },
        { name: "Premium", value: 20000 },
        { name: "VIP", value: 10000 },
      ]
    },
    {
      name: "Other",
      value: 35000,
      drillDown: [
        { name: "Profile Boosts", value: 15000 },
        { name: "Stickers", value: 12000 },
        { name: "Badges", value: 8000 },
      ]
    },
  ];

  return (
    <>
      <SEO title="Admin Dashboard - Pukaarly" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Platform overview and management</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,453</div>
                <p className="text-xs text-green-600 mt-1">+342 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Anchors</CardTitle>
                <UserCheck className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">847</div>
                <p className="text-xs text-green-600 mt-1">+45 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$284,340</div>
                <p className="text-xs text-green-600 mt-1">+12.5% vs last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tokens Minted</CardTitle>
                <Activity className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">11.4M</div>
                <p className="text-xs text-gray-500 mt-1">Total supply</p>
              </CardContent>
            </Card>
          </div>

          {/* Drill-Down Chart - Revenue by Category */}
          <DrillDownChart
            title="Revenue by Category"
            data={revenueDrillDown}
            dataKey="value"
            colors={["#8b5cf6", "#06b6d4", "#10b981", "#f97316"]}
          />

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly platform revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart
                  data={revenueData}
                  dataKeys={[{ key: "revenue", color: "#16a34a", name: "Revenue ($)" }]}
                  xAxisKey="month"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Total registered users trend</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={userGrowth}
                  dataKeys={[{ key: "users", color: "#2563eb", name: "Users" }]}
                  xAxisKey="month"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Token Distribution</CardTitle>
                <CardDescription>Current supply allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={tokenDistribution}
                  colors={["#3b82f6", "#9333ea", "#10b981", "#f97316"]}
                  height={300}
                  innerRadius={60}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Actions requiring admin attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { item: "Withdrawal Request", user: "Sarah K.", amount: "$150" },
                    { item: "Anchor Application", user: "Emma L.", amount: "-" },
                    { item: "Agency Application", user: "Star Agency", amount: "-" },
                    { item: "Withdrawal Request", user: "John D.", amount: "$75" }
                  ].map((pending, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                      <div>
                        <p className="font-medium">{pending.item}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{pending.user}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{pending.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}