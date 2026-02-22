import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService } from "@/services/adminService";
import { Loader2, Users, UserCheck, Building2, TrendingUp, DollarSign, Gift } from "lucide-react";
import { LineChart } from "@/components/charts/LineChart";
import { PieChart } from "@/components/charts/PieChart";
import { BarChart } from "@/components/charts/BarChart";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnchors: 0,
    totalAgencies: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalGiftsSent: 0,
  });
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [roleDistribution, setRoleDistribution] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push("/auth/login");
        return;
      }
      loadDashboard();
    }
  }, [user, authLoading, isAdmin]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await adminService.getDashboardStats();
      if (data) {
        setStats({
          totalUsers: data.totalUsers,
          totalAnchors: data.totalAnchors,
          totalAgencies: data.totalAgencies,
          activeUsers: data.activeUsers,
          totalRevenue: 0,
          monthlyRevenue: 0,
          totalGiftsSent: 0,
        });
      }

      const { data: growthData } = await adminService.getUserGrowthData();
      if (growthData) {
        setUserGrowth(growthData);
      }

      // Generate role distribution for pie chart
      if (data) {
        setRoleDistribution([
          { name: "Users", value: data.totalUsers, color: "#3b82f6" },
          { name: "Anchors", value: data.totalAnchors, color: "#a855f7" },
          { name: "Agencies", value: data.totalAgencies, color: "#ec4899" },
          { name: "Admins", value: 1, color: "#10b981" },
        ]);
      }

      // Mock revenue data (replace with real data from treasury)
      const mockRevenueData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        revenue: Math.floor(Math.random() * 5000) + 1000,
      }));
      setRevenueData(mockRevenueData);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Complete platform analytics and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} active this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anchors</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnchors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Content creators
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agencies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAgencies.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Partner agencies
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Growth (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                title=""
                data={userGrowth}
                dataKeys={[{ key: "users", color: "#3b82f6", name: "Users" }]}
                xAxisKey="date"
                height={300}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                title=""
                data={roleDistribution}
                colors={["#3b82f6", "#a855f7", "#ec4899", "#10b981"]}
                height={300}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                title=""
                data={revenueData}
                dataKeys={[{ key: "revenue", color: "#3b82f6", name: "Revenue" }]}
                xAxisKey="date"
                height={300}
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                All-time platform revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gifts Sent</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGiftsSent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total gifts exchanged
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalUsers > 0
                  ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                User engagement rate
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}