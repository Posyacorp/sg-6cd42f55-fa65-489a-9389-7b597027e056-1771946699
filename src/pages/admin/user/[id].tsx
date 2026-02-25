import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { adminService } from "@/services/adminService";
import { walletService } from "@/services/walletService";
import { referralService } from "@/services/referralService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, User, Wallet, Users, Activity, Edit, Trash2, Ban, CheckCircle, DollarSign, TrendingUp, Mail, Calendar, Shield, Clock, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { LineChart } from "@/components/charts/LineChart";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

export default function AdminUserDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user: currentUser, loading: authLoading, isAdmin } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [walletData, setWalletData] = useState({ coins: 0, beans: 0, reward_tokens: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referralStats, setReferralStats] = useState({ total: 0, earnings: 0 });
  const [activityData, setActivityData] = useState<any[]>([]);
  const [emailVerified, setEmailVerified] = useState(false);
  const [lastSignIn, setLastSignIn] = useState<string | null>(null);
  
  // Edit states
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceAdjustment, setBalanceAdjustment] = useState({ currency: "coins", amount: 0, reason: "" });
  const [isSuspending, setIsSuspending] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser || !isAdmin) {
        router.push("/auth/login");
        return;
      }
      if (id) {
        loadUserData();
      }
    }
  }, [id, currentUser, authLoading, isAdmin]);

  const loadUserData = async () => {
    if (!id || typeof id !== "string") return;

    try {
      setLoading(true);

      // Load user profile
      const { data: profile } = await adminService.getUserById(id);
      if (profile) {
        setUserProfile(profile);
        setNewRole(profile.role || "user");
      }

      // Load email verification status and last sign in
      const { data: authUser } = await adminService.getUserAuthDetails(id);
      if (authUser) {
        setEmailVerified(authUser.email_confirmed_at !== null);
        setLastSignIn(authUser.last_sign_in_at);
      }

      // Load wallet balance
      const { data: wallet } = await walletService.getBalance(id);
      if (wallet) {
        setWalletData(wallet);
      }

      // Load transactions
      const { data: txns } = await walletService.getTransactions(id, 50);
      if (txns) {
        setTransactions(txns);
      }

      // Load referral stats
      const { data: referrals } = await referralService.getReferrals(id);
      const { data: earnings } = await referralService.getTotalReferralEarnings(id);
      setReferralStats({
        total: referrals?.length || 0,
        earnings: earnings || 0,
      });

      // Generate mock activity data (last 30 days)
      const mockActivity = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        activity: Math.floor(Math.random() * 20),
      }));
      setActivityData(mockActivity);

    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!id || typeof id !== "string" || !newRole || !currentUser) return;

    try {
      const { error } = await adminService.updateUserRole(id, newRole, currentUser.id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      setIsEditingRole(false);
      loadUserData();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleAdjustBalance = async () => {
    if (!id || typeof id !== "string" || !balanceAdjustment.amount) return;

    try {
      await walletService.addTransaction(id, {
        type: balanceAdjustment.amount > 0 ? "credit" : "debit",
        currency: balanceAdjustment.currency as any,
        amount: Math.abs(balanceAdjustment.amount),
        description: `Admin adjustment: ${balanceAdjustment.reason}`,
      });

      toast({
        title: "Success",
        description: "Balance adjusted successfully",
      });
      setIsEditingBalance(false);
      setBalanceAdjustment({ currency: "coins", amount: 0, reason: "" });
      loadUserData();
    } catch (error) {
      console.error("Error adjusting balance:", error);
      toast({
        title: "Error",
        description: "Failed to adjust balance",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!id || typeof id !== "string" || !currentUser) return;

    try {
      const { error } = await adminService.deleteUser(id, currentUser.id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      router.push("/admin/users");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleSuspendUser = async () => {
    if (!id || typeof id !== "string" || !currentUser?.id) return;

    try {
      const newStatus = userProfile?.status === "suspended" ? "active" : "suspended";
      const { error } = await adminService.updateUserStatus(id, newStatus, currentUser.id, suspendReason);
      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${newStatus === "suspended" ? "suspended" : "reactivated"} successfully`,
      });
      setIsSuspending(false);
      setSuspendReason("");
      loadUserData();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
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

  if (!userProfile) {
    return (
      <DashboardLayout role="admin">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">User not found</h2>
          <Link href="/admin/users">
            <Button variant="link" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      admin: "destructive",
      agency: "secondary",
      anchor: "default",
      user: "outline",
    };
    return <Badge variant={variants[role] || "outline"}>{role.toUpperCase()}</Badge>;
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">User Profile</h1>
              <p className="text-muted-foreground">Detailed user information and management</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>User Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userProfile?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {userProfile?.full_name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-semibold">{userProfile?.full_name || "Unknown"}</h3>
                  <Badge variant={
                    userProfile?.role === "admin" ? "default" :
                    userProfile?.role === "agency" ? "secondary" :
                    userProfile?.role === "anchor" ? "outline" : "secondary"
                  }>
                    {userProfile?.role?.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                {/* Account Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={userProfile?.status === "suspended" ? "destructive" : "default"}>
                    {userProfile?.status === "suspended" ? (
                      <>
                        <Ban className="h-3 w-3 mr-1" />
                        Suspended
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </>
                    )}
                  </Badge>
                </div>

                {/* Email Verification */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Verified
                  </span>
                  <Badge variant={emailVerified ? "default" : "secondary"}>
                    {emailVerified ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Unverified
                      </>
                    )}
                  </Badge>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground break-all">{userProfile?.email || "N/A"}</span>
                </div>

                {/* Last Login */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Last login: {lastSignIn ? new Date(lastSignIn).toLocaleString() : "Never"}
                  </span>
                </div>

                {/* Join Date */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Joined {new Date(userProfile?.created_at || "").toLocaleDateString()}
                  </span>
                </div>

                {/* User ID */}
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-mono text-xs break-all">
                    {userProfile?.id}
                  </span>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="space-y-2 pt-4 border-t">
                <Dialog open={isEditingRole} onOpenChange={setIsEditingRole}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Change Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change User Role</DialogTitle>
                      <DialogDescription>
                        Update the user's role and permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>New Role</Label>
                        <Select value={newRole} onValueChange={setNewRole}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="anchor">Anchor (Host)</SelectItem>
                            <SelectItem value="agency">Agency</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditingRole(false)}>Cancel</Button>
                      <Button onClick={handleUpdateRole}>Update Role</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isSuspending} onOpenChange={setIsSuspending}>
                  <DialogTrigger asChild>
                    <Button 
                      variant={userProfile?.status === "suspended" ? "default" : "destructive"} 
                      className="w-full"
                    >
                      {userProfile?.status === "suspended" ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Reactivate User
                        </>
                      ) : (
                        <>
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend User
                        </>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {userProfile?.status === "suspended" ? "Reactivate User" : "Suspend User"}
                      </DialogTitle>
                      <DialogDescription>
                        {userProfile?.status === "suspended" 
                          ? "This will restore the user's access to the platform."
                          : "This will temporarily disable the user's access to the platform."}
                      </DialogDescription>
                    </DialogHeader>
                    {userProfile?.status !== "suspended" && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Reason for suspension</Label>
                          <Input
                            value={suspendReason}
                            onChange={(e) => setSuspendReason(e.target.value)}
                            placeholder="e.g., Policy violation, spam, abuse..."
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsSuspending(false)}>Cancel</Button>
                      <Button 
                        onClick={handleSuspendUser}
                        variant={userProfile?.status === "suspended" ? "default" : "destructive"}
                      >
                        {userProfile?.status === "suspended" ? "Reactivate" : "Suspend"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isEditingBalance} onOpenChange={setIsEditingBalance}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Adjust Balance
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adjust User Balance</DialogTitle>
                      <DialogDescription>
                        Add or subtract from the user's wallet. Use negative numbers to deduct.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Currency Type</Label>
                        <Select
                          value={balanceAdjustment.currency}
                          onValueChange={(value) =>
                            setBalanceAdjustment({ ...balanceAdjustment, currency: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="coins">Coins</SelectItem>
                            <SelectItem value="beans">Beans</SelectItem>
                            <SelectItem value="reward_tokens">Reward Tokens</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Amount (use negative to deduct)</Label>
                        <Input
                          type="number"
                          value={balanceAdjustment.amount}
                          onChange={(e) =>
                            setBalanceAdjustment({
                              ...balanceAdjustment,
                              amount: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <Label>Reason</Label>
                        <Input
                          value={balanceAdjustment.reason}
                          onChange={(e) =>
                            setBalanceAdjustment({ ...balanceAdjustment, reason: e.target.value })
                          }
                          placeholder="e.g., Manual credit, Compensation, etc."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditingBalance(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAdjustBalance}>
                        Apply Adjustment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Coins Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{walletData.coins.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Spendable currency</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Beans Earned</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{walletData.beans.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">From gifts received</p>
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
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Wallet Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="transactions">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                    <TabsTrigger value="referrals">Referrals</TabsTrigger>
                  </TabsList>
                  <TabsContent value="transactions" className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Currency</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                              No transactions yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          transactions.slice(0, 10).map((tx) => (
                            <TableRow key={tx.id}>
                              <TableCell className="text-sm">
                                {new Date(tx.created_at || "").toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{tx.transaction_type}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{tx.amount}</TableCell>
                              <TableCell className="uppercase text-xs">{tx.currency}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="referrals" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{referralStats.total}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{referralStats.earnings} tokens</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Chart (Last 30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  title=""
                  data={activityData}
                  dataKeys={[{ key: "activity", color: "#3b82f6", name: "Activity" }]}
                  xAxisKey="date"
                  height={250}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}