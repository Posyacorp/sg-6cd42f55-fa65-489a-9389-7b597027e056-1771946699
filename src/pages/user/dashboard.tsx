import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Compass, 
  MessageSquare, 
  Wallet, 
  User, 
  Users, 
  DollarSign,
  Coins,
  TrendingUp,
  Gift
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/user/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Explore", href: "/user/explore", icon: <Compass className="w-4 h-4" /> },
  { label: "Messages", href: "/user/messages", icon: <MessageSquare className="w-4 h-4" /> },
  { label: "Wallet", href: "/user/wallet", icon: <Wallet className="w-4 h-4" /> },
  { label: "Profile", href: "/user/profile", icon: <User className="w-4 h-4" /> },
  { label: "Referrals", href: "/user/referrals", icon: <Users className="w-4 h-4" /> },
  { label: "Withdraw", href: "/user/withdraw", icon: <DollarSign className="w-4 h-4" /> }
];

export default function UserDashboard() {
  return (
    <>
      <SEO title="Dashboard - Pukaarly User" />
      <DashboardLayout navItems={navItems} role="user">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-gray-600 dark:text-gray-400">Here's your activity overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reward Tokens</CardTitle>
                <Coins className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,450</div>
                <p className="text-xs text-gray-500 mt-1">+20% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Coin Balance</CardTitle>
                <Wallet className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$350.00</div>
                <p className="text-xs text-gray-500 mt-1">Available to spend</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                <Users className="w-4 h-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-gray-500 mt-1">Active referrals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,240</div>
                <p className="text-xs text-gray-500 mt-1">All-time rewards</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Gift Sent", amount: "-50 coins", time: "2 hours ago", icon: <Gift className="w-4 h-4" /> },
                    { type: "Reward Earned", amount: "+40 tokens", time: "5 hours ago", icon: <Coins className="w-4 h-4" /> },
                    { type: "Referral Bonus", amount: "+25 tokens", time: "1 day ago", icon: <Users className="w-4 h-4" /> },
                    { type: "Gift Sent", amount: "-100 coins", time: "2 days ago", icon: <Gift className="w-4 h-4" /> }
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                          {tx.icon}
                        </div>
                        <div>
                          <p className="font-medium">{tx.type}</p>
                          <p className="text-xs text-gray-500">{tx.time}</p>
                        </div>
                      </div>
                      <span className={`font-semibold ${tx.amount.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Anchors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sarah Smith", status: "Online", rating: 4.8 },
                    { name: "Mike Johnson", status: "Online", rating: 4.9 },
                    { name: "Emily Chen", status: "Busy", rating: 4.7 },
                    { name: "David Brown", status: "Online", rating: 4.8 }
                  ].map((anchor, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                          {anchor.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{anchor.name}</p>
                          <p className="text-xs text-gray-500">{anchor.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">⭐ {anchor.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}