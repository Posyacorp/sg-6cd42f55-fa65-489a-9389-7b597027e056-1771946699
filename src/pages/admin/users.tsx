import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { authService } from "@/services/authService";
import { adminService, type UserWithStats } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  MoreVertical,
  Ban,
  CheckCircle,
  Trash2,
  Shield,
  UserCog,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithStats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  // Dialog states
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    checkAuthAndLoadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const checkAuthAndLoadUsers = async () => {
    try {
      const { user, profile } = await authService.getCurrentUser();

      if (!user || !profile) {
        router.push("/auth/login");
        return;
      }

      if (profile.role !== "admin") {
        router.push(`/${profile.role}/dashboard`);
        return;
      }

      setCurrentAdmin(profile);
      await loadUsers();
    } catch (error) {
      console.error("Error checking auth:", error);
      router.push("/auth/login");
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await adminService.getAllUsers();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.email?.toLowerCase().includes(search) ||
          user.full_name?.toLowerCase().includes(search)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleChangeRole = async () => {
    if (!selectedUser || !newRole || !currentAdmin) return;

    setActionLoading(true);
    try {
      const { success, error } = await adminService.updateUserRole(
        selectedUser.id,
        newRole,
        currentAdmin.id
      );

      if (error || !success) {
        toast({
          title: "Error",
          description: "Failed to update user role.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `User role updated to ${newRole}.`,
      });

      setShowRoleDialog(false);
      setNewRole("");
      await loadUsers();
    } catch (error) {
      console.error("Error changing role:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser || !actionReason || !currentAdmin) return;

    setActionLoading(true);
    try {
      const { success, error } = await adminService.banUser(
        selectedUser.id,
        actionReason,
        currentAdmin.id
      );

      if (error || !success) {
        toast({
          title: "Error",
          description: "Failed to ban user.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User has been banned.",
      });

      setShowBanDialog(false);
      setActionReason("");
      await loadUsers();
    } catch (error) {
      console.error("Error banning user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (!currentAdmin) return;

    try {
      const { success, error } = await adminService.unbanUser(userId, currentAdmin.id);

      if (error || !success) {
        toast({
          title: "Error",
          description: "Failed to unban user.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User has been unbanned.",
      });

      await loadUsers();
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleSuspendUser = async () => {
    if (!selectedUser || !actionReason || !currentAdmin) return;

    setActionLoading(true);
    try {
      const { success, error } = await adminService.suspendUser(
        selectedUser.id,
        actionReason,
        currentAdmin.id
      );

      if (error || !success) {
        toast({
          title: "Error",
          description: "Failed to suspend user.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User has been suspended.",
      });

      setShowSuspendDialog(false);
      setActionReason("");
      await loadUsers();
    } catch (error) {
      console.error("Error suspending user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !currentAdmin) return;

    setActionLoading(true);
    try {
      const { success, error } = await adminService.deleteUser(
        selectedUser.id,
        currentAdmin.id
      );

      if (error || !success) {
        toast({
          title: "Error",
          description: "Failed to delete user.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User has been deleted.",
      });

      setShowDeleteDialog(false);
      await loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-500",
      agency: "bg-purple-500",
      anchor: "bg-blue-500",
      user: "bg-green-500",
    };
    return colors[role] || "bg-gray-500";
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-500",
      banned: "bg-red-500",
      suspended: "bg-orange-500",
      deleted: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage all users, roles, and permissions
            </p>
          </div>
          <Button onClick={loadUsers} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
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
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Total Users</div>
            <div className="text-2xl font-bold">{users.length}</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-green-500">
              {users.filter((u) => u.status === "active").length}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Suspended</div>
            <div className="text-2xl font-bold text-orange-500">
              {users.filter((u) => u.status === "suspended").length}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Banned</div>
            <div className="text-2xl font-bold text-red-500">
              {users.filter((u) => u.status === "banned").length}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name || "N/A"}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role || "user")}>
                        {user.role || "user"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadgeColor(user.status || "active")}
                      >
                        {user.status || "active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at || "").toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setNewRole(user.role || "user");
                              setShowRoleDialog(true);
                            }}
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          {user.status === "banned" ? (
                            <DropdownMenuItem
                              onClick={() => handleUnbanUser(user.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Unban User
                            </DropdownMenuItem>
                          ) : (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowSuspendDialog(true);
                                }}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Suspend User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowBanDialog(true);
                                }}
                                className="text-red-600"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Ban User
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteDialog(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
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

        {/* Change Role Dialog */}
        <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Update the role for {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="anchor">Anchor</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRoleDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleChangeRole} disabled={actionLoading}>
                {actionLoading ? "Updating..." : "Update Role"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Ban User Dialog */}
        <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ban User</DialogTitle>
              <DialogDescription>
                This will permanently ban {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Reason for ban..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBanDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBanUser}
                disabled={actionLoading || !actionReason}
              >
                {actionLoading ? "Banning..." : "Ban User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Suspend User Dialog */}
        <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suspend User</DialogTitle>
              <DialogDescription>
                Temporarily suspend {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Reason for suspension..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSuspendDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSuspendUser}
                disabled={actionLoading || !actionReason}
              >
                {actionLoading ? "Suspending..." : "Suspend User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}