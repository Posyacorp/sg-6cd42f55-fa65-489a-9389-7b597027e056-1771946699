import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Compass, 
  MessageSquare, 
  Wallet, 
  User, 
  Users, 
  DollarSign,
  Send,
  Search
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/user/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Explore", href: "/user/explore", icon: <Compass className="w-4 h-4" /> },
  { label: "Messages", href: "/user/messages", icon: <MessageSquare className="w-4 h-4" /> },
  { label: "Wallet", href: "/user/wallet", icon: <Wallet className="w-4 h-4" /> },
  { label: "Profile", href: "/user/profile", icon: <User className="w-4 h-4" /> },
  { label: "Referrals", href: "/user/referrals", icon: <Users className="w-4 h-4" /> },
  { label: "Withdraw", href: "/user/withdraw", icon: <DollarSign className="w-4 h-4" /> }
];

const conversations = [
  { name: "Sarah Smith", lastMessage: "Thanks for the session!", time: "2m ago", unread: 2, online: true },
  { name: "Mike Johnson", lastMessage: "See you tomorrow!", time: "1h ago", unread: 0, online: false },
  { name: "Emily Chen", lastMessage: "Great connecting with you", time: "3h ago", unread: 1, online: true }
];

export default function UserMessages() {
  return (
    <>
      <SEO title="Messages - Pukaarly User" />
      <DashboardLayout navItems={navItems} role="user">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-gray-600 dark:text-gray-400">Chat with your favorite anchors</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search messages..." className="pl-10" />
                </div>
                <div className="space-y-2">
                  {conversations.map((conv, i) => (
                    <button
                      key={i}
                      className="w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                            {conv.name.charAt(0)}
                          </div>
                          {conv.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium truncate">{conv.name}</span>
                            <span className="text-xs text-gray-500">{conv.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {conv.lastMessage}
                          </p>
                        </div>
                        {conv.unread > 0 && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">
                            {conv.unread}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2">
              <CardContent className="p-0 h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                      S
                    </div>
                    <div>
                      <h3 className="font-semibold">Sarah Smith</h3>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-2">
                      <p className="text-sm">Hey! Thanks for connecting today</p>
                      <span className="text-xs text-gray-500">10:30 AM</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[70%] bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl rounded-tr-none px-4 py-2">
                      <p className="text-sm">It was great! Looking forward to the next session</p>
                      <span className="text-xs opacity-80">10:32 AM</span>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-2">
                      <p className="text-sm">Absolutely! Let me know when you're free</p>
                      <span className="text-xs text-gray-500">10:35 AM</span>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex gap-2">
                    <Input placeholder="Type a message..." />
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}