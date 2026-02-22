import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  TrendingUp,
  Coins,
  Wallet
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

export default function AdminEconomy() {
  return (
    <>
      <SEO title="Economy Management - Pukaarly Admin" />
      <DashboardLayout navItems={navItems} role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Economy Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Platform economy and token distribution</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$284,340</div>
                <p className="text-xs text-green-600 mt-1">+12.5% vs last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tokens Minted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">11.4M</div>
                <p className="text-xs text-gray-500 mt-1">Total supply</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Coins in Circulation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.7M</div>
                <p className="text-xs text-gray-500 mt-1">Active coins</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Beans Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.2M</div>
                <p className="text-xs text-gray-500 mt-1">Total beans</p>
              </CardContent>
            </Card>
          </div>

          {/* Token Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Token Distribution Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Anchor (50%)</span>
                    <span className="font-semibold">5.7M tokens</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-purple-600 h-3 rounded-full" style={{ width: "50%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">User (20%)</span>
                    <span className="font-semibold">2.3M tokens</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: "20%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Admin (10%)</span>
                    <span className="font-semibold">1.1M tokens</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Agency (10%)</span>
                    <span className="font-semibold">1.1M tokens</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-cyan-600 h-3 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Referral Pool (10%)</span>
                    <span className="font-semibold">1.1M tokens</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-orange-600 h-3 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Configuration */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Coin Packages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { coins: "100 Coins", price: "$0.99", tokens: "40 tokens" },
                    { coins: "500 Coins", price: "$4.99", tokens: "200 tokens" },
                    { coins: "1000 Coins", price: "$9.99", tokens: "400 tokens" },
                    { coins: "5000 Coins", price: "$49.99", tokens: "2000 tokens" }
                  ].map((pkg, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <div>
                        <p className="font-semibold">{pkg.coins}</p>
                        <p className="text-xs text-gray-500">+ {pkg.tokens} reward</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{pkg.price}</p>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Coins → Beans</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">Edit</Button>
                    </div>
                    <p className="text-2xl font-bold">1:1</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Direct conversion</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Beans → USD</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">Edit</Button>
                    </div>
                    <p className="text-2xl font-bold">100:1</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">100 beans = $1</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Token Reward Rate</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">Edit</Button>
                    </div>
                    <p className="text-2xl font-bold">40:1</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">40 tokens per $1 spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Large Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { user: "John D.", type: "Coin Purchase", amount: "$49.99", coins: "5000", time: "2 min ago" },
                  { user: "Sarah K.", type: "Gift Sent", amount: "1000 coins", coins: "-1000", time: "15 min ago" },
                  { user: "Mike R.", type: "Coin Purchase", amount: "$9.99", coins: "1000", time: "1 hour ago" },
                  { user: "Emma L.", type: "Beans Withdrawal", amount: "$150", coins: "15000", time: "2 hours ago" }
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
                    <div className="text-right">
                      <p className="font-semibold">{tx.amount}</p>
                      <p className="text-xs text-gray-500">{tx.time}</p>
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