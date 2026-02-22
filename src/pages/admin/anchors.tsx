import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { exportToCSV } from "@/lib/export";
import { 
  Search,
  Filter,
  Star,
  Download,
  TrendingUp
} from "lucide-react";

export default function AdminAnchors() {
  const anchors = [
    { 
      id: "A001", 
      name: "Anchor_A", 
      level: 5, 
      rating: 4.8, 
      earnings: "$45,230", 
      calls: 892,
      status: "verified",
      agency: "Agency_1"
    },
    { 
      id: "A002", 
      name: "Anchor_B", 
      level: 4, 
      rating: 4.6, 
      earnings: "$32,450", 
      calls: 645,
      status: "verified",
      agency: "Agency_1"
    },
    { 
      id: "A003", 
      name: "Anchor_C", 
      level: 3, 
      rating: 4.5, 
      earnings: "$28,900", 
      calls: 534,
      status: "pending",
      agency: "Agency_2"
    },
    { 
      id: "A004", 
      name: "Anchor_D", 
      level: 4, 
      rating: 4.7, 
      earnings: "$38,120", 
      calls: 723,
      status: "verified",
      agency: "Independent"
    }
  ];

  const handleExport = () => {
    exportToCSV(anchors, "platform_anchors");
  };

  return (
    <>
      <SEO title="Anchors - Pukaarly" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Anchor Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and verify anchors</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Anchors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">342</div>
                <p className="text-xs text-green-600 mt-1">+18 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">298</div>
                <p className="text-xs text-gray-500 mt-1">87% verified</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">23</div>
                <p className="text-xs text-yellow-600 mt-1">Requires action</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.6</div>
                <p className="text-xs text-gray-500 mt-1">Out of 5.0</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search anchors..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button onClick={handleExport} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Anchors List */}
          <div className="grid gap-4">
            {anchors.map((anchor) => (
              <Card key={anchor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                        {anchor.name.charAt(anchor.name.length - 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{anchor.name}</h3>
                          <Badge variant={anchor.status === "verified" ? "default" : "secondary"}>
                            {anchor.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{anchor.rating}</span>
                          </div>
                          <span>Level {anchor.level}</span>
                          <span>{anchor.calls} calls</span>
                          <span>Agency: {anchor.agency}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">ID: {anchor.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                      <p className="text-2xl font-bold">{anchor.earnings}</p>
                      <p className="text-sm text-green-600 flex items-center justify-end gap-1 mt-1">
                        <TrendingUp className="w-4 h-4" />
                        +15% growth
                      </p>
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