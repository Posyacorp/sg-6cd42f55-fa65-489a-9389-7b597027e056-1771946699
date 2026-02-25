import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Camera, Loader2, Building2, Users, TrendingUp, DollarSign,
  User, Bell, Lock, Globe, Briefcase, FileText
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function AgencyProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
    company_name: "",
    registration_number: "",
    business_address: "",
    contact_person: "",
    website: "",
  });

  const [stats, setStats] = useState({
    totalAnchors: 0,
    activeAnchors: 0,
    totalCommission: 0,
    monthlyRevenue: 0,
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
        company_name: "",
        registration_number: "",
        business_address: "",
        contact_person: "",
        website: "",
      });

      setStats({
        totalAnchors: 0,
        activeAnchors: 0,
        totalCommission: 0,
        monthlyRevenue: 0,
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
        <SEO title="Agency Profile - Pukaarly" />
        <DashboardLayout role="agency">
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
        title="Agency Profile - Pukaarly"
        description="Manage your agency profile and business information"
      />
      <DashboardLayout role="agency">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Agency Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your agency profile and business details
              </p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="business" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Business</span>
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
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Agency Logo</CardTitle>
                    <CardDescription>Your brand identity</CardDescription>
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
                      {uploadingPhoto ? "Uploading..." : "Change Logo"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Primary agency contact details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Contact Person</Label>
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
                      <Label htmlFor="bio">Agency Description</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Describe your agency..."
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
                  <CardTitle>Agency Statistics</CardTitle>
                  <CardDescription>Your performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Users className="w-4 h-4 text-blue-500" />
                        Total Anchors
                      </div>
                      <div className="text-2xl font-bold">{stats.totalAnchors}</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Active Anchors
                      </div>
                      <div className="text-2xl font-bold">{stats.activeAnchors}</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <DollarSign className="w-4 h-4 text-yellow-500" />
                        Total Commission
                      </div>
                      <div className="text-2xl font-bold">${stats.totalCommission.toLocaleString()}</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Building2 className="w-4 h-4 text-purple-500" />
                        Monthly Revenue
                      </div>
                      <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Legal and registration details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) =>
                          setFormData({ ...formData, company_name: e.target.value })
                        }
                        placeholder="Legal company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registration_number">Registration Number</Label>
                      <Input
                        id="registration_number"
                        value={formData.registration_number}
                        onChange={(e) =>
                          setFormData({ ...formData, registration_number: e.target.value })
                        }
                        placeholder="Business registration number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_address">Business Address</Label>
                    <Textarea
                      id="business_address"
                      value={formData.business_address}
                      onChange={(e) =>
                        setFormData({ ...formData, business_address: e.target.value })
                      }
                      placeholder="Complete business address"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                  <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                    {saving ? "Saving..." : "Save Business Details"}
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
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}