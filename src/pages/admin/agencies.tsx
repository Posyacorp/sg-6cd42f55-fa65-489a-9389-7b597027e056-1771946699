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
  Users,
  DollarSign,
  Download,
  TrendingUp
} from "lucide-react";

export default function AdminAgencies() {
  const agencies = [
    { 
      id: "AG001", 
      name: "Agency_1", 
      anchors: 45, 
      commission: "$125,400", 
      status: "active",
      joined: "2025-06-15"
    },
    { 
      id: "AG002", 
      name: "Agency_2", 
      anchors: 32, 
      commission: "$89,200", 
      status: "active",
      joined: "2025-08-20"
    },
    { 
      id: "AG003", 
      name: "Agency_3", 
      anchors: 28, 
      commission: "$67,800", 
      status: "active",
      joined: "2025-11-10"
    },
    { 
      id: "AG004", 
      name: "Agency_4", 
      anchors: 18, 
      commission: "$45,600", 
      status: "pending",
      joined: "2026-01-05"
    }
  ];

  const handleExport = () => {
    exportToCSV(agencies, "platform_agencies");
  };

  return (
    <>
      <SEO title="Agencies - Pukaarly" />
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Agency Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage agency partners</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">47</div>
                <p className="text-xs text-green-600 mt-1">+3 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Anchors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">234</div>
                <p className="text-xs text-gray-500 mt-1">Under management</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$890K</div>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
                <p className="text-xs text-yellow-600 mt-1">Requires approval</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search agencies..." className="pl-10" />
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

          {/* Agencies List */}
          <div className="grid gap-4">
            {agencies.map((agency) => (
              <Card key={agency.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
                        {agency.name.charAt(agency.name.length - 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{agency.name}</h3>
                          <Badge variant={agency.status === "active" ? "default" : "secondary"}>
                            {agency.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{agency.anchors} anchors</span>
                          </div>
                          <span>Joined {agency.joined}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">ID: {agency.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Commission</p>
                      <p className="text-2xl font-bold">{agency.commission}</p>
                      <p className="text-sm text-green-600 flex items-center justify-end gap-1 mt-1">
                        <TrendingUp className="w-4 h-4" />
                        +24% growth
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