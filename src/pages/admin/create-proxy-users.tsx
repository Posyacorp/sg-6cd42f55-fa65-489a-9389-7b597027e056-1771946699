import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Sparkles, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

export default function CreateProxyUsers() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bulkCount, setBulkCount] = useState(10);
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
    "Zara Ali", "Isha Bansal", "Avni Kapoor", "Tara Malhotra", "Sia Agarwal"
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

  const generateRandomEmail = (name: string) => {
    const username = name.toLowerCase().replace(/\s+/g, ".");
    const random = Math.floor(Math.random() * 9999);
    return `${username}${random}@pukaarly.demo`;
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

    try {
      for (let i = 0; i < bulkCount; i++) {
        const name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
        const email = generateRandomEmail(name);
        const bio = bios[Math.floor(Math.random() * bios.length)];
        const avatar = avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
        const age = Math.floor(Math.random() * 15) + 18; // 18-32

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
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: authData.user.id,
              email: email,
              full_name: name,
              bio: bio,
              avatar_url: avatar,
              role: "anchor",
              status: "active",
              coins_balance: Math.floor(Math.random() * 1000) + 100,
              diamonds_balance: Math.floor(Math.random() * 500) + 50
            });

          if (profileError) {
            failCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          failCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      toast({
        title: "Bulk Creation Complete!",
        description: `✅ Created ${successCount} users | ❌ Failed ${failCount} users`,
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
          <h1 className="text-3xl font-bold">Create Proxy Users</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Generate demo users and anchors for testing
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bulk Creation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Bulk User Creation
              </CardTitle>
              <CardDescription>
                Automatically generate multiple female anchor accounts
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
                  Generate 1-50 users at once (recommended: 10-20)
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                <p className="text-sm font-medium">Auto-Generated Features:</p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>✅ Random female names (Indian)</li>
                  <li>✅ Professional profile pictures</li>
                  <li>✅ Engaging bios</li>
                  <li>✅ Random ages (18-32)</li>
                  <li>✅ Starting coins & diamonds</li>
                  <li>✅ Active status</li>
                  <li>✅ Default password: Demo123456!</li>
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
                    Creating {bulkCount} Users...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate {bulkCount} Female Anchors
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
            <CardTitle className="text-lg">📝 Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• All proxy users get the default password: <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">Demo123456!</code></p>
            <p>• Bulk-generated users use demo emails: <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">username@pukaarly.demo</code></p>
            <p>• All users are created with "active" status</p>
            <p>• Random coins (100-1100) and diamonds (50-550) assigned</p>
            <p>• Perfect for testing, demos, and populating the platform</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}