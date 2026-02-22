import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { streamService } from "@/services/streamService";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Users, Play, Radio } from "lucide-react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

export default function ExplorePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [streams, setStreams] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadStreams();
    // Set up polling for live updates
    const interval = setInterval(loadStreams, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStreams = async () => {
    try {
      const { data } = await streamService.getActiveStreams();
      if (data) {
        setStreams(data);
      }
    } catch (error) {
      console.error("Error loading streams:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinStream = (streamId: string) => {
    router.push(`/stream/${streamId}`);
  };

  const filteredStreams = streams.filter((stream) =>
    stream.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stream.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Explore Live Streams</h1>
            <p className="text-muted-foreground">Watch your favorite anchors live</p>
          </div>
          <Badge variant="outline" className="gap-2">
            <Radio className="h-4 w-4 text-red-500 animate-pulse" />
            {streams.length} Live
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search streams or anchors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stream Grid */}
        {filteredStreams.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Radio className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No live streams right now</p>
              <p className="text-sm text-muted-foreground">Check back later!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStreams.map((stream) => (
              <Card
                key={stream.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => joinStream(stream.id)}
              >
                <div className="relative aspect-video bg-muted">
                  {stream.thumbnail_url ? (
                    <img
                      src={stream.thumbnail_url}
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 bg-red-500 gap-1">
                    <Radio className="h-3 w-3 animate-pulse" />
                    LIVE
                  </Badge>
                  <Badge variant="secondary" className="absolute bottom-2 right-2 gap-1">
                    <Users className="h-3 w-3" />
                    {stream.viewer_count || 0}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={stream.user?.avatar_url || ""} />
                      <AvatarFallback>
                        {stream.user?.full_name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{stream.title || "Untitled Stream"}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {stream.user?.full_name || "Unknown"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}