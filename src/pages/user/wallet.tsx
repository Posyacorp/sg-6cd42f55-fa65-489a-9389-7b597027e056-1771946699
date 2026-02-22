import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportToCSV } from "@/lib/export";
import { 
  LayoutDashboard, 
  Compass, 
  MessageSquare, 
  Wallet, 
  User, 
  Users, 
  DollarSign,
  Coins,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download
} from "lucide-react";

export default function UserWallet() {
  const transactions = [
    { type: "Coin Purchase", amount: "+500 coins", value: "$500.00", time: "Today, 10:30 AM", status: "completed" },
    { type: "Gift Sent", amount: "-50 coins", value: "-$50.00", time: "Today, 09:15 AM", status: "completed" },
    { type: "Reward Earned", amount: "+40 tokens", value: "$40.00", time: "Yesterday, 08:45 PM", status: "completed" },
    { type: "Referral Bonus", amount: "+25 tokens", value: "$25.00", time: "Yesterday, 03:20 PM", status: "completed" },
    { type: "Gift Sent", amount: "-100 coins", value: "-$100.00", time: "2 days ago", status: "completed" }
  ];

  const handleExport = () => {
    exportToCSV(transactions, "wallet_transactions");
  };

  return (
    <>
      <SEO title="Wallet - Pukaarly" />
      <DashboardLayout role="user">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Wallet</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your coins and tokens</p>
          </div>

          {/* Balance Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Coin Balance</span>
                  <Coins className="w-6 h-6" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">$350.00</div>
                <p className="text-blue-100 text-sm">Available to spend</p>
                <Button className="w-full mt-4 bg-white text-blue-600 hover:bg-blue-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Coins
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Reward Tokens</span>
                  <TrendingUp className="w-6 h-6" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">12,450</div>
                <p className="text-purple-100 text-sm">Earned from activity</p>
                <Button className="w-full mt-4 bg-white text-purple-600 hover:bg-purple-50">
                  View Details
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600 to-teal-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Total Earnings</span>
                  <DollarSign className="w-6 h-6" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">$1,240</div>
                <p className="text-green-100 text-sm">All-time rewards</p>
                <Button className="w-full mt-4 bg-white text-green-600 hover:bg-green-50">
                  Withdraw
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-2 border-dashed hover:border-solid hover:border-blue-600 transition-all cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-1">Add Coins</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Purchase coins to use on platform</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed hover:border-solid hover:border-purple-600 transition-all cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-1">Convert Tokens</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Exchange tokens for cash</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx, i) => {
                  const isPositive = tx.amount.startsWith('+');
                  const color = isPositive ? "text-green-600" : "text-red-600";
                  const icon = isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />;
                  
                  return (
                    <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${color}`}>
                          {icon}
                        </div>
                        <div>
                          <p className="font-medium">{tx.type}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{tx.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${color}`}>{tx.amount}</p>
                        {tx.value && <p className="text-sm text-gray-600 dark:text-gray-400">{tx.value}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}