import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  TrendingUp, 
  UserPlus,
  Coins,
  Star,
  Award
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/agency/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Anchors", href: "/agency/anchors", icon: <Users className="w-4 h-4" /> },
  { label: "Commission", href: "/agency/commission", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Withdrawals", href: "/agency/withdrawals", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Invite", href: "/agency/invite", icon: <UserPlus className="w-4 h-4" /> }
];

export default function AgencyDashboard() {
  return (
    <>
      <SEO title="Dashboard - Pukaarly Agency" />
      <DashboardLayout navItems={navItems} role="agency">
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
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,840</div>
                <p className="text-xs text-green-600 mt-1">+18% from last month</p>
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

          {/* Top Performers */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Anchors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sarah K.", earnings: "4,230 beans", sessions: 156, rating: 4.9 },
                    { name: "Emma L.", earnings: "3,840 beans", sessions: 142, rating: 4.8 },
                    { name: "Lisa M.", earnings: "3,210 beans", sessions: 128, rating: 4.7 },
                    { name: "Anna R.", earnings: "2,950 beans", sessions: 115, rating: 4.8 }
                  ].map((anchor, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                          {anchor.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{anchor.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {anchor.sessions} sessions • ⭐ {anchor.rating}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-green-600">{anchor.earnings}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Average Anchor Rating</span>
                    <span className="font-semibold">4.7/5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: "94%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Active Anchors</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Monthly Growth</span>
                    <span className="font-semibold">18%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: "18%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}