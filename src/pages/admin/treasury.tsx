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
  TrendingUp,
  Download,
  Plus
} from "lucide-react";

export default function AdminTreasury() {
  const treasuryLogs = [
    { 
      id: "TR-001", 
      date: "Feb 20, 2026",
      type: "USDT Conversion",
      amount: "$50,000", 
      profit: "$5,000",
      liquidity: "$45,000",
      notes: "Monthly conversion batch"
    },
    { 
      id: "TR-002", 
      date: "Feb 15, 2026",
      type: "Profit Distribution",
      amount: "$8,500", 
      profit: "$0",
      liquidity: "$8,500",
      notes: "Reward pool allocation"
    },
    { 
      id: "TR-003", 
      date: "Feb 10, 2026",
      type: "USDT Conversion",
      amount: "$35,000", 
      profit: "$3,200",
      liquidity: "$31,800",
      notes: "Mid-month conversion"
    },
    { 
      id: "TR-004", 
      date: "Feb 5, 2026",
      type: "Liquidity Addition",
      amount: "$25,000", 
      profit: "$0",
      liquidity: "$25,000",
      notes: "Emergency liquidity boost"
    }
  ];

  const handleExport = () => {
    exportToCSV(treasuryLogs, "treasury_operations");
  };

  return (
    <>
      <SEO title="Treasury - Pukaarly" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Treasury Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manual treasury operations and logging</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-50">Total Converted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$890K</div>
                <p className="text-xs text-green-100 mt-1">USDT lifetime</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-50">Total Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$78K</div>
                <p className="text-xs text-blue-100 mt-1">All time</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-50">Liquidity Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$245K</div>
                <p className="text-xs text-purple-100 mt-1">Available</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$85K</div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% vs last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Log New Operation */}
          <Card>
            <CardHeader>
              <CardTitle>Log Treasury Operation</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Operation Type</Label>
                    <select 
                      id="type" 
                      className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                    >
                      <option>USDT Conversion</option>
                      <option>Profit Distribution</option>
                      <option>Liquidity Addition</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Total Amount (USD)</Label>
                    <Input id="amount" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profit">Profit Generated (USD)</Label>
                    <Input id="profit" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liquidity">Liquidity Added (USD)</Label>
                    <Input id="liquidity" type="number" placeholder="0.00" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Add operation notes..." />
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Operation
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Operation History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Operation History</CardTitle>
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {treasuryLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-4 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold">{log.id}</p>
                        <Badge variant="secondary">{log.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{log.notes}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                      <p className="text-xl font-bold flex items-center justify-end gap-1">
                        <DollarSign className="w-4 h-4" />
                        {log.amount.replace('$', '')}
                      </p>
                      <div className="flex gap-3 mt-1 text-xs">
                        <span className="text-green-600">Profit: {log.profit}</span>
                        <span className="text-blue-600">Liquidity: {log.liquidity}</span>
                      </div>
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