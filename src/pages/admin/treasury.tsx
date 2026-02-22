import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
  TrendingUp,
  Droplets
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

export default function AdminTreasury() {
  return (
    <>
      <SEO title="Treasury Management - Pukaarly Admin" />
      <DashboardLayout navItems={navItems} role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Treasury Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manual treasury operations and financial tracking</p>
          </div>

          {/* Treasury Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">USDT Converted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$284,340</div>
                <p className="text-xs text-gray-500 mt-1">Total conversions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profit Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$85,302</div>
                <p className="text-xs text-green-600 mt-1">30% platform fee</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Liquidity Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$142,170</div>
                <p className="text-xs text-blue-600 mt-1">Available liquidity</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Reserve Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$56,868</div>
                <p className="text-xs text-gray-500 mt-1">Emergency fund</p>
              </CardContent>
            </Card>
          </div>

          {/* Log New Transaction */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  USDT Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amount (USDT)</label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Conversion Rate</label>
                    <Input type="number" placeholder="1.00" defaultValue="1.00" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes</label>
                    <Textarea placeholder="Add transaction notes..." className="h-20" />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Conversion
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Profit Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Profit Amount ($)</label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Source</label>
                    <select className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                      <option>Platform Fees</option>
                      <option>Withdrawal Fees</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes</label>
                    <Textarea placeholder="Add profit notes..." className="h-20" />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Profit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  Liquidity Addition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Liquidity Amount ($)</label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Pool</label>
                    <select className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                      <option>Main Pool</option>
                      <option>Reserve Pool</option>
                      <option>Emergency Fund</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes</label>
                    <Textarea placeholder="Add liquidity notes..." className="h-20" />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Liquidity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Treasury Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Treasury Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { type: "USDT Conversion", amount: "$5,000", notes: "Weekly platform revenue conversion", date: "Feb 22, 2026 10:30 AM", status: "completed" },
                  { type: "Profit Entry", amount: "$1,500", notes: "Platform fees from withdrawals", date: "Feb 22, 2026 09:15 AM", status: "completed" },
                  { type: "Liquidity Addition", amount: "$3,000", notes: "Main pool liquidity boost", date: "Feb 21, 2026 03:45 PM", status: "completed" },
                  { type: "USDT Conversion", amount: "$8,500", notes: "Monthly revenue conversion", date: "Feb 20, 2026 02:20 PM", status: "completed" },
                  { type: "Profit Entry", amount: "$2,550", notes: "Gift transaction platform fees", date: "Feb 19, 2026 11:00 AM", status: "completed" }
                ].map((log, i) => (
                  <div key={i} className="flex items-start justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                        {log.type === "USDT Conversion" && <DollarSign className="w-6 h-6 text-white" />}
                        {log.type === "Profit Entry" && <TrendingUp className="w-6 h-6 text-white" />}
                        {log.type === "Liquidity Addition" && <Droplets className="w-6 h-6 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{log.type}</h3>
                          <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded">
                            {log.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{log.notes}</p>
                        <p className="text-xs text-gray-500">{log.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">{log.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Profit Margin</p>
                  <p className="text-3xl font-bold">30%</p>
                  <p className="text-xs text-gray-500 mt-2">Platform fee rate</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Liquidity Ratio</p>
                  <p className="text-3xl font-bold">2.5x</p>
                  <p className="text-xs text-gray-500 mt-2">Coverage ratio</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reserve Fund</p>
                  <p className="text-3xl font-bold">20%</p>
                  <p className="text-xs text-gray-500 mt-2">Of total revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}