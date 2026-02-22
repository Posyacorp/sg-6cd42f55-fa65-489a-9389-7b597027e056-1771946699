import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  TrendingUp,
  Activity
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

export default function AdminDashboard() {
  return (
    <>
      <SEO title="Admin Dashboard - Pukaarly" />
      <DashboardLayout navItems={navItems} role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Platform overview and management</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,453</div>
                <p className="text-xs text-green-600 mt-1">+342 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Anchors</CardTitle>
                <UserCheck className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">847</div>
                <p className="text-xs text-green-600 mt-1">+45 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$284,340</div>
                <p className="text-xs text-green-600 mt-1">+12.5% vs last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tokens Minted</CardTitle>
                <Activity className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">11.4M</div>
                <p className="text-xs text-gray-500 mt-1">Total supply</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500">Revenue chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "John D.", type: "User", time: "5 min ago" },
                    { name: "Sarah K.", type: "Anchor", time: "15 min ago" },
                    { name: "Elite Agency", type: "Agency", time: "1 hour ago" },
                    { name: "Mike R.", type: "User", time: "2 hours ago" }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                          {activity.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{activity.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{activity.type}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { item: "Withdrawal Request", user: "Sarah K.", amount: "$150" },
                    { item: "Anchor Application", user: "Emma L.", amount: "-" },
                    { item: "Agency Application", user: "Star Agency", amount: "-" },
                    { item: "Withdrawal Request", user: "John D.", amount: "$75" }
                  ].map((pending, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                      <div>
                        <p className="font-medium">{pending.item}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{pending.user}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{pending.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Health */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Active Sessions</span>
                    <span className="font-semibold">847/1000</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Server Capacity</span>
                    <span className="font-semibold">62%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: "62%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Support Tickets</span>
                    <span className="font-semibold">12 pending</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: "35%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}