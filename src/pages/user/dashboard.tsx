import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { walletService } from "@/services/walletService";
import { referralService } from "@/services/referralService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Gift, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function UserDashboard() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState({ coins: 0, beans: 0, reward_tokens: 0 });
  const [referralStats, setReferralStats] = useState({ total: 0, earnings: 0 });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load wallet balance
      const { data: wallet } = await walletService.getBalance(user.id);
      if (wallet) {
        setWalletData(wallet);
      }

      // Load referral stats
      const { data: referrals } = await referralService.getReferrals(user.id);
      const { data: earnings } = await referralService.getTotalReferralEarnings(user.id);
      
      setReferralStats({
        total: referrals?.length || 0,
        earnings: earnings || 0,
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || "User"}!</h1>
          <p className="text-muted-foreground">Here's your account overview</p>
        </div>

        {/* Wallet Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coins Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletData.coins.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Available for spending</p>
              <Link href="/user/wallet">
                <Button variant="link" className="px-0 mt-2">
                  Manage Wallet <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Beans Earned</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletData.beans.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From gifts received</p>
              <Link href="/user/wallet">
                <Button variant="link" className="px-0 mt-2">
                  View Transactions <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Tokens</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletData.reward_tokens.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Cashback rewards</p>
              <Link href="/user/withdraw">
                <Button variant="link" className="px-0 mt-2">
                  Withdraw <ArrowDownRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Referral Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referralStats.total}</div>
              <p className="text-xs text-muted-foreground">Friends you've invited</p>
              <Link href="/user/referrals">
                <Button variant="link" className="px-0 mt-2">
                  View Referrals <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referralStats.earnings.toLocaleString()} tokens</div>
              <p className="text-xs text-muted-foreground">From referral rewards</p>
              <Link href="/user/referrals">
                <Button variant="link" className="px-0 mt-2">
                  Manage Referrals <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <Link href="/user/explore">
              <Button variant="outline" className="w-full">
                Explore Anchors
              </Button>
            </Link>
            <Link href="/user/messages">
              <Button variant="outline" className="w-full">
                Messages
              </Button>
            </Link>
            <Link href="/user/wallet">
              <Button variant="outline" className="w-full">
                Add Coins
              </Button>
            </Link>
            <Link href="/user/referrals">
              <Button variant="outline" className="w-full">
                Invite Friends
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}