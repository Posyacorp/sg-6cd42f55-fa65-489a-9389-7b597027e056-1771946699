import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { messageService } from "@/services/messageService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ConversationWithUser } from "@/services/messageService";

export default function UserMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationWithUser[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data } = await messageService.getConversations(user.id);
      if (data) {
        setConversations(data);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data } = await messageService.getMessages(conversationId);
      if (data) {
        setMessages(data);
        await messageService.markAsRead(conversationId, user!.id);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !user) return;

    try {
      const { success } = await messageService.sendMessage(
        selectedConversation,
        user.id,
        messageText
      );

      if (success) {
        setMessageText("");
        loadMessages(selectedConversation);
        loadConversations();
      } else {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.other_user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.other_user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConvData = conversations.find(c => c.id === selectedConversation);

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
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Chat with anchors and other users</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px]">
                {filteredConversations.length === 0 ? (
                  <div className="text-center text-muted-foreground p-6">
                    No conversations yet
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 border-b ${
                        selectedConversation === conv.id ? "bg-muted" : ""
                      }`}
                    >
                      <Avatar>
                        <AvatarImage src={conv.other_user?.avatar_url || ""} />
                        <AvatarFallback>
                          {conv.other_user?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {conv.other_user?.full_name || "Unknown User"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.other_user?.email}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConvData?.other_user?.avatar_url || ""} />
                      <AvatarFallback>
                        {selectedConvData?.other_user?.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{selectedConvData?.other_user?.full_name || "Unknown User"}</p>
                      <p className="text-sm text-muted-foreground font-normal">
                        {selectedConvData?.other_user?.email}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-[480px]">
                  <ScrollArea className="flex-1 pr-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground p-6">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.sender_id === user?.id ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                msg.sender_id === user?.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{msg.message_text}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(msg.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a conversation from the list to start chatting</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}