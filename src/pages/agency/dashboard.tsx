import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Coins,
  Star,
  UserPlus
} from "lucide-react";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";

export default function AgencyDashboard() {
  const commissionData = [
    { month: "Jan", amount: 12400 },
    { month: "Feb", amount: 15600 },
    { month: "Mar", amount: 14200 },
    { month: "Apr", amount: 18900 },
    { month: "May", amount: 22400 },
    { month: "Jun", amount: 25600 },
  ];

  const anchorPerformance = [
    { name: "Sarah", beans: 4200 },
    { name: "Emma", beans: 3800 },
    { name: "Lisa", beans: 3200 },
    { name: "Anna", beans: 2900 },
    { name: "Jessica", beans: 2100 },
  ];

  return (
    <>
      <SEO title="Dashboard - Pukaarly Agency" />
      <DashboardLayout role="agency">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Agency Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your anchors and earnings</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Anchors</CardTitle>
                <Users className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-gray-500 mt-1">+3 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                <Coins className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15,430</div>
                <p className="text-xs text-gray-500 mt-1">Beans earned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+18%</div>
                <p className="text-xs text-green-600 mt-1">vs last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                <Star className="w-4 h-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Sarah K.</div>
                <p className="text-xs text-gray-500 mt-1">4,230 beans</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Commission Growth</CardTitle>
                <CardDescription>Monthly commission earnings in beans</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={commissionData}
                  dataKeys={[{ key: "amount", color: "#10b981", name: "Commission" }]}
                  xAxisKey="month"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Anchors</CardTitle>
                <CardDescription>Performance by beans earned this month</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={anchorPerformance}
                  dataKeys={[{ key: "beans", color: "#3b82f6", name: "Beans" }]}
                  xAxisKey="name"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New Anchor Joined", name: "Jessica P.", time: "2 hours ago", type: "join" },
                  { action: "Commission Earned", name: "Sarah K.", time: "5 hours ago", type: "earning" },
                  { action: "Withdrawal Approved", name: "You", time: "1 day ago", type: "withdrawal" },
                  { action: "Commission Earned", name: "Emma L.", time: "1 day ago", type: "earning" }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === "join" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
                      activity.type === "earning" ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
                      "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
                    }`}>
                      {activity.type === "join" && <UserPlus className="w-5 h-5" />}
                      {activity.type === "earning" && <Coins className="w-5 h-5" />}
                      {activity.type === "withdrawal" && <TrendingUp className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{activity.name} • {activity.time}</p>
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