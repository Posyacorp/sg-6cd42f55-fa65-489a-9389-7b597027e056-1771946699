import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services/adminService";
import { Loader2, Users, UserCheck, Building2, TrendingUp, DollarSign, Gift, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

// Lazy load chart components for better performance
const LineChart = dynamic(() => import("@/components/charts/LineChart").then(mod => ({ default: mod.LineChart })), {
  loading: () => <div className="h-[300px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false
});

const PieChart = dynamic(() => import("@/components/charts/PieChart").then(mod => ({ default: mod.PieChart })), {
  loading: () => <div className="h-[300px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false
});

const BarChart = dynamic(() => import("@/components/charts/BarChart").then(mod => ({ default: mod.BarChart })), {
  loading: () => <div className="h-[300px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false
});

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnchors: 0,
    totalAgencies: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalGiftsSent: 0,
    pendingApprovals: 0,
    pendingAgencyApplications: 0,
    pendingWithdrawals: 0,
  });
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [roleDistribution, setRoleDistribution] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [pendingProfiles, setPendingProfiles] = useState<any[]>([]);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push("/auth/login");
        return;
      }
      loadDashboard();
    }
  }, [user, authLoading, isAdmin, router]);

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
          pendingApprovals: data.pendingApprovals || 0,
          pendingAgencyApplications: data.pendingAgencyApplications || 0,
          pendingWithdrawals: data.pendingWithdrawals || 0,
        });
      }

      const { data: growthData } = await adminService.getUserGrowthData();
      if (growthData) {
        setUserGrowth(growthData);
      }

      // Load pending approvals
      await loadPendingApprovals();

      // Generate role distribution for pie chart
      if (data) {
        setRoleDistribution([
          { name: "Users", value: data.totalUsers, color: "#3b82f6" },
          { name: "Anchors", value: data.totalAnchors, color: "#a855f7" },
          { name: "Agencies", value: data.totalAgencies, color: "#ec4899" },
          { name: "Admins", value: 1, color: "#10b981" },
        ]);
      }

      // Mock revenue data
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

  const loadPendingApprovals = async () => {
    try {
      // Load pending agency/anchor approvals
      const { data: profiles } = await adminService.getPendingApprovals();
      if (profiles) {
        setPendingProfiles(profiles.slice(0, 5)); // Show top 5
      }

      // Load pending agency applications (Anchor→Agency)
      const { data: applications } = await adminService.getPendingAgencyApplications();
      if (applications) {
        setPendingApplications(applications.slice(0, 5)); // Show top 5
      }
    } catch (error) {
      console.error("Error loading pending approvals:", error);
    }
  };

  const handleApproveProfile = async (profileId: string) => {
    try {
      await adminService.approveProfile(profileId);
      toast({ title: "Success", description: "Profile approved successfully" });
      loadDashboard();
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve profile", variant: "destructive" });
    }
  };

  const handleRejectProfile = async (profileId: string) => {
    try {
      await adminService.rejectProfile(profileId);
      toast({ title: "Success", description: "Profile rejected" });
      loadDashboard();
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject profile", variant: "destructive" });
    }
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      await adminService.approveAgencyApplication(applicationId);
      toast({ title: "Success", description: "Agency application approved" });
      loadDashboard();
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve application", variant: "destructive" });
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await adminService.rejectAgencyApplication(applicationId);
      toast({ title: "Success", description: "Agency application rejected" });
      loadDashboard();
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject application", variant: "destructive" });
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

        {/* Pending Actions Alert */}
        {(stats.pendingApprovals > 0 || stats.pendingAgencyApplications > 0 || stats.pendingWithdrawals > 0) && (
          <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Pending Actions Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.pendingApprovals > 0 && (
                <div className="flex items-center justify-between">
                  <span>{stats.pendingApprovals} profile approvals pending</span>
                  <Button size="sm" onClick={() => router.push("/admin/users")}>
                    Review
                  </Button>
                </div>
              )}
              {stats.pendingAgencyApplications > 0 && (
                <div className="flex items-center justify-between">
                  <span>{stats.pendingAgencyApplications} agency applications pending</span>
                  <Button size="sm" onClick={() => router.push("/admin/agencies")}>
                    Review
                  </Button>
                </div>
              )}
              {stats.pendingWithdrawals > 0 && (
                <div className="flex items-center justify-between">
                  <span>{stats.pendingWithdrawals} withdrawal requests pending</span>
                  <Button size="sm" onClick={() => router.push("/admin/withdrawals")}>
                    Review
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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

        {/* Pending Approvals Section */}
        {(pendingProfiles.length > 0 || pendingApplications.length > 0) && (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Pending Profile Approvals */}
            {pendingProfiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Profile Approvals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingProfiles.map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{profile.full_name || "Unnamed"}</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.email} • {profile.role}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApproveProfile(profile.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectProfile(profile.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/admin/users")}
                  >
                    View All Pending
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Pending Agency Applications */}
            {pendingApplications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Agency Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{app.anchor_name || "Anchor"}</p>
                        <p className="text-sm text-muted-foreground">
                          Applied {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApproveApplication(app.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectApplication(app.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/admin/agencies")}
                  >
                    View All Applications
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

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