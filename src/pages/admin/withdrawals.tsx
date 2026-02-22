import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  CheckCircle,
  XCircle,
  Clock
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

export default function AdminWithdrawals() {
  return (
    <>
      <SEO title="Withdrawal Management - Pukaarly Admin" />
      <DashboardLayout navItems={navItems} role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Withdrawal Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Review and process withdrawal requests</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-orange-600 mt-1">Requires review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,230</div>
                <p className="text-xs text-gray-500 mt-1">Pending total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Processed Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-green-600 mt-1">$2,840 paid out</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-red-600 mt-1">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search withdrawals..." className="pl-10" />
                </div>
                <select className="h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
                <select className="h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <option>All Types</option>
                  <option>User Token</option>
                  <option>Anchor Beans</option>
                  <option>Agency Commission</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Pending Withdrawals */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Withdrawal Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "Sarah K.", type: "Anchor Beans", amount: "$150", beans: "15,000", wallet: "0x1234...5678", date: "Feb 22, 2026", status: "pending" },
                  { user: "Emma L.", type: "User Token", amount: "$75", tokens: "3,000", wallet: "0x8765...4321", date: "Feb 22, 2026", status: "pending" },
                  { user: "Elite Stars", type: "Agency Commission", amount: "$450", commission: "45,000", wallet: "0x9999...1111", date: "Feb 21, 2026", status: "pending" },
                  { user: "John D.", type: "User Token", amount: "$50", tokens: "2,000", wallet: "0x2222...3333", date: "Feb 21, 2026", status: "pending" }
                ].map((withdrawal, i) => (
                  <div key={i} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                          {withdrawal.user.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{withdrawal.user}</h3>
                            <Badge variant="secondary">
                              <Clock className="w-3 h-3 mr-1" />
                              {withdrawal.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{withdrawal.type}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-gray-500">Amount</p>
                              <p className="font-semibold text-green-600">{withdrawal.amount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Wallet</p>
                              <p className="font-mono text-xs">{withdrawal.wallet}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Date</p>
                              <p className="font-medium">{withdrawal.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Processed */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { user: "Lisa M.", type: "Anchor Beans", amount: "$200", status: "approved", date: "Feb 22, 2026" },
                  { user: "Mike R.", type: "User Token", amount: "$30", status: "approved", date: "Feb 21, 2026" },
                  { user: "Anna R.", type: "Agency Commission", amount: "$280", status: "approved", date: "Feb 21, 2026" },
                  { user: "Tom S.", type: "User Token", amount: "$45", status: "rejected", date: "Feb 20, 2026" }
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                        {tx.user.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{tx.user}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tx.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{tx.amount}</p>
                        <p className="text-xs text-gray-500">{tx.date}</p>
                      </div>
                      <Badge variant={tx.status === "approved" ? "default" : "destructive"}>
                        {tx.status}
                      </Badge>
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