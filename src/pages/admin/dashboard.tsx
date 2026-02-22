import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { 
  Users, 
  UserCheck, 
  Building2, 
  DollarSign,
  TrendingUp,
  Gift,
  Wallet
} from "lucide-react";
import { adminService } from "@/services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [growthData, setGrowthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, growthRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getUserGrowthData(30)
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (growthRes.data) {
        // Convert to chart format
        const chartData = Object.entries(growthRes.data).map(([date, count]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: count as number
        }));
        setGrowthData(chartData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of platform metrics and user statistics
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.newUsersThisWeek} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Anchors</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.usersByRole.anchor}</div>
                <p className="text-xs text-muted-foreground">Content creators</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agencies</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.usersByRole.agency}</div>
                <p className="text-xs text-muted-foreground">Partner agencies</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <LineChart
            title="User Growth (Last 30 Days)"
            data={loading || !growthData ? [] : growthData}
            dataKeys={[{ key: "users", color: "#22c55e", name: "New Users" }]}
            height={300}
            xAxisKey="date"
          />

          <PieChart
            title="Users by Role"
            data={
              loading || !stats
                ? []
                : [
                    { name: "Users", value: stats.usersByRole.user },
                    { name: "Anchors", value: stats.usersByRole.anchor },
                    { name: "Agencies", value: stats.usersByRole.agency },
                    { name: "Admins", value: stats.usersByRole.admin },
                  ]
            }
            colors={["#3b82f6", "#a855f7", "#ec4899", "#10b981"]}
            height={300}
          />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.newUsersToday || 0}</div>
              <p className="text-xs text-muted-foreground">Registered today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.suspendedUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Temporarily suspended</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Banned</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.bannedUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Permanently banned</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}