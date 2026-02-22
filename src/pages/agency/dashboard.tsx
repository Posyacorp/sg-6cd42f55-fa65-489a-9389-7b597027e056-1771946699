import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { walletService } from "@/services/walletService";
import { Loader2, DollarSign, TrendingUp, Users, UserCheck, Percent } from "lucide-react";
import { useRouter } from "next/router";

export default function AgencyDashboard() {
  const { user, loading: authLoading, isAgency } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCommission: 0,
    monthlyCommission: 0,
    totalAnchors: 0,
    activeAnchors: 0,
    pendingWithdrawals: 0,
    commissionRate: 10,
  });
  const [wallet, setWallet] = useState({
    reward_tokens: 0,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAgency) {
        router.push("/auth/login");
        return;
      }
      loadDashboardData();
    }
  }, [user, authLoading, isAgency]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load wallet balance
      const { data: walletData } = await walletService.getBalance(user.id);
      if (walletData) {
        setWallet({
          reward_tokens: walletData.reward_tokens,
        });
      }

      // TODO: Load agency stats from agency_profiles and agency_anchors
      setStats({
        totalCommission: walletData?.reward_tokens || 0,
        monthlyCommission: 0,
        totalAnchors: 0,
        activeAnchors: 0,
        pendingWithdrawals: 0,
        commissionRate: 10,
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout role="agency">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="agency">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Agency Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your anchors and track commission earnings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wallet.reward_tokens.toLocaleString()} Tokens</div>
              <p className="text-xs text-muted-foreground">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyCommission.toLocaleString()} Tokens</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Anchors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnchors}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeAnchors} active this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Anchors</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAnchors}</div>
              <p className="text-xs text-muted-foreground">
                Streamed this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.commissionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Per anchor transaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingWithdrawals}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your agency operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2 md:grid-cols-2">
              <button
                onClick={() => router.push("/agency/anchors")}
                className="p-4 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <h3 className="font-semibold">Manage Anchors</h3>
                <p className="text-sm text-gray-500">View and manage your talent</p>
              </button>
              <button
                onClick={() => router.push("/agency/commission")}
                className="p-4 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <h3 className="font-semibold">Commission Breakdown</h3>
                <p className="text-sm text-gray-500">Detailed earnings by anchor</p>
              </button>
              <button
                onClick={() => router.push("/agency/invite")}
                className="p-4 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <h3 className="font-semibold">Invite Anchors</h3>
                <p className="text-sm text-gray-500">Grow your talent roster</p>
              </button>
              <button
                onClick={() => router.push("/agency/withdrawals")}
                className="p-4 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <h3 className="font-semibold">Withdrawals</h3>
                <p className="text-sm text-gray-500">Request commission payouts</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}