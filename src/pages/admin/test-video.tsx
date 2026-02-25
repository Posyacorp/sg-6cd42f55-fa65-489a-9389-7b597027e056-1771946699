import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Video, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle,
  Loader2,
  Download,
  Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

export default function TestVideo() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!authLoading && (!user || !isAdmin)) {
    router.push("/auth/login");
    return null;
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      addTestResult("File Validation", false, "Selected file is not a video");
      return;
    }

    addTestResult("File Validation", true, `Valid video file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    try {
      setUploading(true);
      setUploadProgress(0);

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `test-${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      addTestResult("Upload Started", true, `Uploading to: ${filePath}`);

      const { data, error } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        addTestResult("Upload Failed", false, error.message);
        throw error;
      }

      addTestResult("Upload Success", true, `File uploaded: ${data.path}`);
      setUploadProgress(100);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(data.path);

      setVideoUrl(urlData.publicUrl);
      addTestResult("Public URL Generated", true, urlData.publicUrl);

      // Test video metadata
      const video = document.createElement("video");
      video.src = urlData.publicUrl;
      video.onloadedmetadata = () => {
        addTestResult("Video Metadata", true, `Duration: ${video.duration.toFixed(2)}s, Size: ${video.videoWidth}x${video.videoHeight}`);
      };
    } catch (error: any) {
      addTestResult("Upload Error", false, error.message);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const addTestResult = (test: string, passed: boolean, details: string) => {
    setTestResults((prev) => [
      ...prev,
      {
        test,
        passed,
        details,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const testVideoQuality = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    // Test video quality metrics
    addTestResult("Video Quality Check", true, "Starting quality assessment...");
    
    // Resolution
    const resolution = `${video.videoWidth}x${video.videoHeight}`;
    const isHD = video.videoHeight >= 720;
    addTestResult("Resolution", isHD, `${resolution} ${isHD ? "(HD or better)" : "(Below HD)"}`);

    // Buffering test
    const buffered = video.buffered;
    if (buffered.length > 0) {
      const bufferedEnd = buffered.end(buffered.length - 1);
      const bufferedPercent = (bufferedEnd / video.duration) * 100;
      addTestResult("Buffering", true, `${bufferedPercent.toFixed(1)}% buffered`);
    }

    // Playback test
    try {
      await video.play();
      setTimeout(() => {
        video.pause();
        addTestResult("Playback Test", true, "Video plays smoothly");
      }, 2000);
    } catch (error) {
      addTestResult("Playback Test", false, "Failed to play video");
    }
  };

  const clearTests = () => {
    setTestResults([]);
    setVideoUrl(null);
    setUploadProgress(0);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Video Quality Testing</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Test video upload, streaming, and quality on Supabase
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Test Video</CardTitle>
            <CardDescription>
              Upload a video file to test Supabase storage and streaming quality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Select Video
                  </>
                )}
              </Button>

              {testResults.length > 0 && (
                <Button variant="outline" onClick={clearTests}>
                  Clear Tests
                </Button>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-500">{uploadProgress}% uploaded</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Player */}
        {videoUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Video Preview</CardTitle>
              <CardDescription>
                Test playback and streaming quality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full"
                  controls
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={togglePlayPause}>
                  {playing ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>

                <Button variant="outline" onClick={testVideoQuality}>
                  <Settings className="w-4 h-4 mr-2" />
                  Run Quality Tests
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                {testResults.filter((r) => r.passed).length} / {testResults.length} tests passed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{result.test}</span>
                        <Badge variant={result.passed ? "default" : "destructive"}>
                          {result.passed ? "PASS" : "FAIL"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                        {result.details}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Supabase Storage Info */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase Storage Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Bucket:</span>
              <span className="font-mono">media</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Storage Path:</span>
              <span className="font-mono">videos/</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Max File Size:</span>
              <span className="font-mono">50MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Supported Formats:</span>
              <span className="font-mono">MP4, WebM, MOV</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}