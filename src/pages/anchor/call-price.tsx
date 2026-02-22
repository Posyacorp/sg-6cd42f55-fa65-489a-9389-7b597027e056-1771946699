import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LayoutDashboard, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Save,
  Info
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/anchor/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Income", href: "/anchor/income", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Call Price", href: "/anchor/call-price", icon: <Settings className="w-4 h-4" /> },
  { label: "Level", href: "/anchor/level", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Withdraw", href: "/anchor/withdraw", icon: <DollarSign className="w-4 h-4" /> }
];

export default function AnchorCallPrice() {
  return (
    <>
      <SEO title="Call Price Settings - Pukaarly Anchor" />
      <DashboardLayout navItems={navItems} role="anchor">
        <div className="space-y-6 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold">Call Price Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure your session pricing</p>
          </div>

          {/* Current Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Current Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white text-center">
                <div className="text-5xl font-bold mb-2">50</div>
                <p className="text-lg">Coins per Minute</p>
              </div>
            </CardContent>
          </Card>

          {/* Price Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Update Your Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="rate">Price per Minute (Coins)</Label>
                  <Input 
                    id="rate" 
                    type="number" 
                    defaultValue="50"
                    min="10"
                    max="200"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Recommended range: 30-100 coins per minute
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm text-blue-900 dark:text-blue-100">
                      <p><strong>Pricing Guidelines:</strong></p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>New anchors (Level 1-2): 30-40 coins/min</li>
                        <li>Established anchors (Level 3-4): 40-60 coins/min</li>
                        <li>Top anchors (Level 5+): 60-100+ coins/min</li>
                        <li>Your level and rating affect visibility</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Earnings Calculator */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">15 min session</p>
                  <p className="text-2xl font-bold">750 coins</p>
                  <p className="text-xs text-gray-500 mt-1">≈ $18.75 equivalent</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">30 min session</p>
                  <p className="text-2xl font-bold">1,500 coins</p>
                  <p className="text-xs text-gray-500 mt-1">≈ $37.50 equivalent</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">60 min session</p>
                  <p className="text-2xl font-bold">3,000 coins</p>
                  <p className="text-xs text-gray-500 mt-1">≈ $75.00 equivalent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}