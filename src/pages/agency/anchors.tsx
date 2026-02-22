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
  TrendingUp,
  Download
} from "lucide-react";

export default function AgencyAnchors() {
  const anchors = [
    { 
      name: "Anchor_A", 
      level: 5, 
      rating: 4.8, 
      earnings: "$12,450", 
      commission: "$1,245",
      calls: 234,
      status: "active" 
    },
    { 
      name: "Anchor_B", 
      level: 4, 
      rating: 4.6, 
      earnings: "$9,800", 
      commission: "$980",
      calls: 189,
      status: "active" 
    },
    { 
      name: "Anchor_C", 
      level: 3, 
      rating: 4.5, 
      earnings: "$7,650", 
      commission: "$765",
      calls: 156,
      status: "active" 
    },
    { 
      name: "Anchor_D", 
      level: 4, 
      rating: 4.7, 
      earnings: "$6,200", 
      commission: "$620",
      calls: 142,
      status: "inactive" 
    }
  ];

  const handleExport = () => {
    exportToCSV(anchors, "agency_anchors");
  };

  return (
    <>
      <SEO title="Anchors - Pukaarly" />
      <DashboardLayout role="agency">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Manage Anchors</h1>
            <p className="text-gray-600 dark:text-gray-400">View and manage your agency anchors</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Anchors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">18</div>
                <p className="text-xs text-gray-500 mt-1">4 active now</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$36,100</div>
                <p className="text-xs text-green-600 mt-1">+18% growth</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$3,610</div>
                <p className="text-xs text-gray-500 mt-1">10% average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.7</div>
                <p className="text-xs text-gray-500 mt-1">Out of 5.0</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search anchors..." 
                    className="pl-10"
                  />
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
            {anchors.map((anchor, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                        {anchor.name.charAt(anchor.name.length - 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold">{anchor.name}</h3>
                          <Badge variant={anchor.status === "active" ? "default" : "secondary"}>
                            {anchor.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{anchor.rating}</span>
                          </div>
                          <span>Level {anchor.level}</span>
                          <span>{anchor.calls} calls</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                      <p className="text-2xl font-bold">{anchor.earnings}</p>
                      <p className="text-sm text-green-600 flex items-center justify-end gap-1 mt-1">
                        <TrendingUp className="w-4 h-4" />
                        Your commission: {anchor.commission}
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