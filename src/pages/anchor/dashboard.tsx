import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  LogOut,
  Coins,
  Users,
  Clock,
  Video,
  Star
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/anchor/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Income", href: "/anchor/income", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Call Price", href: "/anchor/call-price", icon: <Settings className="w-4 h-4" /> },
  { label: "Level", href: "/anchor/level", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Withdraw", href: "/anchor/withdraw", icon: <DollarSign className="w-4 h-4" /> }
];

export default function AnchorDashboard() {
  return (
    <>
      <SEO title="Dashboard - Pukaarly Anchor" />
      <DashboardLayout navItems={navItems} role="anchor">
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

          {/* Charts & Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Session Completion Rate</span>
                      <span className="font-semibold">98%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: "98%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Client Satisfaction</span>
                      <span className="font-semibold">96%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: "96%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                      <span className="font-semibold">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: "94%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Availability</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}