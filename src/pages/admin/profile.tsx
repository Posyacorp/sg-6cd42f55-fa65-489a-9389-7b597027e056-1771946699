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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { PrivacySettings } from "@/components/profile/PrivacySettings";
import { SocialLinks } from "@/components/profile/SocialLinks";
import { ImageCropper } from "@/components/profile/ImageCropper";
import type { Database } from "@/integrations/supabase/types";
import { 
  Camera, Loader2, Shield, Activity, Database as DatabaseIcon,
  Key, Settings, User, Bell, Lock, Globe, FileText, AlertTriangle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function AdminProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [adminSettings, setAdminSettings] = useState({
    two_factor_enabled: false,
    api_access_enabled: false,
    audit_logs_enabled: true,
    maintenance_mode: false,
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnchors: 0,
    totalAgencies: 0,
    systemHealth: "Healthy",
    lastLogin: "",
  });

  useEffect(() => {
    loadProfile();
    loadAdminStats();
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
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      const accountStats = await profileService.getAccountStats(user.id);
      setStats({
        ...stats,
        lastLogin: new Date(accountStats.memberSince).toLocaleString(),
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

  const loadAdminStats = async () => {
    // Mock stats - replace with actual API calls
    setStats(prev => ({
      ...prev,
      totalUsers: 1247,
      totalAnchors: 156,
      totalAgencies: 23,
      systemHealth: "Healthy",
    }));
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (formData.new_password.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters",
      });
      return;
    }

    try {
      setSaving(true);
      await authService.changePassword(formData.new_password);

      toast({
        title: "Success",
        description: "Password changed successfully",
      });

      setFormData({
        ...formData,
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to change password",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Image must be less than 5MB",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!profile) return;

    try {
      setUploadingPhoto(true);
      setShowCropper(false);

      const file = new File([croppedImageBlob], "profile.jpg", { type: "image/jpeg" });
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

  const handleAdminSettingChange = (key: keyof typeof adminSettings, value: boolean) => {
    setAdminSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: `${key.replace(/_/g, " ")} has been ${value ? "enabled" : "disabled"}`,
    });
  };

  if (loading) {
    return (
      <>
        <SEO title="Admin Profile - Pukaarly" />
        <DashboardLayout role="admin">
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
        title="Admin Profile - Pukaarly"
        description="Manage your admin profile and system settings"
      />
      <DashboardLayout role="admin">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your admin profile and system settings
              </p>
            </div>
            <Badge variant="destructive" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Super Admin
            </Badge>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have elevated privileges. Changes to system settings affect all users.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">System</span>
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
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Admin avatar</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white">
                        {profile?.full_name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
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
                    <p className="text-xs text-center text-gray-500">
                      JPG, PNG or GIF. Max 5MB. Will be cropped to circle.
                    </p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Admin contact details</CardDescription>
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
                        placeholder="Tell us about yourself..."
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
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>Platform statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <User className="w-4 h-4 text-blue-500" />
                        Total Users
                      </div>
                      <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Activity className="w-4 h-4 text-green-500" />
                        Total Anchors
                      </div>
                      <div className="text-2xl font-bold">{stats.totalAnchors}</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <DatabaseIcon className="w-4 h-4 text-purple-500" />
                        Agencies
                      </div>
                      <div className="text-2xl font-bold">{stats.totalAgencies}</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Shield className="w-4 h-4 text-red-500" />
                        System Health
                      </div>
                      <div className="text-2xl font-bold text-green-600">{stats.systemHealth}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your admin password</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <Input
                        id="current_password"
                        type="password"
                        value={formData.current_password}
                        onChange={(e) =>
                          setFormData({ ...formData, current_password: e.target.value })
                        }
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input
                        id="new_password"
                        type="password"
                        value={formData.new_password}
                        onChange={(e) =>
                          setFormData({ ...formData, new_password: e.target.value })
                        }
                        placeholder="Enter new password (min 6 characters)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        value={formData.confirm_password}
                        onChange={(e) =>
                          setFormData({ ...formData, confirm_password: e.target.value })
                        }
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button type="submit" disabled={saving} className="w-full">
                      {saving ? "Changing Password..." : "Change Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Admin Access Logs</CardTitle>
                  <CardDescription>Recent admin activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Last Login</p>
                        <p className="text-sm text-gray-600">{stats.lastLogin}</p>
                      </div>
                      <Badge variant="secondary">Success</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">User Modified</p>
                        <p className="text-sm text-gray-600">2 hours ago</p>
                      </div>
                      <Badge variant="secondary">Action</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Settings Changed</p>
                        <p className="text-sm text-gray-600">5 hours ago</p>
                      </div>
                      <Badge variant="secondary">Config</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Platform-wide configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">
                        Require 2FA for admin access
                      </p>
                    </div>
                    <Switch
                      checked={adminSettings.two_factor_enabled}
                      onCheckedChange={(checked) =>
                        handleAdminSettingChange("two_factor_enabled", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">API Access</p>
                      <p className="text-sm text-gray-600">
                        Enable API access for integrations
                      </p>
                    </div>
                    <Switch
                      checked={adminSettings.api_access_enabled}
                      onCheckedChange={(checked) =>
                        handleAdminSettingChange("api_access_enabled", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Audit Logs</p>
                      <p className="text-sm text-gray-600">
                        Track all admin actions
                      </p>
                    </div>
                    <Switch
                      checked={adminSettings.audit_logs_enabled}
                      onCheckedChange={(checked) =>
                        handleAdminSettingChange("audit_logs_enabled", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                    <div className="space-y-1">
                      <p className="font-medium text-red-900">Maintenance Mode</p>
                      <p className="text-sm text-red-700">
                        Put platform in maintenance mode
                      </p>
                    </div>
                    <Switch
                      checked={adminSettings.maintenance_mode}
                      onCheckedChange={(checked) =>
                        handleAdminSettingChange("maintenance_mode", checked)
                      }
                    />
                  </div>
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

        <ImageCropper
          image={selectedImage}
          open={showCropper}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      </DashboardLayout>
    </>
  );
}