import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff,
  Settings,
  Radio,
  Users,
  Gift,
  TrendingUp,
  Loader2
} from "lucide-react";
import { streamService } from "@/services/streamService";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

export default function GoLivePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<any>(null);

  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);
  const [currentStream, setCurrentStream] = useState<any>(null);
  
  // Stream settings
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [streamType, setStreamType] = useState<"video" | "audio">("video");
  
  // Stream stats
  const [viewerCount, setViewerCount] = useState(0);
  const [coinsReceived, setCoinsReceived] = useState(0);
  
  // Device controls
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading]);

  useEffect(() => {
    return () => {
      stopPreview();
      if (channelRef.current) {
        streamService.unsubscribeFromStream(channelRef.current);
      }
    };
  }, []);

  const startPreview = async () => {
    try {
      const constraints = {
        video: streamType === "video" ? { width: 1280, height: 720 } : false,
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setPreviewActive(true);
      
      toast({
        title: "Preview Started",
        description: "Camera and microphone ready",
      });
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera and microphone access",
        variant: "destructive",
      });
    }
  };

  const stopPreview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setPreviewActive(false);
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const goLive = async () => {
    if (!user || !title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a stream title",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create stream in database
      const { success, data, error } = await streamService.createStream(user.id, {
        title: title.trim(),
        description: description.trim(),
        stream_type: streamType,
      });

      if (!success || !data) {
        throw new Error(error?.message || "Failed to create stream");
      }

      // Start the stream (in production, this would involve WebRTC/RTMP setup)
      const streamUrl = `https://stream.pukaarly.com/live/${data.id}`;
      const { success: startSuccess } = await streamService.startStream(data.id, streamUrl);

      if (!startSuccess) {
        throw new Error("Failed to start stream");
      }

      setCurrentStream(data);
      setIsLive(true);

      // Subscribe to realtime updates
      channelRef.current = streamService.subscribeToStream(data.id, {
        onViewerCountChange: (count) => setViewerCount(count),
        onGiftReceived: (gift) => {
          setCoinsReceived((prev) => prev + gift.coin_price);
          toast({
            title: "Gift Received! 🎁",
            description: `${gift.quantity}x ${gift.name}`,
          });
        },
      });

      toast({
        title: "🔴 You're Live!",
        description: "Stream started successfully",
      });
    } catch (error: any) {
      console.error("Error going live:", error);
      toast({
        title: "Failed to Go Live",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const endStream = async () => {
    if (!currentStream) return;

    try {
      setLoading(true);

      const { success } = await streamService.endStream(currentStream.id);

      if (!success) {
        throw new Error("Failed to end stream");
      }

      // Stop media tracks
      stopPreview();

      // Unsubscribe from realtime
      if (channelRef.current) {
        streamService.unsubscribeFromStream(channelRef.current);
      }

      setIsLive(false);
      setCurrentStream(null);
      setViewerCount(0);

      toast({
        title: "Stream Ended",
        description: `You earned ${coinsReceived} coins!`,
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/anchor/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Error ending stream:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout role="anchor">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="anchor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Go Live</h1>
            <p className="text-muted-foreground">Start your live stream</p>
          </div>
          {isLive && (
            <Badge variant="destructive" className="gap-2 px-4 py-2">
              <Radio className="h-4 w-4 animate-pulse" />
              LIVE
            </Badge>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Preview */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="relative bg-black aspect-video rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {!previewActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Camera Preview Inactive</p>
                        <p className="text-sm text-gray-400">Click "Start Preview" to begin</p>
                      </div>
                    </div>
                  )}

                  {/* Live Overlay */}
                  {isLive && (
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <Badge variant="destructive" className="gap-2">
                        <Radio className="h-3 w-3 animate-pulse" />
                        LIVE
                      </Badge>
                      <Badge variant="secondary" className="gap-2">
                        <Users className="h-3 w-3" />
                        {viewerCount}
                      </Badge>
                    </div>
                  )}

                  {/* Controls Overlay */}
                  {previewActive && (
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
                      <Button
                        size="icon"
                        variant={videoEnabled ? "secondary" : "destructive"}
                        onClick={toggleVideo}
                      >
                        {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                      </Button>
                      <Button
                        size="icon"
                        variant={audioEnabled ? "secondary" : "destructive"}
                        onClick={toggleAudio}
                      >
                        {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                      </Button>
                      <Button size="icon" variant="secondary">
                        <Settings className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {!isLive ? (
              <div className="flex gap-3">
                {!previewActive ? (
                  <Button onClick={startPreview} className="flex-1">
                    <Video className="w-4 h-4 mr-2" />
                    Start Preview
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopPreview} variant="outline" className="flex-1">
                      Stop Preview
                    </Button>
                    <Button 
                      onClick={goLive} 
                      disabled={loading || !title.trim()}
                      className="flex-1 bg-red-500 hover:bg-red-600"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Radio className="w-4 h-4 mr-2" />
                          Go Live
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <Button 
                onClick={endStream} 
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ending...
                  </>
                ) : (
                  "End Stream"
                )}
              </Button>
            )}
          </div>

          {/* Stream Settings & Stats */}
          <div className="space-y-4">
            {/* Settings */}
            {!isLive && (
              <Card>
                <CardHeader>
                  <CardTitle>Stream Settings</CardTitle>
                  <CardDescription>Configure your live stream</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Stream Title *</Label>
                    <Input
                      id="title"
                      placeholder="What's happening?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell viewers what to expect..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Stream Type</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={streamType === "video" ? "default" : "outline"}
                        onClick={() => setStreamType("video")}
                        className="flex-1"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Video
                      </Button>
                      <Button
                        variant={streamType === "audio" ? "default" : "outline"}
                        onClick={() => setStreamType("audio")}
                        className="flex-1"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Audio
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Live Stats */}
            {isLive && (
              <Card>
                <CardHeader>
                  <CardTitle>Live Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Viewers</span>
                    </div>
                    <span className="text-2xl font-bold">{viewerCount}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Coins</span>
                    </div>
                    <span className="text-2xl font-bold">{coinsReceived}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Engagement</span>
                    </div>
                    <Badge variant="secondary">High</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Pro Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use good lighting for better video quality</li>
                  <li>• Test your audio before going live</li>
                  <li>• Engage with viewers in chat</li>
                  <li>• Stream during peak hours for more viewers</li>
                  <li>• Create an interesting title</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Note */}
        <Alert>
          <AlertDescription>
            <strong>Note:</strong> This is a demo implementation. In production, you would integrate 
            with a WebRTC server (like Agora, Twilio, or custom RTMP server) for actual live streaming.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
}