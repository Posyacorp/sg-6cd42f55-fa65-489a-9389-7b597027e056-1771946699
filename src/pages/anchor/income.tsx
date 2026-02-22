import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Coins,
  ArrowUpRight,
  Gift,
  Users,
  Calendar
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/anchor/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Income", href: "/anchor/income", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Call Price", href: "/anchor/call-price", icon: <Settings className="w-4 h-4" /> },
  { label: "Level", href: "/anchor/level", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Withdraw", href: "/anchor/withdraw", icon: <DollarSign className="w-4 h-4" /> }
];

export default function AnchorIncome() {
  return (
    <>
      <SEO title="Income - Pukaarly Anchor" />
      <DashboardLayout navItems={navItems} role="anchor">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Income Overview</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your earnings and revenue streams</p>
          </div>

          {/* Income Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Beans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">45,230</div>
                <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8,450</div>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2,340</div>
                <p className="text-xs text-gray-500 mt-1">7 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">450</div>
                <p className="text-xs text-gray-500 mt-1">Current session</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">Session Revenue</span>
                  </div>
                  <div className="text-2xl font-bold">32,450 beans</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">From 234 sessions</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-pink-600" />
                    <span className="font-semibold">Gift Revenue</span>
                  </div>
                  <div className="text-2xl font-bold">10,780 beans</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">From 156 gifts</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">Bonus</span>
                  </div>
                  <div className="text-2xl font-bold">2,000 beans</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Performance rewards</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earnings History */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Session", user: "John Doe", amount: "450 beans", date: "Today, 10:30 AM", icon: <Coins className="w-4 h-4" /> },
                  { type: "Gift Received", user: "Alice Smith", amount: "200 beans", date: "Today, 09:15 AM", icon: <Gift className="w-4 h-4" /> },
                  { type: "Session", user: "Bob Johnson", amount: "600 beans", date: "Yesterday, 08:45 PM", icon: <Coins className="w-4 h-4" /> },
                  { type: "Gift Received", user: "Carol White", amount: "150 beans", date: "Yesterday, 03:20 PM", icon: <Gift className="w-4 h-4" /> },
                  { type: "Session", user: "David Brown", amount: "300 beans", date: "2 days ago", icon: <Coins className="w-4 h-4" /> }
                ].map((earning, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                        {earning.icon}
                      </div>
                      <div>
                        <p className="font-medium">{earning.type}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {earning.user} • {earning.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">+{earning.amount}</p>
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