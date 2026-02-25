import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { settingsService } from "@/services/settingsService";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Instagram, Twitter, Youtube, Music, Globe } from "lucide-react";

interface SocialLinksProps {
  userId: string;
}

export function SocialLinks({ userId }: SocialLinksProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [links, setLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    website: "",
  });

  useEffect(() => {
    loadLinks();
  }, [userId]);

  const loadLinks = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getSocialLinks(userId);
      if (data) {
        setLinks({
          facebook: data.facebook ?? "",
          instagram: data.instagram ?? "",
          twitter: data.twitter ?? "",
          youtube: data.youtube ?? "",
          tiktok: data.tiktok ?? "",
          website: data.website ?? "",
        });
      }
    } catch (error) {
      console.error("Failed to load social links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.updateSocialLinks(userId, links);
      toast({
        title: "Social Links Updated",
        description: "Your social media profiles have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update social links. Please try again.",
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
          <div className="text-center text-gray-500">Loading social links...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-500" />
          <CardTitle>Social Media Links</CardTitle>
        </div>
        <CardDescription>
          Connect your social media profiles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook" className="flex items-center gap-2">
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </Label>
            <Input
              id="facebook"
              placeholder="https://facebook.com/yourprofile"
              value={links.facebook}
              onChange={(e) => setLinks(prev => ({ ...prev, facebook: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-500" />
              Instagram
            </Label>
            <Input
              id="instagram"
              placeholder="https://instagram.com/yourprofile"
              value={links.instagram}
              onChange={(e) => setLinks(prev => ({ ...prev, instagram: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <Twitter className="w-4 h-4 text-blue-400" />
              Twitter / X
            </Label>
            <Input
              id="twitter"
              placeholder="https://twitter.com/yourprofile"
              value={links.twitter}
              onChange={(e) => setLinks(prev => ({ ...prev, twitter: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube" className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-600" />
              YouTube
            </Label>
            <Input
              id="youtube"
              placeholder="https://youtube.com/@yourchannel"
              value={links.youtube}
              onChange={(e) => setLinks(prev => ({ ...prev, youtube: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiktok" className="flex items-center gap-2">
              <Music className="w-4 h-4 text-black" />
              TikTok
            </Label>
            <Input
              id="tiktok"
              placeholder="https://tiktok.com/@yourprofile"
              value={links.tiktok}
              onChange={(e) => setLinks(prev => ({ ...prev, tiktok: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-500" />
              Website
            </Label>
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
              value={links.website}
              onChange={(e) => setLinks(prev => ({ ...prev, website: e.target.value }))}
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Social Links"}
        </Button>
      </CardContent>
    </Card>
  );
}