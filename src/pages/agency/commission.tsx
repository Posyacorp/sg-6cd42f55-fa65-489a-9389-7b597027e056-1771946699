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
  ArrowUpRight
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/agency/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Anchors", href: "/agency/anchors", icon: <Users className="w-4 h-4" /> },
  { label: "Commission", href: "/agency/commission", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Withdrawals", href: "/agency/withdrawals", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Invite", href: "/agency/invite", icon: <UserPlus className="w-4 h-4" /> }
];

export default function AgencyCommission() {
  return (
    <>
      <SEO title="Commission - Pukaarly Agency" />
      <DashboardLayout navItems={navItems} role="agency">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Commission Overview</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your earnings from anchors</p>
          </div>

          {/* Commission Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">15,430</div>
                <p className="text-xs text-gray-500 mt-1">Lifetime beans</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2,840</div>
                <p className="text-xs text-green-600 mt-1">+18% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">680</div>
                <p className="text-xs text-gray-500 mt-1">7 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">95</div>
                <p className="text-xs text-gray-500 mt-1">Current session</p>
              </CardContent>
            </Card>
          </div>

          {/* Commission Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Commission by Anchor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sarah K.", total: "4,230 beans", commission: "423 beans", percentage: 10 },
                  { name: "Emma L.", total: "3,840 beans", commission: "384 beans", percentage: 10 },
                  { name: "Lisa M.", total: "3,210 beans", commission: "321 beans", percentage: 10 },
                  { name: "Anna R.", total: "2,950 beans", commission: "295 beans", percentage: 10 },
                  { name: "Maria S.", total: "2,340 beans", commission: "234 beans", percentage: 10 }
                ].map((anchor, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                        {anchor.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{anchor.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total: {anchor.total}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{anchor.commission}</p>
                      <p className="text-xs text-gray-500">{anchor.percentage}% commission</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Earnings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Commission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { anchor: "Sarah K.", amount: "45 beans", session: "60 min session", time: "2 hours ago" },
                  { anchor: "Emma L.", amount: "30 beans", session: "45 min session", time: "5 hours ago" },
                  { anchor: "Lisa M.", amount: "25 beans", session: "30 min session", time: "1 day ago" },
                  { anchor: "Anna R.", amount: "40 beans", session: "50 min session", time: "1 day ago" },
                  { anchor: "Maria S.", amount: "20 beans", session: "25 min session", time: "2 days ago" }
                ].map((earning, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">Commission from {earning.anchor}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{earning.session} • {earning.time}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600">+{earning.amount}</span>
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