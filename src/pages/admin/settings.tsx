import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Building2, 
  DollarSign, 
  Gift, 
  TrendingDown, 
  Vault, 
  Settings
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="w-4 h-4" /> },
  { label: "Anchors", href: "/admin/anchors", icon: <UserCheck className="w-4 h-4" /> },
  { label: "Agencies", href: "/admin/agencies", icon: <Building2 className="w-4 h-4" /> },
  { label: "Economy", href: "/admin/economy", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Gifts", href: "/admin/gifts", icon: <Gift className="w-4 h-4" /> },
  { label: "Withdrawals", href: "/admin/withdrawals", icon: <TrendingDown className="w-4 h-4" /> },
  { label: "Treasury", href: "/admin/treasury", icon: <Vault className="w-4 h-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> }
];

export default function AdminSettings() {
  return (
    <>
      <SEO title="Platform Settings - Pukaarly Admin" />
      <DashboardLayout navItems={navItems} role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Platform Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure platform-wide settings</p>
          </div>

          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Platform Name</label>
                  <Input defaultValue="Pukaarly" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Support Email</label>
                  <Input defaultValue="support@pukaarly.com" type="email" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Platform Fee (%)</label>
                  <Input defaultValue="30" type="number" />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Temporarily disable platform access</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    <p className="font-medium">New Registrations</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Allow new user sign-ups</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Token & Reward Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tokens per $1 Spent</label>
                  <Input defaultValue="40" type="number" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Admin Token Share (%)</label>
                    <Input defaultValue="10" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Anchor Token Share (%)</label>
                    <Input defaultValue="50" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">User Token Share (%)</label>
                    <Input defaultValue="20" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Agency Token Share (%)</label>
                    <Input defaultValue="10" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Referral Pool (%)</label>
                    <Input defaultValue="10" type="number" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Min User Withdrawal ($)</label>
                    <Input defaultValue="10" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max User Withdrawal ($)</label>
                    <Input defaultValue="1000" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Min Anchor Withdrawal ($)</label>
                    <Input defaultValue="50" type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Anchor Withdrawal ($)</label>
                    <Input defaultValue="5000" type="number" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Withdrawal Processing Fee (%)</label>
                  <Input defaultValue="2" type="number" />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    <p className="font-medium">Auto-Approve Small Withdrawals</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatically approve withdrawals under $50</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Referral Program Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Direct Referral Bonus (%)</label>
                  <Input defaultValue="5" type="number" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Multi-Level Referral (%)</label>
                  <Input defaultValue="5" type="number" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Max Referral Levels</label>
                  <Input defaultValue="10" type="number" />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    <p className="font-medium">Enable Referral Program</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Allow users to earn from referrals</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600">
              Save All Settings
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}