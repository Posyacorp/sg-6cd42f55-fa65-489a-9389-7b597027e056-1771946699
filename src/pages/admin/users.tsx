import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { exportToCSV } from "@/lib/export";
import { 
  Search,
  Filter,
  DollarSign,
  Users,
  Download
} from "lucide-react";

export default function AdminUsers() {
  const users = [
    { id: "U001", name: "John Doe", email: "john@example.com", role: "user", coins: 2450, status: "active", joined: "2026-01-15" },
    { id: "U002", name: "Jane Smith", email: "jane@example.com", role: "user", coins: 1890, status: "active", joined: "2026-01-20" },
    { id: "U003", name: "Bob Wilson", email: "bob@example.com", role: "user", coins: 3200, status: "suspended", joined: "2026-02-01" },
    { id: "U004", name: "Alice Brown", email: "alice@example.com", role: "user", coins: 890, status: "active", joined: "2026-02-10" }
  ];

  const handleExport = () => {
    exportToCSV(users, "platform_users");
  };

  return (
    <>
      <SEO title="Users - Pukaarly" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage platform users</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12,458</div>
                <p className="text-xs text-green-600 mt-1">+245 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8,923</div>
                <p className="text-xs text-gray-500 mt-1">72% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">245K</div>
                <p className="text-xs text-gray-500 mt-1">In circulation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">127</div>
                <p className="text-xs text-gray-500 mt-1">Requires review</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search users..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button onClick={handleExport} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
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
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-4 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{user.name}</p>
                          <Badge variant={user.status === "active" ? "default" : "destructive"}>
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">ID: {user.id} • Joined {user.joined}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Coin Balance</p>
                      <p className="text-xl font-bold flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {user.coins.toLocaleString()}
                      </p>
                    </div>
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