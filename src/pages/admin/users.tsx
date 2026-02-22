import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  MoreVertical, 
  Shield, 
  Ban, 
  Trash2, 
  UserCheck, 
  Download, 
  Mail, 
  Filter, 
  RefreshCw,
  Eye,
  CheckSquare,
  XSquare
} from "lucide-react";
import { adminService, type UserWithStats, type UserStatistics, type AdvancedFilters } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStatistics | null>(null);
  
  // Selection & Bulk Actions
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // Dialog States
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, [searchTerm, roleFilter, statusFilter, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const filters: AdvancedFilters = {
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
        joinDateFrom: dateRange.from || undefined,
        joinDateTo: dateRange.to || undefined,
      };

      const [usersRes, statsRes] = await Promise.all([
        adminService.getAllUsers(filters),
        adminService.getDashboardStats()
      ]);

      if (usersRes.data) setUsers(usersRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({
        title: "Error",
        description: "Failed to load users data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(users.map(u => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) newSelected.add(userId);
    else newSelected.delete(userId);
    setSelectedUsers(newSelected);
  };

  const handleBulkAction = async (action: 'ban' | 'suspend' | 'delete' | 'role', value?: string) => {
    if (selectedUsers.size === 0 || !currentUser?.id) return;
    
    setIsBulkProcessing(true);
    try {
      const userIds = Array.from(selectedUsers);
      let res;

      switch(action) {
        case 'ban':
          res = await adminService.bulkBanUsers(userIds, "Bulk ban by admin", currentUser.id);
          break;
        case 'suspend':
          res = await adminService.bulkSuspendUsers(userIds, "Bulk suspend by admin", currentUser.id);
          break;
        case 'delete':
          if (!confirm(`Are you sure you want to delete ${userIds.length} users?`)) {
            setIsBulkProcessing(false);
            return;
          }
          res = await adminService.bulkDeleteUsers(userIds, currentUser.id);
          break;
      }

      if (res && res.failed === 0) {
        toast({ title: "Success", description: `Bulk action completed on ${res.success} users.` });
        setSelectedUsers(new Set());
        fetchData();
      } else if (res) {
        toast({ 
          title: "Partial Success", 
          description: `Succeeded: ${res.success}, Failed: ${res.failed}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Bulk action failed", variant: "destructive" });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleRoleUpdate = async (newRole: string) => {
    if (!selectedUser || !currentUser?.id) return;
    const { error } = await adminService.updateUserRole(selectedUser.id, newRole, currentUser.id);
    if (!error) {
      toast({ title: "Success", description: "User role updated successfully" });
      fetchData();
      setIsRoleDialogOpen(false);
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser || !currentUser?.id) return;
    const { error } = await adminService.banUser(selectedUser.id, actionReason, currentUser.id);
    if (!error) {
      toast({ title: "Success", description: "User banned successfully" });
      fetchData();
      setIsBanDialogOpen(false);
      setActionReason("");
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (!currentUser?.id) return;
    const { error } = await adminService.unbanUser(userId, currentUser.id);
    if (!error) {
      toast({ title: "Success", description: "User unbanned successfully" });
      fetchData();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSuspendUser = async () => {
    if (!selectedUser || !currentUser?.id) return;
    const { error } = await adminService.suspendUser(selectedUser.id, actionReason, currentUser.id);
    if (!error) {
      toast({ title: "Success", description: "User suspended successfully" });
      fetchData();
      setIsSuspendDialogOpen(false);
      setActionReason("");
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteUser = async (user: UserWithStats) => {
    if (!currentUser?.id || !confirm(`Are you sure you want to delete ${user.email}?`)) return;
    const { error } = await adminService.deleteUser(user.id, currentUser.id);
    if (!error) {
      toast({ title: "Success", description: "User deleted successfully" });
      fetchData();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSendEmail = async () => {
    if (!currentUser?.id) return;
    const recipients = selectedUser ? [selectedUser.id] : Array.from(selectedUsers);
    
    if (recipients.length === 0) return;

    const { error } = await adminService.sendEmailToUsers(recipients, emailSubject, emailMessage, currentUser.id);
    
    if (!error) {
      toast({ title: "Success", description: `Email queued for ${recipients.length} users` });
      setIsEmailDialogOpen(false);
      setEmailSubject("");
      setEmailMessage("");
      if (!selectedUser) setSelectedUsers(new Set()); // Clear selection if bulk
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleExport = async () => {
    const filters: AdvancedFilters = {
      search: searchTerm,
      role: roleFilter,
      status: statusFilter,
      joinDateFrom: dateRange.from || undefined,
      joinDateTo: dateRange.to || undefined,
    };
    
    const { success, error } = await adminService.exportUsersToCSV(filters);
    if (success) {
      toast({ title: "Success", description: "Users exported to CSV" });
    } else {
      toast({ title: "Error", description: "Export failed", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage users, roles, and permissions.</p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button onClick={() => { setSelectedUser(null); setIsEmailDialogOpen(true); }} disabled={selectedUsers.size === 0}>
              <Mail className="mr-2 h-4 w-4" /> Email Selected ({selectedUsers.size})
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+{stats.newUsersToday} today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                <div className="h-2 w-2 rounded-full bg-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.suspendedUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Banned</CardTitle>
                <div className="h-2 w-2 rounded-full bg-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bannedUsers}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters & Actions */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by email or name..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="anchor">Anchor</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={fetchData}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Joined After</span>
                  <Input type="date" value={dateRange.from} onChange={(e) => setDateRange({...dateRange, from: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Joined Before</span>
                  <Input type="date" value={dateRange.to} onChange={(e) => setDateRange({...dateRange, to: e.target.value})} />
                </div>
              </div>
            )}

            {/* Bulk Actions Bar */}
            {selectedUsers.size > 0 && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md animate-in fade-in">
                <span className="text-sm font-medium px-2">{selectedUsers.size} selected</span>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('ban')} disabled={isBulkProcessing}>
                  Bulk Ban
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleBulkAction('suspend')} disabled={isBulkProcessing}>
                  Bulk Suspend
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')} disabled={isBulkProcessing}>
                  Bulk Delete
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Table */}
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={users.length > 0 && selectedUsers.size === users.length}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">No users found.</TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedUsers.has(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.full_name || "Unnamed"}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        user.role === 'admin' ? 'default' : 
                        user.role === 'agency' ? 'secondary' : 
                        user.role === 'anchor' ? 'outline' : 'secondary'
                      }>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        user.status === 'active' ? 'outline' : 
                        user.status === 'banned' ? 'destructive' : 'secondary'
                      } className={user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                        {user.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/admin/user/${user.id}`)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsRoleDialogOpen(true); }}>
                            <Shield className="mr-2 h-4 w-4" /> Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsEmailDialogOpen(true); }}>
                            <Mail className="mr-2 h-4 w-4" /> Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'banned' ? (
                            <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                              <UserCheck className="mr-2 h-4 w-4" /> Unban User
                            </DropdownMenuItem>
                          ) : (
                            <>
                              <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsSuspendDialogOpen(true); }}>
                                <Ban className="mr-2 h-4 w-4" /> Suspend
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedUser(user); setIsBanDialogOpen(true); }}>
                                <XSquare className="mr-2 h-4 w-4" /> Ban Permanently
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialogs */}
      {/* Role Update Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Select a new role for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select onValueChange={handleRoleUpdate}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="anchor">Anchor</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              This will permanently ban {selectedUser?.email} from accessing the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Reason for banning..." 
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBanDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBanUser} disabled={!actionReason}>Ban User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Temporarily suspend {selectedUser?.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Reason for suspension..." 
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleSuspendUser} disabled={!actionReason}>Suspend User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an email to {selectedUser ? selectedUser.email : `${selectedUsers.size} selected users`}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input 
              placeholder="Subject" 
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
            <Textarea 
              placeholder="Message content..." 
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              className="h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendEmail} disabled={!emailSubject || !emailMessage}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}