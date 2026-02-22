import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { exportToCSV } from "@/lib/export";
import { 
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Download
} from "lucide-react";

export default function AnchorIncome() {
  const earningsData = [
    { month: "Jan", gifts: 1200, calls: 800, bonus: 200 },
    { month: "Feb", gifts: 1800, calls: 1200, bonus: 300 },
    { month: "Mar", gifts: 1600, calls: 1000, bonus: 250 },
    { month: "Apr", gifts: 2200, calls: 1400, bonus: 400 },
    { month: "May", gifts: 2800, calls: 1800, bonus: 500 },
    { month: "Jun", gifts: 3200, calls: 2000, bonus: 600 }
  ];

  const incomeBreakdown = [
    { source: "Video Calls", amount: "$2,450", percentage: "45%", trend: "+12%" },
    { source: "Virtual Gifts", amount: "$1,890", percentage: "35%", trend: "+8%" },
    { source: "Premium Chat", amount: "$780", percentage: "15%", trend: "+5%" },
    { source: "Bonuses", amount: "$270", percentage: "5%", trend: "+15%" }
  ];

  const recentEarnings = [
    { date: "2026-02-21", user: "User_4523", type: "Video Call", amount: "$45", duration: "30 min" },
    { date: "2026-02-21", user: "User_8912", type: "Gift", amount: "$25", gift: "Diamond Ring" },
    { date: "2026-02-20", user: "User_3421", type: "Video Call", amount: "$60", duration: "40 min" },
    { date: "2026-02-20", user: "User_7634", type: "Premium Chat", amount: "$15", duration: "15 min" },
    { date: "2026-02-19", user: "User_2109", type: "Gift", amount: "$50", gift: "Luxury Car" }
  ];

  const handleExportBreakdown = () => {
    exportToCSV(incomeBreakdown, "income_breakdown");
  };

  const handleExportEarnings = () => {
    exportToCSV(recentEarnings, "recent_earnings");
  };

  return (
    <>
      <SEO title="Income - Pukaarly" />
      <DashboardLayout role="anchor">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Income Details</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your earnings and performance</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$5,390</div>
                <p className="text-xs text-green-600 mt-1">+18% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Video Calls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">142</div>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Call Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">28m</div>
                <p className="text-xs text-gray-500 mt-1">Average time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gifts Received</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">89</div>
                <p className="text-xs text-gray-500 mt-1">Total gifts</p>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Trend (6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                title="Earnings Trend"
                data={earningsData}
                dataKeys={[
                  { key: "gifts", color: "#8b5cf6", name: "Gifts" },
                  { key: "calls", color: "#3b82f6", name: "Calls" },
                  { key: "bonus", color: "#10b981", name: "Bonus" }
                ]}
                xAxisKey="month"
                height={300}
              />
            </CardContent>
          </Card>

          {/* Income Breakdown */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Income Sources</CardTitle>
                <Button onClick={handleExportBreakdown} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BarChart
                title="Income Breakdown"
                data={earningsData}
                dataKeys={[
                  { key: "gifts", color: "#ec4899", name: "Gifts" },
                  { key: "calls", color: "#8b5cf6", name: "Video Calls" },
                  { key: "bonus", color: "#10b981", name: "Bonuses" }
                ]}
                xAxisKey="month"
                height={300}
              />
            </CardContent>
          </Card>

          {/* Recent Earnings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Earnings</CardTitle>
                <Button onClick={handleExportEarnings} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEarnings.map((earning, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="font-medium">{earning.type}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {earning.user} • {earning.date}
                      </p>
                      {earning.duration && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {earning.duration}
                        </p>
                      )}
                      {earning.gift && (
                        <p className="text-xs text-purple-600 mt-1">{earning.gift}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{earning.amount}</p>
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