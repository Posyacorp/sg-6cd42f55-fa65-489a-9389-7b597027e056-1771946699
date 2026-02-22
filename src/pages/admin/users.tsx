import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Building2, 
  DollarSign, 
  Gift, 
  TrendingDown, 
  Vault, 
  Settings,
  Search,
  MoreVertical,
  Ban,
  CheckCircle
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="w-4 h-4" /> },
  { label: "Anchors", href: "/admin/anchors", icon: <UserCheck className="w-4 h-4" /> },
  { label: "Agencies", href: "/admin/agencies", icon: <Building2 className="w-4 h-4" /> },
  { label: "Economy", href: "/admin/economy", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Gifts", href: "/admin/gifts", icon: <Gift className="w-4 h-4" /> },
  { label: "Withdrawals", href: "/admin/withdrawals", icon: <TrendingDown className="w-4 h-4" /> },
  { label: "Treasury", href: "/admin/treasury", icon: <Vault className="w-4 h-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> }
];

export default function AdminUsers() {
  return (
    <>
      <SEO title="User Management - Pukaarly Admin" />
      <DashboardLayout navItems={navItems} role="admin">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage platform users</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,453</div>
                <p className="text-xs text-green-600 mt-1">+342 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,847</div>
                <p className="text-xs text-gray-500 mt-1">31% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,134</div>
                <p className="text-xs text-gray-500 mt-1">17% conversion</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-red-600 mt-1">Requires review</p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search users by name, email, or ID..." className="pl-10" />
                </div>
                <select className="h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Suspended</option>
                  <option>Banned</option>
                </select>
                <select className="h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <option>All Types</option>
                  <option>Free</option>
                  <option>Premium</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "John Doe", email: "john@example.com", coins: "1,240", tokens: "340", status: "active", joined: "Jan 15, 2026" },
                  { name: "Sarah Smith", email: "sarah@example.com", coins: "3,560", tokens: "890", status: "active", joined: "Jan 12, 2026" },
                  { name: "Mike Johnson", email: "mike@example.com", coins: "780", tokens: "120", status: "active", joined: "Jan 10, 2026" },
                  { name: "Emma Wilson", email: "emma@example.com", coins: "2,340", tokens: "560", status: "suspended", joined: "Jan 8, 2026" },
                  { name: "David Brown", email: "david@example.com", coins: "890", tokens: "210", status: "active", joined: "Jan 5, 2026" }
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold">{user.coins}</p>
                        <p className="text-xs text-gray-500">Coins</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold">{user.tokens}</p>
                        <p className="text-xs text-gray-500">Tokens</p>
                      </div>
                      <div className="text-center min-w-[120px]">
                        <p className="text-xs text-gray-500">{user.joined}</p>
                      </div>
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>
                        {user.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}