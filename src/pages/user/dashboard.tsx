import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { 
  Loader2, 
  Coins, 
  Gift, 
  Users, 
  Video, 
  MessageSquare,
  PlusCircle,
  CreditCard,
  ArrowRightLeft
} from "lucide-react";
import { walletService } from "@/services/walletService";
import { supabase } from "@/integrations/supabase/client";

// Lazy load chart for performance
const AreaChart = dynamic(() => import("@/components/charts/AreaChart").then(mod => ({ default: mod.AreaChart })), {
  loading: () => <div className="h-[300px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false
});

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState({
    coins: 0,
    beans: 0,
    rewardTokens: 0,
  });
  
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [spendingData, setSpendingData] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'user') {
        router.push("/auth/login");
        return;
      }
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load balances
      const { data: wallet } = await walletService.getBalance(user!.id);
      if (wallet) {
        setBalances({
          coins: wallet.coins,
          beans: wallet.beans,
          rewardTokens: wallet.reward_tokens,
        });
      }

      // Load recent transactions
      const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (transactions) {
        setRecentTransactions(transactions);
      }

      // Mock spending chart data
      const mockData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          coins: Math.floor(Math.random() * 500),
        };
      });
      setSpendingData(mockData);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Check out new live streams and connect with anchors.
            </p>
          </div>
          <Button onClick={() => router.push("/user/explore")} className="w-full md:w-auto">
            <Video className="w-4 h-4 mr-2" />
            Explore Live Streams
          </Button>
        </div>

        {/* Wallet Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coins Balance</CardTitle>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Coins className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{balances.coins.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Used to send gifts and make calls
              </p>
              <Button size="sm" variant="secondary" className="w-full bg-amber-200 hover:bg-amber-300 text-amber-900 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800" onClick={() => router.push("/user/wallet")}>
                <PlusCircle className="w-4 h-4 mr-1" /> Add Coins
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Beans Balance</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Gift className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balances.beans.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Earned from receiving gifts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Tokens</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balances.rewardTokens.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Earned from referrals
              </p>
              <Button size="sm" variant="outline" className="w-full" onClick={() => router.push("/user/referrals")}>
                Invite Friends
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Middle Section: Chart & Recent Transactions */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Spending Chart */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Spending Activity (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart
                title=""
                data={spendingData}
                dataKey="coins"
                xAxisKey="day"
                height={280}
              />
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => router.push("/user/wallet")}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="px-2">
              {recentTransactions.length > 0 ? (
                <div className="space-y-1">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          tx.type === 'deposit' ? 'bg-green-100 text-green-600' :
                          tx.type === 'gift' ? 'bg-purple-100 text-purple-600' :
                          tx.type === 'call' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {tx.type === 'deposit' ? <CreditCard className="h-4 w-4" /> :
                           tx.type === 'gift' ? <Gift className="h-4 w-4" /> :
                           tx.type === 'call' ? <Video className="h-4 w-4" /> :
                           <ArrowRightLeft className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">{tx.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${
                        tx.amount > 0 && tx.currency === 'coins' ? 'text-green-600' : 
                        tx.amount < 0 ? '' : 'text-green-600'
                      }`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency === 'coins' ? '🪙' : '🫘'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Coins className="h-10 w-10 mb-3 opacity-20" />
                  <p className="text-sm">No recent transactions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mt-8 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary bg-card"
            onClick={() => router.push("/user/explore")}
          >
            <Video className="h-6 w-6" />
            <span>Watch Live</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary bg-card"
            onClick={() => router.push("/user/messages")}
          >
            <MessageSquare className="h-6 w-6" />
            <span>Messages</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary bg-card"
            onClick={() => router.push("/user/referrals")}
          >
            <Users className="h-6 w-6" />
            <span>Referrals</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary bg-card"
            onClick={() => router.push("/user/profile")}
          >
            <CreditCard className="h-6 w-6" />
            <span>My Profile</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}