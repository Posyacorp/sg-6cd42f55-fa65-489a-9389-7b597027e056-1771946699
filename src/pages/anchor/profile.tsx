import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { PrivacySettings } from "@/components/profile/PrivacySettings";
import { SocialLinks } from "@/components/profile/SocialLinks";
import type { Database } from "@/integrations/supabase/types";
import { 
  Camera, Save, Loader2, Video, Star, TrendingUp,
  User, Settings, Bell, Lock, Globe, Briefcase, Calendar, DollarSign
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function AnchorProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
    stage_name: "",
    specialty: "",
    streaming_schedule: "",
    bank_account: "",
    bank_name: "",
    account_holder: "",
  });

  // Stats
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalStreams: 0,
    averageRating: 0,
    totalViewers: 0,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { user } = await authService.getCurrentUser();
      const profileData = await profileService.getProfile(user.id);

      setProfile(profileData);
      setFormData({
        full_name: profileData.full_name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        bio: profileData.bio || "",
        stage_name: "",
        specialty: "",
        streaming_schedule: "",
        bank_account: "",
        bank_name: "",
        account_holder: "",
      });

      // Load anchor-specific stats
      setStats({
        totalEarnings: 0,
        totalStreams: 0,
        averageRating: 4.8,
        totalViewers: 0,
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      await profileService.updateProfile(profile.id, {
        full_name: formData.full_name,
        phone: formData.phone,
        bio: formData.bio,
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      await loadProfile();
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image file",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Image must be less than 2MB",
      });
      return;
    }

    try {
      setUploadingPhoto(true);
      await profileService.uploadProfilePicture(profile.id, file);
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

      await loadProfile();
    } catch (error) {
      console.error("Failed to upload photo:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload profile picture",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <>
        <SEO title="Anchor Profile - Pukaarly" />
        <DashboardLayout role="anchor">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Anchor Profile - Pukaarly"
        description="Manage your anchor profile and streaming preferences"
      />
      <DashboardLayout role="anchor">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Anchor Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your streaming profile and professional information
              </p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="professional" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Professional</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger value="banking" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Banking</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Your professional photo</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {profile?.full_name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="w-full"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {uploadingPhoto ? "Uploading..." : "Change Photo"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your basic profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) =>
                            setFormData({ ...formData, full_name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={formData.email}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Member Since</Label>
                        <Input
                          value={
                            profile?.created_at
                              ? new Date(profile.created_at).toLocaleDateString()
                              : ""
                          }
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Tell viewers about yourself..."
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Streaming Statistics</CardTitle>
                  <CardDescription>Your performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        Total Earnings
                      </div>
                      <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Video className="w-4 h-4 text-blue-500" />
                        Total Streams
                      </div>
                      <div className="text-2xl font-bold">{stats.totalStreams}</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Average Rating
                      </div>
                      <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        Total Viewers
                      </div>
                      <div className="text-2xl font-bold">{stats.totalViewers.toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                  <CardDescription>Your streaming credentials and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="stage_name">Stage Name</Label>
                      <Input
                        id="stage_name"
                        value={formData.stage_name}
                        onChange={(e) =>
                          setFormData({ ...formData, stage_name: e.target.value })
                        }
                        placeholder="Your professional name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Select
                        value={formData.specialty}
                        onValueChange={(value) =>
                          setFormData({ ...formData, specialty: value })
                        }
                      >
                        <SelectTrigger id="specialty">
                          <SelectValue placeholder="Select your specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="talk">Talk Show</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streaming_schedule">Streaming Schedule</Label>
                    <Textarea
                      id="streaming_schedule"
                      value={formData.streaming_schedule}
                      onChange={(e) =>
                        setFormData({ ...formData, streaming_schedule: e.target.value })
                      }
                      placeholder="e.g., Mon-Fri 8PM-10PM EST"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                    {saving ? "Saving..." : "Save Professional Details"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettings userId={user?.id || ""} />
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacySettings userId={user?.id || ""} />
            </TabsContent>

            <TabsContent value="social">
              <SocialLinks userId={user?.id || ""} />
            </TabsContent>

            <TabsContent value="banking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Banking Information</CardTitle>
                  <CardDescription>For withdrawals and payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input
                      id="bank_name"
                      value={formData.bank_name}
                      onChange={(e) =>
                        setFormData({ ...formData, bank_name: e.target.value })
                      }
                      placeholder="Your bank name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account_holder">Account Holder Name</Label>
                    <Input
                      id="account_holder"
                      value={formData.account_holder}
                      onChange={(e) =>
                        setFormData({ ...formData, account_holder: e.target.value })
                      }
                      placeholder="Full name as on bank account"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank_account">Account Number</Label>
                    <Input
                      id="bank_account"
                      type="password"
                      value={formData.bank_account}
                      onChange={(e) =>
                        setFormData({ ...formData, bank_account: e.target.value })
                      }
                      placeholder="Your bank account number"
                    />
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      🔒 Your banking information is encrypted and secure. It will only be used for processing withdrawals.
                    </p>
                  </div>
                  <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                    {saving ? "Saving..." : "Save Banking Details"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}