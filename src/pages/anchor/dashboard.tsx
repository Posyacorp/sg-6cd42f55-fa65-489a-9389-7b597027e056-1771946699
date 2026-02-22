import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { walletService } from "@/services/walletService";
import { Loader2, DollarSign, TrendingUp, Users, Phone, Star } from "lucide-react";
import { useRouter } from "next/router";

export default function AnchorDashboard() {
  const { user, loading: authLoading, isAnchor } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    todayEarnings: 0,
    totalCalls: 0,
    todayCalls: 0,
    rating: 0,
    activeUsers: 0,
  });
  const [wallet, setWallet] = useState({
    beans: 0,
    reward_tokens: 0,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAnchor) {
        router.push("/auth/login");
        return;
      }
      loadDashboardData();
    }
  }, [user, authLoading, isAnchor]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load wallet balance
      const { data: walletData } = await walletService.getBalance(user.id);
      if (walletData) {
        setWallet({
          beans: walletData.beans,
          reward_tokens: walletData.reward_tokens,
        });
      }

      // TODO: Load anchor stats from anchor_profiles and call_sessions
      setStats({
        totalEarnings: walletData?.beans || 0,
        todayEarnings: 0,
        totalCalls: 0,
        todayCalls: 0,
        rating: 4.8,
        activeUsers: 0,
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout role="anchor">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="anchor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Anchor Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your streaming career and earnings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wallet.beans.toLocaleString()} Beans</div>
              <p className="text-xs text-muted-foreground">
                ≈ ${(wallet.beans * 0.01).toFixed(2)} USD
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayEarnings.toLocaleString()} Beans</div>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCalls}</div>
              <p className="text-xs text-muted-foreground">
                {stats.todayCalls} calls today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rating} ⭐</div>
              <p className="text-xs text-muted-foreground">
                Based on user reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Fans</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Regular callers this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Tokens</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wallet.reward_tokens.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Earned from platform rewards
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your anchor profile and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2 md:grid-cols-2">
              <button
                onClick={() => router.push("/anchor/call-price")}
                className="p-4 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <h3 className="font-semibold">Set Call Price</h3>
                <p className="text-sm text-gray-500">Update your per-minute rate</p>
              </button>
              <button
                onClick={() => router.push("/anchor/income")}
                className="p-4 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <h3 className="font-semibold">View Income</h3>
                <p className="text-sm text-gray-500">Detailed earnings breakdown</p>
              </button>
              <button
                onClick={() => router.push("/anchor/level")}
                className="p-4 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <h3 className="font-semibold">Level Progress</h3>
                <p className="text-sm text-gray-500">Track your ranking and perks</p>
              </button>
              <button
                onClick={() => router.push("/anchor/withdraw")}
                className="p-4 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <h3 className="font-semibold">Withdraw Earnings</h3>
                <p className="text-sm text-gray-500">Request bean withdrawals</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}