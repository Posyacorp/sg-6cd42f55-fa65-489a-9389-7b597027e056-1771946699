import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart } from "@/components/charts/LineChart";
import { exportToCSV } from "@/lib/export";
import { 
  DollarSign,
  TrendingUp,
  Users,
  Download
} from "lucide-react";

export default function AgencyCommission() {
  const commissionData = [
    { month: "Jan", earned: 2400, pending: 400 },
    { month: "Feb", earned: 3200, pending: 500 },
    { month: "Mar", earned: 2800, pending: 300 },
    { month: "Apr", earned: 4100, pending: 600 },
    { month: "May", earned: 5200, pending: 800 },
    { month: "Jun", earned: 6100, pending: 900 }
  ];

  const topAnchors = [
    { name: "Anchor_A", earnings: "$12,450", commission: "$1,245", rate: "10%" },
    { name: "Anchor_B", earnings: "$9,800", commission: "$980", rate: "10%" },
    { name: "Anchor_C", earnings: "$7,650", commission: "$765", rate: "10%" },
    { name: "Anchor_D", earnings: "$6,200", commission: "$620", rate: "10%" }
  ];

  const recentCommissions = [
    { date: "2026-02-21", anchor: "Anchor_A", type: "Video Call Commission", amount: "$45" },
    { date: "2026-02-21", anchor: "Anchor_B", type: "Gift Commission", amount: "$28" },
    { date: "2026-02-20", anchor: "Anchor_C", type: "Video Call Commission", amount: "$62" },
    { date: "2026-02-20", anchor: "Anchor_A", type: "Premium Chat Commission", amount: "$18" },
    { date: "2026-02-19", anchor: "Anchor_D", type: "Gift Commission", amount: "$35" }
  ];

  const handleExportTopAnchors = () => {
    exportToCSV(topAnchors, "top_anchors_commission");
  };

  const handleExportRecent = () => {
    exportToCSV(recentCommissions, "recent_commissions");
  };

  return (
    <>
      <SEO title="Commission - Pukaarly" />
      <DashboardLayout role="agency">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Commission Tracking</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor your earnings from anchors</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$8,950</div>
                <p className="text-xs text-green-600 mt-1">+24% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$2,340</div>
                <p className="text-xs text-gray-500 mt-1">Current period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Anchors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">18</div>
                <p className="text-xs text-gray-500 mt-1">Generating revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">10%</div>
                <p className="text-xs text-gray-500 mt-1">Commission rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Commission Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Growth (6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart 
                data={commissionData}
                dataKeys={[
                  { key: "earned", color: "#10b981", name: "Earned" },
                  { key: "pending", color: "#f59e0b", name: "Pending" }
                ]}
                xAxisKey="month"
                height={300}
              />
            </CardContent>
          </Card>

          {/* Top Earning Anchors */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Earning Anchors</CardTitle>
                <Button onClick={handleExportTopAnchors} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAnchors.map((anchor, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{anchor.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Earnings: {anchor.earnings}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">{anchor.commission}</p>
                      <Badge variant="secondary">{anchor.rate} rate</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Commissions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Commissions</CardTitle>
                <Button onClick={handleExportRecent} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCommissions.map((commission, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="font-medium">{commission.type}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {commission.anchor} • {commission.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{commission.amount}</p>
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