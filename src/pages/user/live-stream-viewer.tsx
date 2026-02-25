import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Heart, 
  Send, 
  Gift as GiftIcon,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Share2,
  Flag,
  Crown,
  Zap,
  Loader2
} from "lucide-react";
import { streamService } from "@/services/streamService";
import { giftService } from "@/services/giftService";
import { pkService } from "@/services/pkService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function LiveStreamViewer() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { toast } = useToast();
  const [stream, setStream] = useState<any>(null);
  const [pkBattle, setPkBattle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [gifts, setGifts] = useState<any[]>([]);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const videoRef = useRef<HTMLVideoElement>(null);
  const channelRef = useRef<any>(null);
  const pkChannelRef = useRef<any>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      loadStream(id);
      loadGifts();
      
      // Join stream as viewer
      if (user) {
        streamService.joinStream(id, user.id);
      }

      // Subscribe to real-time updates
      channelRef.current = streamService.subscribeToStream(id, {
        onViewerCountChange: (count) => {
          setStream((prev: any) => prev ? { ...prev, viewer_count: count } : null);
        },
        onGiftReceived: (gift) => {
          toast({
            title: "🎁 Gift Received!",
            description: `Someone sent ${gift.name}!`,
          });
        },
        onStreamEnd: () => {
          toast({
            title: "Stream Ended",
            description: "The host has ended the stream",
          });
          setTimeout(() => router.push("/user/explore"), 2000);
        },
      });

      return () => {
        if (user && typeof id === "string") {
          streamService.leaveStream(id, user.id);
        }
        if (channelRef.current) {
          streamService.unsubscribeFromStream(channelRef.current);
        }
        if (pkChannelRef.current) {
          pkService.unsubscribeFromPKBattle(pkChannelRef.current);
        }
      };
    }
  }, [id, user]);

  const loadStream = async (streamId: string) => {
    try {
      setLoading(true);
      const { data } = await streamService.getStreamById(streamId);
      if (data) {
        setStream(data);
        
        // Check if stream is part of a PK battle
        if (data.stream_type === "pk_battle") {
          // Load PK battle details
          // Note: Would need to query pk_battles table by stream_id
        }
      }
    } catch (error) {
      console.error("Error loading stream:", error);
      toast({
        title: "Error",
        description: "Failed to load stream",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadGifts = async () => {
    try {
      const { data } = await giftService.getAllGifts();
      if (data) {
        setGifts(data);
      }
    } catch (error) {
      console.error("Error loading gifts:", error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    const newMessage = {
      id: Date.now().toString(),
      user_id: user.id,
      user_name: user.user_metadata?.full_name || "Anonymous",
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // In production, send message via Supabase Realtime
  };

  const handleSendGift = async (giftId: string) => {
    if (!user || !stream) return;

    try {
      await giftService.sendGift(
        user.id,
        stream.user_id,
        giftId,
        1,
        id as string
      );
      
      setShowGiftPanel(false);
      toast({
        title: "Gift Sent! 🎁",
        description: "Your gift has been delivered",
      });
    } catch (error: any) {
      console.error("Error sending gift:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send gift",
        variant: "destructive",
      });
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleFollow = () => {
    toast({
      title: "Following!",
      description: `You're now following ${stream?.anchor?.full_name}`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Stream link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!stream) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Stream Not Found</h2>
            <p className="text-muted-foreground mb-4">This stream may have ended or does not exist.</p>
            <Button onClick={() => router.push("/user/explore")}>
              Back to Explore
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="grid lg:grid-cols-4 gap-4 h-[calc(100vh-8rem)]">
        {/* Main Video Player */}
        <div className="lg:col-span-3 space-y-4">
          {/* Video Container */}
          <Card className="overflow-hidden">
            <div className="relative bg-black aspect-video">
              <video
                ref={videoRef}
                src={stream.stream_url}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />

              {/* Live Badge & Viewer Count */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="bg-red-500 gap-1 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </Badge>
                  <Badge variant="secondary" className="gap-1 bg-black/50 backdrop-blur">
                    <Users className="w-3 h-3" />
                    {stream.viewer_count?.toLocaleString() || 0}
                  </Badge>
                </div>

                {/* Video Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 backdrop-blur"
                    onClick={toggleMute}
                  >
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 backdrop-blur"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 backdrop-blur"
                    onClick={toggleFullscreen}
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* PK Battle Scores (if applicable) */}
              {pkBattle && (
                <div className="absolute bottom-4 left-0 right-0 px-4">
                  <Card className="bg-black/50 backdrop-blur border-white/20">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={pkBattle.inviter?.avatar_url} />
                          <AvatarFallback>{pkBattle.inviter?.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium text-sm">{pkBattle.inviter?.full_name}</p>
                          <p className="text-white/70 text-xs">{pkBattle.inviter_score} points</p>
                        </div>
                      </div>

                      <Zap className="w-6 h-6 text-yellow-500" />

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-white font-medium text-sm">{pkBattle.invitee?.full_name}</p>
                          <p className="text-white/70 text-xs">{pkBattle.invitee_score} points</p>
                        </div>
                        <Avatar>
                          <AvatarImage src={pkBattle.invitee?.avatar_url} />
                          <AvatarFallback>{pkBattle.invitee?.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </Card>

          {/* Stream Info */}
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={stream.anchor?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">
                    {stream.anchor?.full_name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{stream.title}</h2>
                  <p className="text-sm text-muted-foreground">{stream.anchor?.full_name}</p>
                  {stream.description && (
                    <p className="text-sm text-muted-foreground mt-1">{stream.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="default" size="sm" onClick={handleFollow}>
                  <Heart className="w-4 h-4 mr-2" />
                  Follow
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Tabs: Chat & Viewers */}
          <Card className="flex flex-col h-[60vh]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="w-full border-b rounded-none">
                <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                <TabsTrigger value="viewers" className="flex-1">Viewers</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Be the first to chat!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="text-sm">
                        <span className="font-semibold text-purple-600">{msg.user_name}: </span>
                        <span className="text-foreground">{msg.message}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Send a message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="viewers" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>U{i + 1}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Viewer {i + 1}</span>
                      {i === 0 && <Crown className="w-4 h-4 text-yellow-500 ml-auto" />}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Send Gift Panel */}
          <Card className="p-4">
            <Button
              className="w-full"
              variant="default"
              onClick={() => setShowGiftPanel(!showGiftPanel)}
            >
              <GiftIcon className="w-4 h-4 mr-2" />
              Send Gift
            </Button>

            {showGiftPanel && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {gifts.slice(0, 9).map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => handleSendGift(gift.id)}
                    className="p-3 border rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">{gift.name}</div>
                    <div className="text-xs font-medium text-muted-foreground">
                      {gift.coin_price} coins
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}