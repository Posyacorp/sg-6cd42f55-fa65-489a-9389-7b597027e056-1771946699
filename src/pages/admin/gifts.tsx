import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Building2, 
  DollarSign, 
  Gift, 
  TrendingDown, 
  Vault, 
  Settings,
  Plus,
  Edit,
  Trash2
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

export default function AdminGifts() {
  return (
    <>
      <SEO title="Gift Management - Pukaarly Admin" />
      <DashboardLayout navItems={navItems} role="admin">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gift Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage virtual gifts and pricing</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Add New Gift
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Gifts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-gray-500 mt-1">Available gifts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gifts Sent Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-green-600 mt-1">+15% vs yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue from Gifts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$8,450</div>
                <p className="text-xs text-green-600 mt-1">Today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">❤️</div>
                <p className="text-xs text-gray-500 mt-1">Heart (345 sent)</p>
              </CardContent>
            </Card>
          </div>

          {/* Gift Categories */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Gifts (1-50 coins)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { emoji: "❤️", name: "Heart", price: 10 },
                    { emoji: "🌹", name: "Rose", price: 20 },
                    { emoji: "💐", name: "Bouquet", price: 30 },
                    { emoji: "🎁", name: "Gift Box", price: 50 }
                  ].map((gift, i) => (
                    <div key={i} className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg text-center">
                      <div className="text-3xl mb-1">{gift.emoji}</div>
                      <p className="text-sm font-medium">{gift.name}</p>
                      <p className="text-xs text-gray-500">{gift.price} coins</p>
                      <div className="flex gap-1 mt-2">
                        <Button variant="ghost" size="sm" className="h-7 flex-1">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 flex-1 text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Premium Gifts (51-200 coins)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { emoji: "💎", name: "Diamond", price: 100 },
                    { emoji: "👑", name: "Crown", price: 150 },
                    { emoji: "🏆", name: "Trophy", price: 180 },
                    { emoji: "🎪", name: "Carnival", price: 200 }
                  ].map((gift, i) => (
                    <div key={i} className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg text-center">
                      <div className="text-3xl mb-1">{gift.emoji}</div>
                      <p className="text-sm font-medium">{gift.name}</p>
                      <p className="text-xs text-gray-500">{gift.price} coins</p>
                      <div className="flex gap-1 mt-2">
                        <Button variant="ghost" size="sm" className="h-7 flex-1">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 flex-1 text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Luxury Gifts (201+ coins)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { emoji: "🚗", name: "Sports Car", price: 500 },
                    { emoji: "🏰", name: "Castle", price: 800 },
                    { emoji: "✈️", name: "Private Jet", price: 1000 },
                    { emoji: "🏝️", name: "Island", price: 2000 }
                  ].map((gift, i) => (
                    <div key={i} className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg text-center">
                      <div className="text-3xl mb-1">{gift.emoji}</div>
                      <p className="text-sm font-medium">{gift.name}</p>
                      <p className="text-xs text-gray-500">{gift.price} coins</p>
                      <div className="flex gap-1 mt-2">
                        <Button variant="ghost" size="sm" className="h-7 flex-1">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 flex-1 text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Gift Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Gift Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { from: "John D.", to: "Sarah K.", gift: "💎 Diamond", coins: 100, time: "2 min ago" },
                  { from: "Mike R.", to: "Emma L.", gift: "🌹 Rose", coins: 20, time: "5 min ago" },
                  { from: "Alex P.", to: "Lisa M.", gift: "👑 Crown", coins: 150, time: "10 min ago" },
                  { from: "Tom S.", to: "Anna R.", gift: "❤️ Heart", coins: 10, time: "15 min ago" },
                  { from: "Chris M.", to: "Sarah K.", gift: "🏆 Trophy", coins: 180, time: "20 min ago" }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{activity.gift.split(" ")[0]}</div>
                      <div>
                        <p className="font-medium">{activity.from} → {activity.to}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.gift}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{activity.coins} coins</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
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