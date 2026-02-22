import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { exportToCSV } from "@/lib/export";
import { 
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Download
} from "lucide-react";

export default function AdminWithdrawals() {
  const withdrawals = [
    { 
      id: "WD-3401", 
      user: "Anchor_A",
      type: "Beans",
      amount: "$2,450", 
      method: "Bank Transfer", 
      date: "Feb 20, 2026", 
      status: "pending"
    },
    { 
      id: "WD-3402", 
      user: "User_8923",
      type: "Tokens",
      amount: "$890", 
      method: "PayPal", 
      date: "Feb 19, 2026", 
      status: "pending"
    },
    { 
      id: "WD-3403", 
      user: "Agency_1",
      type: "Commission",
      amount: "$5,200", 
      method: "Crypto", 
      date: "Feb 18, 2026", 
      status: "approved"
    },
    { 
      id: "WD-3404", 
      user: "Anchor_C",
      type: "Beans",
      amount: "$1,680", 
      method: "Bank Transfer", 
      date: "Feb 17, 2026", 
      status: "rejected"
    }
  ];

  const handleExport = () => {
    exportToCSV(withdrawals, "platform_withdrawals");
  };

  return (
    <>
      <SEO title="Withdrawals - Pukaarly" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Withdrawal Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Review and approve withdrawal requests</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">23</div>
                <p className="text-xs text-yellow-600 mt-1">Requires review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">18</div>
                <p className="text-xs text-green-600 mt-1">$45,200 total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$890K</div>
                <p className="text-xs text-gray-500 mt-1">Total processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">7</div>
                <p className="text-xs text-gray-500 mt-1">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search withdrawals..." className="pl-10" />
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

          {/* Withdrawals List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Withdrawal Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between py-4 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold">{withdrawal.id}</p>
                        <Badge 
                          variant={
                            withdrawal.status === "approved" ? "default" : 
                            withdrawal.status === "pending" ? "secondary" : 
                            "destructive"
                          }
                          className="flex items-center gap-1"
                        >
                          {withdrawal.status === "approved" && <CheckCircle className="w-3 h-3" />}
                          {withdrawal.status === "pending" && <Clock className="w-3 h-3" />}
                          {withdrawal.status === "rejected" && <XCircle className="w-3 h-3" />}
                          {withdrawal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {withdrawal.user} • {withdrawal.type} • {withdrawal.method}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{withdrawal.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold">{withdrawal.amount}</p>
                      </div>
                      {withdrawal.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="default">
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            Reject
                          </Button>
                        </div>
                      )}
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