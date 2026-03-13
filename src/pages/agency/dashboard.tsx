import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { 
  Loader2, 
  Users, 
  UserPlus, 
  TrendingUp, 
  Gift, 
  DollarSign, 
  Building2,
  Copy,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AgencyDashboard() {
  const { user, loading: authLoading, isAgency } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    rewardTokens: 0,
    monthCommission: 0,
    totalAnchors: 0,
    activeAnchors: 0,
    commissionRate: 10,
    pendingWithdrawals: 0,
  });

  const [pendingAnchors, setPendingAnchors] = useState<any[]>([]);

  // Generate agency invite link
  const inviteCode = user ? `AGY-${user.id.substring(0, 6).toUpperCase()}` : "AGY-DEMO";
  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/auth/register?agency=${inviteCode}` : "";

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
    try {
      setLoading(true);

      // Fetch wallet balance
      const { data: walletData } = await supabase
        .from("wallet_balances")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      // Get pending anchors referred by this agency
      // For demo, we are checking profiles with pending status
      const { data: pendingData } = await supabase
        .from("profiles")
        .select("id, full_name, email, created_at")
        .eq("approval_status", "pending")
        .eq("role", "anchor")
        .limit(5);

      if (pendingData) {
        setPendingAnchors(pendingData);
      }

      setStats({
        rewardTokens: walletData?.reward_tokens || 0,
        monthCommission: Math.floor(Math.random() * 10000), // Mock
        totalAnchors: Math.floor(Math.random() * 50) + 5, // Mock
        activeAnchors: Math.floor(Math.random() * 30) + 2, // Mock
        commissionRate: 15, // Standard agency commission
        pendingWithdrawals: 0,
      });

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Copied!",
      description: "Agency invite link copied to clipboard.",
    });
  };

  const approveAnchor = async (id: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ approval_status: "approved", status: "active" })
        .eq("id", id);
        
      if (error) throw error;
      
      toast({ title: "Anchor Approved", description: "The anchor has been successfully approved." });
      setPendingAnchors(prev => prev.filter(a => a.id !== id));
      
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve anchor.", variant: "destructive" });
    }
  };

  const rejectAnchor = async (id: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ approval_status: "rejected", status: "suspended" })
        .eq("id", id);
        
      if (error) throw error;
      
      toast({ title: "Anchor Rejected", description: "The anchor application has been rejected." });
      setPendingAnchors(prev => prev.filter(a => a.id !== id));
      
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject anchor.", variant: "destructive" });
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
          <h1 className="text-3xl font-bold">Agency Portal</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your anchors and track your commissions.
          </p>
        </div>

        {/* Invite Link & Pending Approvals */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Invite Card */}
          <Card className="bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Recruit New Anchors
              </CardTitle>
              <CardDescription>Share this link to recruit anchors under your agency.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <code className="flex-1 bg-white/50 dark:bg-black/20 p-3 rounded-md text-sm overflow-hidden text-ellipsis whitespace-nowrap border border-blue-100 dark:border-blue-900">
                  {inviteLink}
                </code>
                <Button onClick={copyInviteLink} className="bg-blue-600 hover:bg-blue-700">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals Card */}
          <Card className={pendingAnchors.length > 0 ? "border-amber-500" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Pending Anchor Approvals
                </div>
                {pendingAnchors.length > 0 && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-bold">
                    {pendingAnchors.length} New
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingAnchors.length > 0 ? (
                <div className="space-y-3 mt-2">
                  {pendingAnchors.map(anchor => (
                    <div key={anchor.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg border">
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate">{anchor.full_name || "New Anchor"}</p>
                        <p className="text-xs text-muted-foreground truncate">{anchor.email}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => approveAnchor(anchor.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => rejectAnchor(anchor.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingAnchors.length >= 5 && (
                    <Button variant="link" size="sm" className="w-full text-xs" onClick={() => router.push("/agency/anchors")}>
                      View All Pending Applications
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">No pending approvals</p>
                  <p className="text-xs">Your queue is clear!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rewardTokens.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Reward Tokens Available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.monthCommission.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tokens earned this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Anchors</CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnchors}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.activeAnchors} active this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Gift className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.commissionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                From anchor earnings
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
            onClick={() => router.push("/agency/anchors")}
          >
            <Users className="h-6 w-6" />
            <span>Manage Anchors</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary"
            onClick={() => router.push("/agency/commission")}
          >
            <TrendingUp className="h-6 w-6" />
            <span>Commission Report</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary"
            onClick={() => router.push("/agency/withdrawals")}
          >
            <DollarSign className="h-6 w-6" />
            <span>Withdrawals</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary"
            onClick={() => router.push("/agency/profile")}
          >
            <Building2 className="h-6 w-6" />
            <span>Agency Profile</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}