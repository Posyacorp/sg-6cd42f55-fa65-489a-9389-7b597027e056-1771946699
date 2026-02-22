import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Compass, 
  MessageSquare, 
  Wallet, 
  User, 
  Users, 
  DollarSign,
  Copy,
  Share2,
  TrendingUp
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

export default function UserReferrals() {
  return (
    <>
      <SEO title="Referrals - Pukaarly User" />
      <DashboardLayout navItems={navItems} role="user">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Referral Program</h1>
            <p className="text-gray-600 dark:text-gray-400">Earn rewards by inviting friends</p>
          </div>

          {/* Referral Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">23</div>
                <p className="text-xs text-gray-500 mt-1">Active users</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$340</div>
                <p className="text-xs text-gray-500 mt-1">From referrals</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$85</div>
                <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
                <p className="text-xs text-gray-500 mt-1">Pending signups</p>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link */}
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    readOnly 
                    value="https://pukaarly.com/ref/JOHNDOE123" 
                    className="font-mono"
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share this link with friends to earn 5% direct referral bonus + 5% from 10 levels deep!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Referral Structure */}
          <Card>
            <CardHeader>
              <CardTitle>Referral Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="font-semibold">Direct Referral (Level 1)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">People you invite directly</p>
                  </div>
                  <Badge className="bg-blue-600">5% Bonus</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div>
                    <p className="font-semibold">Multi-Level (Levels 2-10)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">People invited by your referrals</p>
                  </div>
                  <Badge className="bg-purple-600">5% Split</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Alice Johnson", joined: "2 days ago", earned: "$45", level: 1, status: "active" },
                  { name: "Bob Smith", joined: "1 week ago", earned: "$120", level: 1, status: "active" },
                  { name: "Carol White", joined: "2 weeks ago", earned: "$85", level: 1, status: "active" },
                  { name: "David Brown", joined: "3 weeks ago", earned: "$90", level: 1, status: "active" }
                ].map((ref, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold">
                        {ref.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{ref.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Joined {ref.joined}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{ref.earned}</p>
                        <p className="text-xs text-gray-500">Level {ref.level}</p>
                      </div>
                      <Badge variant={ref.status === "active" ? "default" : "secondary"}>
                        {ref.status}
                      </Badge>
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