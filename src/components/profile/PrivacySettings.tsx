import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { settingsService } from "@/services/settingsService";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, MessageCircle } from "lucide-react";

interface PrivacySettingsProps {
  userId: string;
}

export function PrivacySettings({ userId }: PrivacySettingsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    profile_visibility: "public" as "public" | "friends" | "private",
    show_online_status: true,
    allow_messages_from: "everyone" as "everyone" | "friends" | "nobody",
  });

  useEffect(() => {
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getUserSettings(userId);
      if (data) {
        setSettings({
          profile_visibility: (data.profile_visibility as any) ?? "public",
          show_online_status: data.show_online_status ?? true,
          allow_messages_from: (data.allow_messages_from as any) ?? "everyone",
        });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.updateSettings(userId, settings);
      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">Loading settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-500" />
          <CardTitle>Privacy Settings</CardTitle>
        </div>
        <CardDescription>
          Control who can see your information and interact with you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-visibility" className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              Profile Visibility
            </Label>
            <Select
              value={settings.profile_visibility}
              onValueChange={(value: any) =>
                setSettings(prev => ({ ...prev, profile_visibility: value }))
              }
            >
              <SelectTrigger id="profile-visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can see</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Private - Only you</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Control who can view your profile information
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Online Status</Label>
              <p className="text-sm text-gray-500">
                Let others see when you're online
              </p>
            </div>
            <Switch
              checked={settings.show_online_status}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, show_online_status: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allow-messages" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
              Allow Messages From
            </Label>
            <Select
              value={settings.allow_messages_from}
              onValueChange={(value: any) =>
                setSettings(prev => ({ ...prev, allow_messages_from: value }))
              }
            >
              <SelectTrigger id="allow-messages">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="nobody">Nobody</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Control who can send you messages
            </p>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Privacy Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}