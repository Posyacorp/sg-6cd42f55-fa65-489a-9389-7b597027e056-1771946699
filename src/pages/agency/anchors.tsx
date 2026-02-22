import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  TrendingUp, 
  UserPlus,
  Search,
  Star,
  Video,
  Clock
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/agency/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Anchors", href: "/agency/anchors", icon: <Users className="w-4 h-4" /> },
  { label: "Commission", href: "/agency/commission", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Withdrawals", href: "/agency/withdrawals", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Invite", href: "/agency/invite", icon: <UserPlus className="w-4 h-4" /> }
];

export default function AgencyAnchors() {
  return (
    <>
      <SEO title="Anchors - Pukaarly Agency" />
      <DashboardLayout navItems={navItems} role="agency">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Anchors</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your agency's anchors</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Anchor
            </Button>
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
                  <option>Inactive</option>
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
              { name: "Sarah K.", level: 5, rating: 4.9, sessions: 156, earnings: "4,230 beans", status: "active", online: true },
              { name: "Emma L.", level: 4, rating: 4.8, sessions: 142, earnings: "3,840 beans", status: "active", online: true },
              { name: "Lisa M.", level: 4, rating: 4.7, sessions: 128, earnings: "3,210 beans", status: "active", online: false },
              { name: "Anna R.", level: 3, rating: 4.8, sessions: 115, earnings: "2,950 beans", status: "active", online: true },
              { name: "Jessica P.", level: 2, rating: 4.6, sessions: 45, earnings: "1,120 beans", status: "active", online: false },
              { name: "Maria S.", level: 3, rating: 4.5, sessions: 98, earnings: "2,340 beans", status: "inactive", online: false }
            ].map((anchor, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-xl font-bold">
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
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {anchor.rating}
                          </span>
                          <span>Level {anchor.level}</span>
                          <span className="flex items-center gap-1">
                            <Video className="w-4 h-4" />
                            {anchor.sessions} sessions
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Total Earnings</p>
                            <p className="font-semibold text-green-600">{anchor.earnings}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Your Commission</p>
                            <p className="font-semibold">{Math.floor(parseInt(anchor.earnings.split(" ")[0].replace(",", "")) * 0.1)} beans</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Last Active</p>
                            <p className="font-semibold">{anchor.online ? "Now" : "2 days ago"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
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