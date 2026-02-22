import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Compass, 
  MessageSquare, 
  Wallet, 
  User, 
  Users, 
  DollarSign,
  Search,
  Star,
  Video
} from "lucide-react";

const anchors = [
  { name: "Sarah Smith", level: 5, rate: 50, status: "online", rating: 4.8, sessions: 234 },
  { name: "Mike Johnson", level: 4, rate: 40, status: "online", rating: 4.9, sessions: 189 },
  { name: "Emily Chen", level: 6, rate: 60, status: "busy", rating: 4.7, sessions: 312 },
  { name: "David Brown", level: 3, rate: 30, status: "online", rating: 4.8, sessions: 156 },
  { name: "Lisa Anderson", level: 5, rate: 45, status: "offline", rating: 4.6, sessions: 201 },
  { name: "James Wilson", level: 4, rate: 35, status: "online", rating: 4.7, sessions: 178 }
];

export default function UserExplore() {
  return (
    <>
      <SEO title="Explore - Pukaarly" />
      <DashboardLayout role="user">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Explore Anchors</h1>
            <p className="text-gray-600 dark:text-gray-400">Discover and connect with talented hosts</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search anchors..." 
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">All</Button>
              <Button variant="outline">Online</Button>
              <Button variant="outline">Top Rated</Button>
            </div>
          </div>

          {/* Anchors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {anchors.map((anchor, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-all">
                <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-purple-600">
                    {anchor.name.charAt(0)}
                  </div>
                  <Badge className={`absolute top-3 right-3 ${
                    anchor.status === "online" ? "bg-green-500" : 
                    anchor.status === "busy" ? "bg-yellow-500" : "bg-gray-500"
                  }`}>
                    {anchor.status}
                  </Badge>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg mb-1">{anchor.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">Level {anchor.level}</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{anchor.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Rate</span>
                      <span className="font-semibold">{anchor.rate} coins/min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Sessions</span>
                      <span className="font-semibold">{anchor.sessions}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                      disabled={anchor.status !== "online"}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
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