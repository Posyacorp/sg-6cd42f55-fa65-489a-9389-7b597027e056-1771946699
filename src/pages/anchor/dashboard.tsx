import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Coins,
  Users,
  Video,
  Star
} from "lucide-react";
import { BarChart } from "@/components/charts/BarChart";
import { AreaChart } from "@/components/charts/AreaChart";

export default function AnchorDashboard() {
  const earningsData = [
    { day: "Mon", beans: 4500 },
    { day: "Tue", beans: 6200 },
    { day: "Wed", beans: 5100 },
    { day: "Thu", beans: 7800 },
    { day: "Fri", beans: 9200 },
    { day: "Sat", beans: 12400 },
    { day: "Sun", beans: 10500 },
  ];

  const sessionData = [
    { day: "Mon", minutes: 120 },
    { day: "Tue", minutes: 180 },
    { day: "Wed", minutes: 150 },
    { day: "Thu", minutes: 240 },
    { day: "Fri", minutes: 300 },
    { day: "Sat", minutes: 420 },
    { day: "Sun", minutes: 360 },
  ];

  return (
    <>
      <SEO title="Dashboard - Pukaarly Anchor" />
      <DashboardLayout role="anchor">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Anchor Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your hosting sessions and earnings</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Beans Earned</CardTitle>
                <Coins className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,230</div>
                <p className="text-xs text-gray-500 mt-1">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Video className="w-4 h-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">234</div>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-gray-500 mt-1">Regular clients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                <Star className="w-4 h-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-gray-500 mt-1">Based on 156 reviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Earnings</CardTitle>
                <CardDescription>Beans earned over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={earningsData}
                  dataKeys={[{ key: "beans", color: "#9333ea", name: "Beans" }]}
                  xAxisKey="day"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Trends</CardTitle>
                <CardDescription>Daily call minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart
                  data={sessionData}
                  dataKeys={[{ key: "minutes", color: "#db2777", name: "Minutes" }]}
                  xAxisKey="day"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "John Doe", duration: "45 min", earned: "450 beans", time: "2 hours ago" },
                  { user: "Alice Smith", duration: "30 min", earned: "300 beans", time: "5 hours ago" },
                  { user: "Bob Johnson", duration: "60 min", earned: "600 beans", time: "1 day ago" },
                  { user: "Carol White", duration: "25 min", earned: "250 beans", time: "1 day ago" }
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                        {session.user.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{session.user}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{session.duration} • {session.time}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600">{session.earned}</span>
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