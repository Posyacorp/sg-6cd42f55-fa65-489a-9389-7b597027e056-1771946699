import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Search,
  Star,
  Video
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

export default function AdminAnchors() {
  return (
    <>
      <SEO title="Anchor Management - Pukaarly Admin" />
      <DashboardLayout navItems={navItems} role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Anchor Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage platform anchors (hosts)</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Anchors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">847</div>
                <p className="text-xs text-green-600 mt-1">+45 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Online Now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">234</div>
                <p className="text-xs text-gray-500 mt-1">28% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7</div>
                <p className="text-xs text-gray-500 mt-1">Out of 5.0</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-orange-600 mt-1">Awaiting approval</p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search anchors..." className="pl-10" />
                </div>
                <select className="h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
                <select className="h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <option>All Levels</option>
                  <option>Level 1-2</option>
                  <option>Level 3-4</option>
                  <option>Level 5+</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Anchors List */}
          <div className="grid gap-6">
            {[
              { name: "Sarah K.", level: 5, rating: 4.9, sessions: 1456, earnings: "42,340", status: "active", online: true, agency: "Elite Stars" },
              { name: "Emma L.", level: 4, rating: 4.8, sessions: 1242, earnings: "38,450", status: "active", online: true, agency: "Star Agency" },
              { name: "Lisa M.", level: 4, rating: 4.7, sessions: 1128, earnings: "32,180", status: "active", online: false, agency: "None" },
              { name: "Anna R.", level: 3, rating: 4.8, sessions: 945, earnings: "29,560", status: "active", online: true, agency: "Elite Stars" },
              { name: "Jessica P.", level: 2, rating: 4.6, sessions: 345, earnings: "11,290", status: "pending", online: false, agency: "None" }
            ].map((anchor, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
                          {anchor.name.charAt(0)}
                        </div>
                        {anchor.online && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{anchor.name}</h3>
                          <Badge variant={anchor.status === "active" ? "default" : "secondary"}>
                            {anchor.status}
                          </Badge>
                          {anchor.online && <Badge className="bg-green-600">Online</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {anchor.rating}
                          </span>
                          <span>Level {anchor.level}</span>
                          <span className="flex items-center gap-1">
                            <Video className="w-4 h-4" />
                            {anchor.sessions.toLocaleString()} sessions
                          </span>
                          <span>Agency: {anchor.agency}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Total Earnings</p>
                            <p className="font-semibold text-green-600">{anchor.earnings} beans</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Platform Fee</p>
                            <p className="font-semibold">{(parseInt(anchor.earnings.replace(",", "")) * 0.3).toLocaleString()} beans</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="font-semibold">{anchor.online ? "Live Now" : "Offline"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      {anchor.status === "pending" && (
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600">Approve</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}