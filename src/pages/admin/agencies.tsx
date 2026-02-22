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
  Search
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

export default function AdminAgencies() {
  return (
    <>
      <SEO title="Agency Management - Pukaarly Admin" />
      <DashboardLayout navItems={navItems} role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Agency Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage platform agencies</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-green-600 mt-1">+3 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Agencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-gray-500 mt-1">82% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Anchors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">647</div>
                <p className="text-xs text-gray-500 mt-1">Under agencies</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$42,340</div>
                <p className="text-xs text-green-600 mt-1">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search agencies..." className="pl-10" />
                </div>
                <select className="h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Agencies List */}
          <div className="grid gap-6">
            {[
              { name: "Elite Stars Agency", anchors: 45, commission: "12,340", earnings: "123,400", status: "active", joined: "Dec 2025" },
              { name: "Star Agency", anchors: 38, commission: "9,850", earnings: "98,500", status: "active", joined: "Nov 2025" },
              { name: "Premium Talent", anchors: 29, commission: "7,230", earnings: "72,300", status: "active", joined: "Oct 2025" },
              { name: "Rising Stars", anchors: 15, commission: "3,450", earnings: "34,500", status: "active", joined: "Jan 2026" },
              { name: "New Vision Agency", anchors: 8, commission: "1,240", earnings: "12,400", status: "pending", joined: "Feb 2026" }
            ].map((agency, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-xl font-bold">
                        {agency.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{agency.name}</h3>
                          <Badge variant={agency.status === "active" ? "default" : "secondary"}>
                            {agency.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Joined {agency.joined} • {agency.anchors} Anchors
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Total Earnings</p>
                            <p className="font-semibold">${agency.earnings}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Commission (10%)</p>
                            <p className="font-semibold text-green-600">${agency.commission}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Active Anchors</p>
                            <p className="font-semibold">{agency.anchors}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      {agency.status === "pending" && (
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