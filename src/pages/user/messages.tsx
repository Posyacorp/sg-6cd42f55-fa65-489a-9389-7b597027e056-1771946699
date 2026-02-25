import { useState, useEffect, useRef, useMemo } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Send, 
  Image as ImageIcon, 
  MoreVertical, 
  Phone, 
  Video,
  Loader2
} from "lucide-react";
import { messageService, type ConversationWithUser } from "@/services/messageService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  // State
  const [conversations, setConversations] = useState<ConversationWithUser[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  // Derived State
  const activeConversation = useMemo(() => 
    conversations.find(c => c.partner.id === selectedConversationId),
    [conversations, selectedConversationId]
  );

  const filteredConversations = useMemo(() => 
    conversations.filter(c => 
      c.partner.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.partner.id.includes(searchQuery)
    ),
    [conversations, searchQuery]
  );

  // Load conversation list
  useEffect(() => {
    if (user) {
      loadConversations();
      
      // Subscribe to all new messages to update list order/unread counts
      const sub = messageService.subscribeToAllMessages(user.id, (msg) => {
        loadConversations();
      });
      
      return () => {
        messageService.unsubscribe(sub);
      };
    }
  }, [user]);

  // Load messages when conversation selected
  useEffect(() => {
    if (user && selectedConversationId) {
      loadMessages(selectedConversationId);
      
      // Subscribe to this specific conversation
      if (channelRef.current) messageService.unsubscribe(channelRef.current);
      
      channelRef.current = messageService.subscribeToConversation(
        user.id,
        selectedConversationId,
        (msg) => {
          setMessages((prev) => [...prev, msg]);
          scrollToBottom();
          // Mark as read immediately if looking at it
          messageService.markAsRead([msg.id]);
        }
      );
    }
    
    return () => {
      if (channelRef.current) messageService.unsubscribe(channelRef.current);
    };
  }, [selectedConversationId, user]);

  const loadConversations = async () => {
    if (!user) return;
    try {
      const { data, error } = await messageService.getConversations(user.id);
      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (partnerId: string) => {
    if (!user) return;
    try {
      const { data, error } = await messageService.getMessages(user.id, partnerId);
      if (error) throw error;
      setMessages(data || []);
      scrollToBottom();
      
      // Mark unread messages as read
      const unreadIds = data
        ?.filter((m: any) => m.receiver_id === user.id && !m.read_at)
        .map((m: any) => m.id) || [];
        
      if (unreadIds.length > 0) {
        messageService.markAsRead(unreadIds);
        loadConversations(); // Update badge counts
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !selectedConversationId || !messageInput.trim() || sending) return;

    const tempId = Date.now().toString();
    const content = messageInput.trim();
    
    // Optimistic update
    const optimisticMessage = {
      id: tempId,
      sender_id: user.id,
      receiver_id: selectedConversationId,
      message_text: content,
      created_at: new Date().toISOString(),
      read_at: null,
      message_type: "text"
    };
    
    setMessages((prev) => [...prev, optimisticMessage]);
    setMessageInput("");
    scrollToBottom();
    setSending(true);

    try {
      const { success, error } = await messageService.sendMessage({
        sender_id: user.id,
        receiver_id: selectedConversationId,
        content: content,
        message_type: "text",
      });

      if (!success) throw error;
      
      // Refresh conversation list to show latest message snippet
      loadConversations();
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      // Revert optimistic update in a real app, or show error state
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Chat with anchors and other users</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col min-h-0">
            <CardHeader className="py-4 px-4 border-b">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {filteredConversations.length === 0 ? (
                  <div className="text-center text-muted-foreground p-8">
                    {conversations.length === 0 ? "No conversations yet" : "No matches found"}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {filteredConversations.map((conv) => (
                      <button
                        key={conv.partner.id}
                        onClick={() => setSelectedConversationId(conv.partner.id)}
                        className={`flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50 border-b last:border-0 ${
                          selectedConversationId === conv.partner.id ? "bg-muted" : ""
                        }`}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conv.partner.avatar_url || ""} />
                            <AvatarFallback>
                              {conv.partner.full_name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          {conv.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="font-medium truncate block">
                              {conv.partner.full_name || "Unknown User"}
                            </span>
                            {conv.lastMessage && (
                              <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                {new Date(conv.lastMessage.created_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage?.message_text || "No messages"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col min-h-0">
            {activeConversation ? (
              <>
                <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activeConversation.partner.avatar_url || ""} />
                      <AvatarFallback>
                        {activeConversation.partner.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {activeConversation.partner.full_name || "Unknown User"}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                        Online
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 p-0 flex flex-col min-h-0 overflow-hidden">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10">
                          <p>No messages yet.</p>
                          <p className="text-sm">Say hello to start the conversation!</p>
                        </div>
                      ) : (
                        messages.map((msg, index) => {
                          const isMe = msg.sender_id === user?.id;
                          return (
                            <div
                              key={msg.id || index}
                              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                                  isMe
                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                    : "bg-muted text-foreground rounded-bl-none"
                                }`}
                              >
                                <p>{msg.message_text}</p>
                                <p className={`text-[10px] mt-1 text-right ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <form 
                      onSubmit={handleSendMessage}
                      className="flex items-center gap-2"
                    >
                      <Button type="button" variant="ghost" size="icon" className="shrink-0">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        className="flex-1"
                        disabled={sending}
                      />
                      <Button type="submit" size="icon" disabled={!messageInput.trim() || sending}>
                        {sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
                <div className="bg-muted/50 p-6 rounded-full mb-4">
                  <Send className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Your Messages</h3>
                <p className="max-w-xs mx-auto text-sm">
                  Select a conversation from the list or start a new one from a user's profile.
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}