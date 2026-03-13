import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { 
  Loader2, 
  Coins, 
  Video, 
  Star, 
  Users, 
  TrendingUp, 
  PhoneCall, 
  Trophy,
  Copy,
  Building2,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AnchorDashboard() {
  const { user, loading: authLoading, isAnchor } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    beans: 0,
    todayEarnings: 0,
    totalCalls: 0,
    rating: 4.8,
    activeFans: 0,
    rewardTokens: 0,
  });

  const [anchorProfile, setAnchorProfile] = useState<any>(null);
  const [agencyAppStatus, setAgencyAppStatus] = useState<string | null>(null);

  // Generate a mock referral code for demo purposes
  const referralCode = user ? `EMP-${user.id.substring(0, 6).toUpperCase()}` : "EMP-DEMO";
  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/auth/register?ref=${referralCode}` : "";

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
    try {
      setLoading(true);

      // Fetch wallet balance
      const { data: walletData } = await supabase
        .from("wallet_balances")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      // Fetch anchor profile
      const { data: profileData } = await supabase
        .from("anchor_profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      // Check agency application status
      const { data: appData } = await supabase
        .from("agency_applications")
        .select("application_status")
        .eq("anchor_id", user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (appData) {
        setAgencyAppStatus(appData.application_status);
      }

      setAnchorProfile(profileData || {
        level: 1,
        experience_points: 450,
        call_price_per_minute: 10
      });

      if (walletData) {
        setStats(prev => ({
          ...prev,
          beans: walletData.beans || 0,
          rewardTokens: walletData.reward_tokens || 0,
          todayEarnings: Math.floor(Math.random() * 5000), // Mock data for today
          totalCalls: Math.floor(Math.random() * 100) + 10, // Mock data
          activeFans: Math.floor(Math.random() * 1000) + 50, // Mock data
        }));
      }

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    });
  };

  const applyForAgency = async () => {
    try {
      const { error } = await supabase
        .from("agency_applications")
        .insert({
          anchor_id: user?.id,
          application_status: "pending"
        });
        
      if (error) throw error;
      
      setAgencyAppStatus("pending");
      toast({
        title: "Application Submitted",
        description: "Your request to become an Agency is under review.",
      });
    } catch (error) {
      console.error("Error applying for agency:", error);
      toast({
        title: "Application Failed",
        description: "Could not submit application at this time.",
        variant: "destructive"
      });
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

  // Calculate level progress (mock max XP per level = level * 1000)
  const currentLevel = anchorProfile?.level || 1;
  const currentXp = anchorProfile?.experience_points || 0;
  const nextLevelXp = currentLevel * 1000;
  const progressPercent = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));

  return (
    <DashboardLayout role="anchor">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Empowerment Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Welcome back! Here's your performance overview.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/anchor/go-live")} className="bg-primary hover:bg-primary/90">
              <Video className="w-4 h-4 mr-2" />
              Go Live Now
            </Button>
          </div>
        </div>

        {/* Level & Agency Application Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Level System Card */}
          <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-600" />
                  Empowerment Level
                </CardTitle>
                <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-3 py-1 rounded-full text-sm font-bold">
                  Level {currentLevel}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress to Level {currentLevel + 1}</span>
                    <span className="font-medium">{currentXp} / {nextLevelXp} XP</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm bg-white/50 dark:bg-black/20 p-2 rounded-md">
                  <span className="text-muted-foreground">Current Call Rate:</span>
                  <span className="font-bold flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-500" />
                    {anchorProfile?.call_price_per_minute || 10} / min
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agency Application & Referral */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Growth & Expansion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-1">Your Referral Link (Invite friends & earn!)</p>
                <div className="flex gap-2">
                  <code className="flex-1 bg-muted p-2 rounded text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                    {referralLink}
                  </code>
                  <Button variant="outline" size="icon" onClick={copyReferralLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                {agencyAppStatus === 'pending' ? (
                  <div className="bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 p-3 rounded-md text-sm text-center font-medium">
                    Your Agency application is currently under review.
                  </div>
                ) : agencyAppStatus === 'approved' ? (
                  <div className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 p-3 rounded-md text-sm text-center font-medium">
                    You are now an Agency! Please relogin to access the Agency panel.
                  </div>
                ) : agencyAppStatus === 'rejected' ? (
                  <div className="flex flex-col gap-2">
                    <div className="bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 p-3 rounded-md text-sm text-center font-medium">
                      Previous application was rejected.
                    </div>
                    <Button variant="outline" className="w-full" onClick={applyForAgency}>
                      Re-apply to Become Agency
                    </Button>
                  </div>
                ) : (
                  <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700" onClick={applyForAgency}>
                    <Building2 className="w-4 h-4 mr-2" />
                    Apply to Become an Agency
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Coins className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.beans.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Available Beans to withdraw
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.todayEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Beans earned today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <PhoneCall className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCalls.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Completed video & voice calls
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mt-8 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary"
            onClick={() => router.push("/anchor/call-price")}
          >
            <Coins className="h-6 w-6" />
            <span>Call Settings</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary"
            onClick={() => router.push("/anchor/income")}
          >
            <TrendingUp className="h-6 w-6" />
            <span>Income Report</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary"
            onClick={() => router.push("/anchor/level")}
          >
            <Trophy className="h-6 w-6" />
            <span>Level Perks</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary"
            onClick={() => router.push("/anchor/withdraw")}
          >
            <ArrowRight className="h-6 w-6" />
            <span>Withdraw</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}