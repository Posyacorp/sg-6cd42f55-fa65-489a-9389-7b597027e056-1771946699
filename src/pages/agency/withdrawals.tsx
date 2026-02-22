import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { exportToCSV } from "@/lib/export";
import { 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  TrendingUp
} from "lucide-react";

export default function AgencyWithdrawals() {
  const withdrawals = [
    { 
      id: "WD-2401", 
      amount: "$1,245", 
      anchor: "Anchor_A",
      method: "Bank Transfer", 
      date: "Feb 15, 2026", 
      status: "completed",
      commission: "$124.50"
    },
    { 
      id: "WD-2402", 
      amount: "$980", 
      anchor: "Anchor_B",
      method: "PayPal", 
      date: "Feb 12, 2026", 
      status: "pending",
      commission: "$98.00"
    },
    { 
      id: "WD-2403", 
      amount: "$765", 
      anchor: "Anchor_C",
      method: "Crypto", 
      date: "Feb 8, 2026", 
      status: "completed",
      commission: "$76.50"
    },
    { 
      id: "WD-2404", 
      amount: "$620", 
      anchor: "Anchor_D",
      method: "Bank Transfer", 
      date: "Feb 5, 2026", 
      status: "rejected",
      commission: "$62.00"
    }
  ];

  const stats = {
    totalCommission: "$8,950",
    thisMonth: "$2,340",
    pending: "$980",
    completed: "$7,970"
  };

  const handleExport = () => {
    exportToCSV(withdrawals, "agency_withdrawals");
  };

  return (
    <>
      <SEO title="Withdrawals - Pukaarly" />
      <DashboardLayout role="agency">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Withdrawal Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Track anchor withdrawals and your commission</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalCommission}</div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.thisMonth}</div>
                <p className="text-xs text-gray-500 mt-1">Current period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pending}</div>
                <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.completed}</div>
                <p className="text-xs text-gray-500 mt-1">Successfully processed</p>
              </CardContent>
            </Card>
          </div>

          {/* Withdrawals List */}
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
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold">{withdrawal.id}</p>
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {withdrawal.anchor} • {withdrawal.method}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{withdrawal.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{withdrawal.amount}</p>
                      <p className="text-sm text-green-600 flex items-center justify-end gap-1 mt-1">
                        <DollarSign className="w-3 h-3" />
                        Commission: {withdrawal.commission}
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