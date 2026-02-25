import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Sparkles, Users, Video, Gift, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";

interface ProxyUser {
  email: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  role: "user" | "anchor";
  gender: "female" | "male" | "other";
  age: number;
  country: string;
}

interface TestDataOptions {
  createStreams: boolean;
  createMessages: boolean;
  createGifts: boolean;
  streamCount: number;
}

export default function CreateProxyUsers() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bulkCount, setBulkCount] = useState(10);
  const [testDataOptions, setTestDataOptions] = useState<TestDataOptions>({
    createStreams: true,
    createMessages: true,
    createGifts: true,
    streamCount: 5
  });
  const [singleUser, setSingleUser] = useState<ProxyUser>({
    email: "",
    full_name: "",
    bio: "",
    avatar_url: "",
    role: "anchor",
    gender: "female",
    age: 21,
    country: "India"
  });

  // Generate random female names
  const femaleNames = [
    "Priya Sharma", "Ananya Singh", "Riya Patel", "Sneha Kumar", "Aditi Verma",
    "Pooja Gupta", "Neha Reddy", "Kavya Nair", "Ishita Joshi", "Tanvi Mehta",
    "Sakshi Rao", "Diya Desai", "Aadhya Shah", "Myra Iyer", "Sara Khan",
    "Zara Ali", "Isha Bansal", "Avni Kapoor", "Tara Malhotra", "Sia Agarwal",
    "Kiara Jain", "Aisha Pandey", "Maya Bhat", "Nisha Choudhary", "Rhea Saxena"
  ];

  const bios = [
    "💃 Dance lover | Music enthusiast | Let's vibe together!",
    "✨ Spreading positivity | Coffee addict | Night owl",
    "🎤 Singer | Performer | Your virtual bestie",
    "📸 Content creator | Fashion lover | Always online",
    "🌟 Live streamer | Gamer | Let's connect!",
    "💕 Friendly & fun | Love to chat | Available 24/7",
    "🎨 Artist | Creative soul | Here for good vibes",
    "🎵 Music is life | Party lover | Let's have fun!",
    "📱 Social butterfly | Tech savvy | Always active",
    "🌸 Peaceful vibes | Good listener | Your friend"
  ];

  const avatarUrls = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
  ];

  const streamTitles = [
    "🎤 Live Singing Session",
    "💃 Dance Party Tonight!",
    "🎮 Gaming with Friends",
    "☕ Morning Coffee Chat",
    "🌙 Late Night Vibes",
    "🎨 Art & Creativity Time",
    "🎵 Music Jam Session",
    "💬 Let's Talk About Life",
    "🌟 Just Hanging Out",
    "🎭 Talent Show Time"
  ];

  const chatMessages = [
    "Hello everyone! 👋",
    "Love your stream! ❤️",
    "This is amazing!",
    "Can you sing my favorite song?",
    "You're so talented! ✨",
    "I'm your biggest fan!",
    "Keep it up!",
    "This is so cool! 🔥",
    "Thanks for streaming!",
    "You're the best! 🌟"
  ];

  const generateRandomEmail = (name: string) => {
    const username = name.toLowerCase().replace(/\s+/g, ".");
    const random = Math.floor(Math.random() * 9999);
    return `${username}${random}@pukaarly.demo`;
  };

  const createLiveStream = async (anchorId: string, anchorName: string) => {
    try {
      const title = streamTitles[Math.floor(Math.random() * streamTitles.length)];
      const viewerCount = Math.floor(Math.random() * 500) + 50;
      
      const { data: stream, error } = await supabase
        .from("streams")
        .insert({
          anchor_id: anchorId,
          title: title,
          status: "live",
          viewer_count: viewerCount,
          start_time: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return stream;
    } catch (error) {
      console.error("Error creating stream:", error);
      return null;
    }
  };

  const createChatMessages = async (streamId: string, users: any[]) => {
    try {
      const messageCount = Math.floor(Math.random() * 20) + 10;
      const messages = [];

      for (let i = 0; i < messageCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomMessage = chatMessages[Math.floor(Math.random() * chatMessages.length)];
        
        messages.push({
          stream_id: streamId,
          sender_id: randomUser.id,
          message: randomMessage,
          created_at: new Date(Date.now() - Math.random() * 3600000).toISOString()
        });
      }

      await supabase.from("stream_messages").insert(messages);
    } catch (error) {
      console.error("Error creating messages:", error);
    }
  };

  const createGiftTransactions = async (streamId: string, anchorId: string, users: any[]) => {
    try {
      // Get available gifts
      const { data: gifts } = await supabase
        .from("gifts")
        .select("*")
        .limit(5);

      if (!gifts || gifts.length === 0) return;

      const giftCount = Math.floor(Math.random() * 15) + 5;
      const transactions = [];

      for (let i = 0; i < giftCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
        
        transactions.push({
          sender_id: randomUser.id,
          receiver_id: anchorId,
          gift_id: randomGift.id,
          stream_id: streamId,
          coins_spent: randomGift.coin_price,
          beans_earned: Math.floor(randomGift.coin_price * 0.5),
          created_at: new Date(Date.now() - Math.random() * 3600000).toISOString()
        });
      }

      await supabase.from("gift_transactions").insert(transactions);
    } catch (error) {
      console.error("Error creating gifts:", error);
    }
  };

  const createSingleProxyUser = async () => {
    if (!singleUser.email || !singleUser.full_name) {
      toast({
        title: "Error",
        description: "Email and name are required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create auth user with a default password
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: singleUser.email,
        password: "Demo123456!",
        email_confirm: true
      });

      if (authError) throw authError;

      // Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: singleUser.email,
          full_name: singleUser.full_name,
          bio: singleUser.bio,
          avatar_url: singleUser.avatar_url,
          role: singleUser.role,
          status: "active",
          coins_balance: Math.floor(Math.random() * 1000) + 100,
          diamonds_balance: Math.floor(Math.random() * 500) + 50
        });

      if (profileError) throw profileError;

      toast({
        title: "Success!",
        description: `Created proxy user: ${singleUser.full_name}`,
      });

      // Reset form
      setSingleUser({
        email: "",
        full_name: "",
        bio: "",
        avatar_url: "",
        role: "anchor",
        gender: "female",
        age: 21,
        country: "India"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createBulkProxyUsers = async () => {
    setLoading(true);
    let successCount = 0;
    let failCount = 0;
    const createdUsers: any[] = [];
    const createdAnchors: any[] = [];

    try {
      // Phase 1: Create Users
      toast({
        title: "Phase 1/4: Creating Users",
        description: `Generating ${bulkCount} test users...`,
      });

      for (let i = 0; i < bulkCount; i++) {
        const name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
        const email = generateRandomEmail(name);
        const bio = bios[Math.floor(Math.random() * bios.length)];
        const avatar = avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
        const age = Math.floor(Math.random() * 15) + 18; // 18-32
        const isAnchor = Math.random() > 0.3; // 70% anchors, 30% users

        try {
          // Create auth user
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: email,
            password: "Demo123456!",
            email_confirm: true
          });

          if (authError) {
            failCount++;
            continue;
          }

          // Create profile
          const profileData = {
            id: authData.user.id,
            email: email,
            full_name: name,
            bio: bio,
            avatar_url: avatar,
            role: isAnchor ? "anchor" : "user",
            status: "active",
            coins_balance: Math.floor(Math.random() * 1000) + 100,
            diamonds_balance: Math.floor(Math.random() * 500) + 50
          };

          const { error: profileError } = await supabase
            .from("profiles")
            .insert(profileData);

          if (profileError) {
            failCount++;
          } else {
            successCount++;
            createdUsers.push({ id: authData.user.id, ...profileData });
            if (isAnchor) {
              createdAnchors.push({ id: authData.user.id, ...profileData });
            }
          }
        } catch (error) {
          failCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Phase 2: Create Live Streams
      if (testDataOptions.createStreams && createdAnchors.length > 0) {
        toast({
          title: "Phase 2/4: Creating Live Streams",
          description: `Generating ${Math.min(testDataOptions.streamCount, createdAnchors.length)} streams...`,
        });

        const streamCount = Math.min(testDataOptions.streamCount, createdAnchors.length);
        const createdStreams: any[] = [];

        for (let i = 0; i < streamCount; i++) {
          const anchor = createdAnchors[i];
          const stream = await createLiveStream(anchor.id, anchor.full_name);
          if (stream) {
            createdStreams.push(stream);
          }
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Phase 3: Create Chat Messages
        if (testDataOptions.createMessages && createdStreams.length > 0 && createdUsers.length > 0) {
          toast({
            title: "Phase 3/4: Creating Chat Messages",
            description: `Adding realistic chat messages...`,
          });

          for (const stream of createdStreams) {
            await createChatMessages(stream.id, createdUsers);
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        // Phase 4: Create Gift Transactions
        if (testDataOptions.createGifts && createdStreams.length > 0 && createdUsers.length > 0) {
          toast({
            title: "Phase 4/4: Creating Gift Transactions",
            description: `Adding gift transactions...`,
          });

          for (const stream of createdStreams) {
            await createGiftTransactions(
              stream.id,
              stream.anchor_id,
              createdUsers.filter(u => u.id !== stream.anchor_id)
            );
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }

      toast({
        title: "✅ Test Data Generation Complete!",
        description: `
          Users Created: ${successCount}
          Users Failed: ${failCount}
          ${testDataOptions.createStreams ? `Streams: ${Math.min(testDataOptions.streamCount, createdAnchors.length)}` : ''}
          ${testDataOptions.createMessages ? 'Chat Messages: Added' : ''}
          ${testDataOptions.createGifts ? 'Gift Transactions: Added' : ''}
        `,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Generate Test Data</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create realistic test users, streams, and activities for platform testing
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bulk Creation with Test Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Bulk Test Data Generation
              </CardTitle>
              <CardDescription>
                Generate users with live streams, chat, and gift activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulkCount">Number of Users</Label>
                <Input
                  id="bulkCount"
                  type="number"
                  min="1"
                  max="50"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500">
                  Generate 1-50 users (70% anchors, 30% regular users)
                </p>
              </div>

              <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium">Additional Test Data:</p>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="createStreams"
                    checked={testDataOptions.createStreams}
                    onCheckedChange={(checked) => 
                      setTestDataOptions({ ...testDataOptions, createStreams: checked as boolean })
                    }
                  />
                  <Label htmlFor="createStreams" className="text-sm cursor-pointer flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Create live streams
                  </Label>
                </div>

                {testDataOptions.createStreams && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="streamCount" className="text-xs">Number of Streams</Label>
                    <Input
                      id="streamCount"
                      type="number"
                      min="1"
                      max="20"
                      value={testDataOptions.streamCount}
                      onChange={(e) => setTestDataOptions({ 
                        ...testDataOptions, 
                        streamCount: parseInt(e.target.value) 
                      })}
                      className="h-8"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="createMessages"
                    checked={testDataOptions.createMessages}
                    onCheckedChange={(checked) => 
                      setTestDataOptions({ ...testDataOptions, createMessages: checked as boolean })
                    }
                    disabled={!testDataOptions.createStreams}
                  />
                  <Label 
                    htmlFor="createMessages" 
                    className={`text-sm cursor-pointer flex items-center gap-2 ${!testDataOptions.createStreams ? 'opacity-50' : ''}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Add chat messages to streams
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="createGifts"
                    checked={testDataOptions.createGifts}
                    onCheckedChange={(checked) => 
                      setTestDataOptions({ ...testDataOptions, createGifts: checked as boolean })
                    }
                    disabled={!testDataOptions.createStreams}
                  />
                  <Label 
                    htmlFor="createGifts" 
                    className={`text-sm cursor-pointer flex items-center gap-2 ${!testDataOptions.createStreams ? 'opacity-50' : ''}`}
                  >
                    <Gift className="w-4 h-4" />
                    Generate gift transactions
                  </Label>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg space-y-2">
                <p className="text-sm font-medium">What Gets Generated:</p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>✅ {bulkCount} realistic user profiles</li>
                  <li>✅ Random female names (Indian)</li>
                  <li>✅ Professional avatars & bios</li>
                  <li>✅ Starting coins & diamonds</li>
                  {testDataOptions.createStreams && (
                    <>
                      <li>✅ {testDataOptions.streamCount} active live streams</li>
                      <li>✅ Realistic viewer counts</li>
                    </>
                  )}
                  {testDataOptions.createMessages && <li>✅ Chat message history</li>}
                  {testDataOptions.createGifts && <li>✅ Gift transaction activity</li>}
                </ul>
              </div>

              <Button
                onClick={createBulkProxyUsers}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Test Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Complete Test Environment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Single User Creation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Custom User Creation
              </CardTitle>
              <CardDescription>
                Create a single user with custom details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={singleUser.email}
                  onChange={(e) => setSingleUser({ ...singleUser, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter full name"
                  value={singleUser.full_name}
                  onChange={(e) => setSingleUser({ ...singleUser, full_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="User bio..."
                  value={singleUser.bio}
                  onChange={(e) => setSingleUser({ ...singleUser, bio: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  placeholder="https://example.com/avatar.jpg"
                  value={singleUser.avatar_url}
                  onChange={(e) => setSingleUser({ ...singleUser, avatar_url: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={singleUser.role}
                    onValueChange={(value: "user" | "anchor") => 
                      setSingleUser({ ...singleUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="anchor">Anchor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="99"
                    value={singleUser.age}
                    onChange={(e) => setSingleUser({ ...singleUser, age: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <Button
                onClick={createSingleProxyUser}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Custom User
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardHeader>
            <CardTitle className="text-lg">📝 Test Data Generation Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• <strong>Bulk Generation:</strong> Creates complete test environment with users, streams, chat, and gifts</p>
            <p>• <strong>Default Password:</strong> <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">Demo123456!</code> for all users</p>
            <p>• <strong>Email Format:</strong> <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">username@pukaarly.demo</code></p>
            <p>• <strong>User Mix:</strong> 70% anchors (can stream) + 30% regular users</p>
            <p>• <strong>Activity Generation:</strong> Realistic viewer counts, chat messages, gift transactions</p>
            <p>• <strong>Perfect For:</strong> Testing features, demos, presentations, and development</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}