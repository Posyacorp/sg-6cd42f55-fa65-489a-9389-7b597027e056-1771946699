import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  DollarSign, 
  TrendingUp, 
  Settings,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Coins
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/anchor/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Income", href: "/anchor/income", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Call Price", href: "/anchor/call-price", icon: <Settings className="w-4 h-4" /> },
  { label: "Level", href: "/anchor/level", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Withdraw", href: "/anchor/withdraw", icon: <DollarSign className="w-4 h-4" /> }
];

export default function AnchorWithdraw() {
  return (
    <>
      <SEO title="Withdraw - Pukaarly Anchor" />
      <DashboardLayout navItems={navItems} role="anchor">
        <div className="space-y-6 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold">Withdraw Earnings</h1>
            <p className="text-gray-600 dark:text-gray-400">Request withdrawal of your beans</p>
          </div>

          {/* Available Balance */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <CardHeader>
                <CardTitle>Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">45,230</div>
                <p className="text-purple-100">Beans Earned</p>
                <p className="text-sm text-purple-100 mt-2">≈ $1,130.75 USD</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Minimum</span>
                  <span className="font-semibold">10,000 beans</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Processing</span>
                  <span className="font-semibold">2-5 business days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Fee</span>
                  <span className="font-semibold">3%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Withdrawal Form */}
          <Card>
            <CardHeader>
              <CardTitle>New Withdrawal Request</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (Beans)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="Enter amount" 
                    min="10000"
                    max="45230"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Minimum: 10,000 beans
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">Payment Method</Label>
                  <select 
                    id="method" 
                    className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                  >
                    <option>Bank Transfer</option>
                    <option>PayPal</option>
                    <option>Crypto (USDT)</option>
                    <option>Wise</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Payment Details</Label>
                  <Input 
                    id="details" 
                    placeholder="Account number, wallet address, etc." 
                  />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> Withdrawals are processed manually and require admin approval. 
                    Processing time is typically 2-5 business days. A 3% processing fee will be deducted.
                  </p>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Submit Withdrawal Request
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Withdrawal History */}
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { amount: "20,000", value: "$500", method: "Bank Transfer", date: "Feb 18, 2026", status: "completed" },
                  { amount: "15,000", value: "$375", method: "PayPal", date: "Feb 10, 2026", status: "completed" },
                  { amount: "10,000", value: "$250", method: "Crypto", date: "Feb 3, 2026", status: "pending" },
                  { amount: "12,000", value: "$300", method: "Bank Transfer", date: "Jan 28, 2026", status: "rejected" }
                ].map((withdrawal, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="font-semibold">{withdrawal.amount} beans</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {withdrawal.value} • {withdrawal.method}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{withdrawal.date}</p>
                    </div>
                    <Badge 
                      variant={
                        withdrawal.status === "completed" ? "default" : 
                        withdrawal.status === "pending" ? "secondary" : 
                        "destructive"
                      }
                      className="flex items-center gap-1"
                    >
                      {withdrawal.status === "completed" && <CheckCircle className="w-3 h-3" />}
                      {withdrawal.status === "pending" && <Clock className="w-3 h-3" />}
                      {withdrawal.status === "rejected" && <XCircle className="w-3 h-3" />}
                      {withdrawal.status}
                    </Badge>
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