import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { streamService } from "@/services/streamService";
import { pkService } from "@/services/pkService";
import { giftService } from "@/services/giftService";
import { messageService } from "@/services/messageService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Gift,
  Send,
  Swords,
  Trophy,
  Clock,
  Radio,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

export default function StreamPage() {
  const router = useRouter();
  const { id: streamId } = router.query;
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [stream, setStream] = useState<any>(null);
  const [pkBattle, setPkBattle] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const [gifts, setGifts] = useState<any[]>([]);
  const [selectedGift, setSelectedGift] = useState<any>(null);

  useEffect(() => {
    if (streamId) {
      loadStreamData();
      loadGifts();
      // Set up polling for battle updates
      const interval = setInterval(() => {
        checkActiveBattle();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [streamId]);

  const loadStreamData = async () => {
    try {
      setLoading(true);
      const { data } = await streamService.getStreamById(streamId as string);
      if (data) {
        setStream(data);
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
    const { data } = await giftService.getAllGifts();
    if (data) {
      setGifts(data);
    }
  };

  const checkActiveBattle = async () => {
    if (!stream?.user_id) return;
    const { data } = await pkService.getActiveBattle(stream.user_id);
    setPkBattle(data);
  };

  const sendChatMessage = async () => {
    if (!messageText.trim() || !user) return;

    // Add message to local state immediately
    const newMessage = {
      id: Date.now().toString(),
      sender_id: user.id,
      sender_name: user.email?.split("@")[0] || "User",
      message_text: messageText,
      created_at: new Date().toISOString(),
    };
    setChatMessages([...chatMessages, newMessage]);
    setMessageText("");

    // TODO: Send to backend via Realtime or REST
  };

  const sendGift = async (gift: any) => {
    if (!user || !stream) return;

    try {
      const { success } = await giftService.sendGift(user.id, stream.user_id, gift.id);
      if (success) {
        toast({
          title: "Gift Sent!",
          description: `You sent ${gift.name} to ${stream.user?.full_name}`,
        });

        // Update PK battle score if active
        if (pkBattle && pkBattle.status === "active") {
          await pkService.updateScore(pkBattle.id, stream.user_id, gift.coin_price);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to send gift",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending gift:", error);
    }
  };

  const startPKBattle = async () => {
    if (!user || !stream) return;

    // TODO: Show anchor selection dialog
    toast({
      title: "PK Challenge",
      description: "Select an opponent to challenge!",
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stream) {
    return (
      <DashboardLayout role="user">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium">Stream not found</p>
            <Button onClick={() => router.push("/user/explore")} className="mt-4">
              Back to Explore
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="space-y-4">
        {/* Stream Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={stream.user?.avatar_url || ""} />
              <AvatarFallback>{stream.user?.full_name?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{stream.title || "Live Stream"}</h1>
              <p className="text-muted-foreground">{stream.user?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Users className="h-4 w-4" />
              {stream.viewer_count || 0}
            </Badge>
            <Badge className="bg-red-500 gap-1">
              <Radio className="h-3 w-3 animate-pulse" />
              LIVE
            </Badge>
          </div>
        </div>

        {/* PK Battle Banner */}
        {pkBattle && pkBattle.status === "active" && (
          <Card className="border-2 border-purple-500 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Swords className="h-6 w-6 text-purple-500" />
                  <div>
                    <p className="font-bold text-lg">PK BATTLE IN PROGRESS!</p>
                    <p className="text-sm text-muted-foreground">
                      Send gifts to support your favorite anchor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{pkBattle.inviter_score || 0}</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">{pkBattle.invitee_score || 0}</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{pkBattle.inviter?.full_name}</span>
                  <span>{pkBattle.invitee?.full_name}</span>
                </div>
                <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 h-full bg-purple-500 transition-all"
                    style={{
                      width: `${
                        (pkBattle.inviter_score /
                          (pkBattle.inviter_score + pkBattle.invitee_score || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Video Player */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-black">
                {/* Placeholder for Video Player */}
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                    <Radio className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl font-bold">Live Stream</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Video player integration point
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      (Connect Agora/LiveKit/WebRTC SDK here)
                    </p>
                  </div>
                </div>

                {/* Floating Actions */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  {user?.id !== stream.user_id && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={startPKBattle}
                    >
                      <Swords className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat & Gifts Sidebar */}
          <Card className="lg:col-span-1">
            <Tabs defaultValue="chat" className="h-full">
              <TabsList className="w-full">
                <TabsTrigger value="chat" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="gifts" className="flex-1">
                  <Gift className="h-4 w-4 mr-2" />
                  Gifts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex flex-col h-[600px]">
                <ScrollArea className="flex-1 p-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No messages yet</p>
                      <p className="text-sm">Be the first to chat!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{msg.sender_name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{msg.sender_name}</p>
                            <p className="text-sm text-muted-foreground">{msg.message_text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                    />
                    <Button size="icon" onClick={sendChatMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="gifts" className="p-4">
                <ScrollArea className="h-[550px]">
                  <div className="grid grid-cols-2 gap-3">
                    {gifts.map((gift) => (
                      <Card
                        key={gift.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => sendGift(gift)}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="text-4xl mb-2">{gift.icon || "🎁"}</div>
                          <p className="font-medium text-sm">{gift.name}</p>
                          <Badge variant="secondary" className="mt-1">
                            {gift.coin_price} coins
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}