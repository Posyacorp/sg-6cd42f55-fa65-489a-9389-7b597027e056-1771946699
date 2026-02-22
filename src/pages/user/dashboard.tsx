import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Gem, TrendingUp, Users, ArrowRight, Video, Gift } from "lucide-react";
import { LineChart } from "@/components/charts/LineChart";
import { AreaChart } from "@/components/charts/AreaChart";
import { PieChart } from "@/components/charts/PieChart";

export default function UserDashboard() {
  // Mock spending data
  const spendingData = [
    { month: "Jan", amount: 120 },
    { month: "Feb", amount: 280 },
    { month: "Mar", amount: 190 },
    { month: "Apr", amount: 340 },
    { month: "May", amount: 450 },
    { month: "Jun", amount: 380 },
  ];

  // Mock token rewards data
  const rewardsData = [
    { month: "Jan", tokens: 4800 },
    { month: "Feb", tokens: 11200 },
    { month: "Mar", tokens: 7600 },
    { month: "Apr", tokens: 13600 },
    { month: "May", tokens: 18000 },
    { month: "Jun", tokens: 15200 },
  ];

  // Mock spending breakdown
  const spendingBreakdown = [
    { name: "Video Calls", value: 650 },
    { name: "Virtual Gifts", value: 380 },
    { name: "Messages", value: 220 },
    { name: "Premium Features", value: 150 },
  ];

  const recentActivity = [
    { type: "call", anchor: "Sarah K.", amount: 50, time: "2 hours ago" },
    { type: "gift", anchor: "Mike R.", amount: 25, time: "5 hours ago" },
    { type: "call", anchor: "Emma L.", amount: 75, time: "1 day ago" },
  ];

  return (
    <>
      <SEO 
        title="User Dashboard - Pukaarly"
        description="Manage your wallet, explore anchors, and track your activity"
      />
      <DashboardLayout role="user">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your account today.
            </p>
          </div>

          {/* Wallet Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coin Balance</CardTitle>
                <Coins className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,450</div>
                <p className="text-xs text-muted-foreground">
                  +180 from last purchase
                </p>
              </CardContent>
            </Card>

            <Card className="border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-transparent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reward Tokens</CardTitle>
                <Gem className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15,280</div>
                <p className="text-xs text-muted-foreground">
                  40 tokens per $1 spent
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,400</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending History</CardTitle>
                <CardDescription>Your monthly spending over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart
                  title="Spending History"
                  data={spendingData}
                  dataKey="amount"
                  color="#8b5cf6"
                  xAxisKey="month"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token Rewards Earned</CardTitle>
                <CardDescription>Tokens accumulated from your spending</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  title="Token Rewards Earned"
                  data={rewardsData}
                  dataKeys={[{ key: "tokens", color: "#ec4899", name: "Tokens" }]}
                  xAxisKey="month"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          {/* Spending Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending Breakdown</CardTitle>
                <CardDescription>Where your coins are going</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  title="Spending Breakdown"
                  data={spendingBreakdown}
                  colors={["#8b5cf6", "#ec4899", "#3b82f6", "#10b981"]}
                  height={300}
                  innerRadius={60}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        {activity.type === "call" ? (
                          <div className="p-2 rounded-full bg-purple-500/10">
                            <Video className="h-4 w-4 text-purple-500" />
                          </div>
                        ) : (
                          <div className="p-2 rounded-full bg-pink-500/10">
                            <Gift className="h-4 w-4 text-pink-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{activity.anchor}</p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-600">-{activity.amount} coins</p>
                        <p className="text-xs text-muted-foreground">+{activity.amount * 40} tokens</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Activity
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Button className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-purple-600 to-pink-600">
                  <Coins className="h-5 w-5" />
                  <span>Buy Coins</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Users className="h-5 w-5" />
                  <span>Explore Anchors</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>View Rewards</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Gift className="h-5 w-5" />
                  <span>Send Gift</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}