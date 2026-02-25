import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Heart, 
  Send, 
  Gift as GiftIcon,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  MoreVertical,
  Loader2
} from "lucide-react";
import { streamService } from "@/services/streamService";
import { giftService } from "@/services/giftService";
import { useAuth } from "@/hooks/useAuth";

export default function StreamPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [stream, setStream] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [gifts, setGifts] = useState<any[]>([]);
  const [showGifts, setShowGifts] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const channelRef = useRef<any>(null);

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
          // Add gift animation here
          console.log("Gift received:", gift);
        },
        onStreamEnd: () => {
          router.push("/user/explore");
        },
      });

      return () => {
        // Leave stream on unmount
        if (user && typeof id === "string") {
          streamService.leaveStream(id, user.id);
        }
        if (channelRef.current) {
          streamService.unsubscribeFromStream(channelRef.current);
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
      }
    } catch (error) {
      console.error("Error loading stream:", error);
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
    if (!message.trim()) return;

    // Add message to chat
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: user?.user_metadata?.full_name || "Anonymous",
        message: message.trim(),
        timestamp: new Date(),
      },
    ]);

    setMessage("");
  };

  const handleSendGift = async (giftId: string) => {
    if (!user || !id) return;

    try {
      // Note: In DB stream.user_id is the anchor
      await giftService.sendGift(
        user.id,
        stream.user_id, // Receiver ID
        giftId,
        1, // Quantity
        id as string // Stream ID
      );
      setShowGifts(false);
    } catch (error) {
      console.error("Error sending gift:", error);
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
            <p className="text-gray-500 mb-4">This stream may have ended or does not exist.</p>
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
      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
        {/* Video Player */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="overflow-hidden">
            <div className="relative bg-black aspect-video">
              <video
                ref={videoRef}
                src={stream.stream_url}
                className="w-full h-full"
                autoPlay
                playsInline
              />

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="destructive" className="bg-red-500">
                      LIVE
                    </Badge>
                    <div className="flex items-center gap-1 text-white">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{stream.viewer_count.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="w-5 h-5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stream Info */}
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">{stream.title}</h1>
                {stream.description && (
                  <p className="text-gray-600 dark:text-gray-400">{stream.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                    <div>
                      <p className="font-medium">{stream.anchor?.full_name}</p>
                      <p className="text-sm text-gray-500">Host</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Follow
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Chat & Gifts Sidebar */}
        <div className="space-y-4">
          {/* Live Chat */}
          <Card className="flex flex-col h-[60vh]">
            <div className="border-b p-4">
              <h3 className="font-semibold">Live Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <span className="font-semibold text-purple-600">{msg.user}: </span>
                  <span className="text-gray-700 dark:text-gray-300">{msg.message}</span>
                </div>
              ))}
            </div>

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
          </Card>

          {/* Send Gift */}
          <Card className="p-4">
            <Button
              className="w-full"
              variant="default"
              onClick={() => setShowGifts(!showGifts)}
            >
              <GiftIcon className="w-4 h-4 mr-2" />
              Send Gift
            </Button>

            {showGifts && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {gifts.slice(0, 6).map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => handleSendGift(gift.id)}
                    className="p-3 border rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">{gift.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
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