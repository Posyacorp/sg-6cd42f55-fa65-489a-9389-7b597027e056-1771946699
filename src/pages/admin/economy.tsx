import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  RefreshCcw,
  Coins,
  Activity
} from "lucide-react";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { InteractiveAreaChart } from "@/components/charts/InteractiveAreaChart";

export default function AdminEconomy() {
  const economicMetrics = [
    { name: "Week 1", tokenPrice: 0.98, volume: 35000, marketCap: 11180000 },
    { name: "Week 2", tokenPrice: 1.02, volume: 38500, marketCap: 11628000 },
    { name: "Week 3", tokenPrice: 1.01, volume: 41200, marketCap: 11514000 },
    { name: "Week 4", tokenPrice: 1.05, volume: 43800, marketCap: 11970000 },
    { name: "Week 5", tokenPrice: 1.08, volume: 46100, marketCap: 12312000 },
    { name: "Week 6", tokenPrice: 1.12, volume: 48900, marketCap: 12768000 },
    { name: "Week 7", tokenPrice: 1.10, volume: 45200, marketCap: 12540000 },
  ];

  const tokenCirculation = [
    { name: "Jan", circulation: 8500000 },
    { name: "Feb", circulation: 9200000 },
    { name: "Mar", circulation: 9800000 },
    { name: "Apr", circulation: 10400000 },
    { name: "May", circulation: 10900000 },
    { name: "Jun", circulation: 11400000 },
  ];

  const comparisonMetrics = [
    { key: "tokenPrice", label: "Token Price ($)", color: "#16a34a" },
    { key: "volume", label: "Daily Volume ($)", color: "#2563eb" },
    { key: "marketCap", label: "Market Cap ($M)", color: "#9333ea" },
  ];

  return (
    <>
      <SEO title="Economy - Pukaarly Admin" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Economy & Tokens</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage platform currency and rewards</p>
            </div>
            <Button>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Adjust Rates
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Token Price</CardTitle>
                <DollarSign className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1.10</div>
                <p className="text-xs text-green-600 mt-1">+2.4% today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Daily Volume</CardTitle>
                <Activity className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,230</div>
                <p className="text-xs text-gray-500 mt-1">24h volume</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
                <Coins className="w-4 h-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">11.4M</div>
                <p className="text-xs text-gray-500 mt-1">Tokens in circulation</p>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Chart - Multiple Metrics */}
          <ComparisonChart
            title="Economic Metrics Comparison"
            data={economicMetrics}
            metrics={comparisonMetrics}
            periodOptions={[
              { value: "7", label: "Last 7 Days" },
              { value: "30", label: "Last 30 Days" },
              { value: "90", label: "Last 90 Days" }
            ]}
          />

          {/* Interactive Area Chart with Range Selector */}
          <InteractiveAreaChart
            title="Token Circulation Over Time"
            data={tokenCirculation}
            dataKey="circulation"
            color="#8b5cf6"
            gradientId="colorCirculation"
          />

          <div className="grid gap-6 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Minting Rules</CardTitle>
                <CardDescription>Current reward distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="flex flex-col p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Anchor Share</span>
                    <span className="text-2xl font-bold text-purple-600 mt-2">50%</span>
                    <span className="text-xs text-gray-500 mt-1">20 tokens per $1</span>
                  </div>
                  <div className="flex flex-col p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">User Rewards</span>
                    <span className="text-2xl font-bold text-blue-600 mt-2">20%</span>
                    <span className="text-xs text-gray-500 mt-1">8 tokens per $1</span>
                  </div>
                  <div className="flex flex-col p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg border border-pink-200 dark:border-pink-800">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Agency Commission</span>
                    <span className="text-2xl font-bold text-pink-600 mt-2">10%</span>
                    <span className="text-xs text-gray-500 mt-1">4 tokens per $1</span>
                  </div>
                  <div className="flex flex-col p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Referral Pool</span>
                    <span className="text-2xl font-bold text-orange-600 mt-2">10%</span>
                    <span className="text-xs text-gray-500 mt-1">4 tokens per $1</span>
                  </div>
                  <div className="flex flex-col p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Admin Fee</span>
                    <span className="text-2xl font-bold text-green-600 mt-2">10%</span>
                    <span className="text-xs text-gray-500 mt-1">4 tokens per $1</span>
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