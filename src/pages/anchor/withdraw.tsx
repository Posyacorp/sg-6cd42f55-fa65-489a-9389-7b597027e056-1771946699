import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { exportToCSV } from "@/lib/export";
import { 
  DollarSign,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Download
} from "lucide-react";

export default function AnchorWithdraw() {
  const withdrawals = [
    { amount: "2,500", value: "$2,500", method: "Bank Transfer", date: "Feb 15, 2026", status: "completed" },
    { amount: "1,800", value: "$1,800", method: "PayPal", date: "Feb 8, 2026", status: "completed" },
    { amount: "1,200", value: "$1,200", method: "Crypto", date: "Feb 1, 2026", status: "pending" },
    { amount: "950", value: "$950", method: "Bank Transfer", date: "Jan 25, 2026", status: "rejected" }
  ];

  const handleExport = () => {
    exportToCSV(withdrawals, "anchor_withdrawals");
  };

  return (
    <>
      <SEO title="Withdraw - Pukaarly" />
      <DashboardLayout role="anchor">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Withdraw Earnings</h1>
            <p className="text-gray-600 dark:text-gray-400">Request withdrawal of your beans</p>
          </div>

          {/* Available Balance */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <CardHeader>
                <CardTitle>Available Beans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">8,450</div>
                <p className="text-purple-100">Beans Balance</p>
                <p className="text-sm text-purple-100 mt-2">≈ $8,450 USD</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Minimum</span>
                  <span className="font-semibold">500 beans</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Processing</span>
                  <span className="font-semibold">1-3 business days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Fee</span>
                  <span className="font-semibold">2%</span>
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
                    min="500"
                    max="8450"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Minimum: 500 beans
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
                    Processing time is typically 1-3 business days.
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
              <div className="flex items-center justify-between">
                <CardTitle>Withdrawal History</CardTitle>
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {withdrawals.map((withdrawal, i) => (
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