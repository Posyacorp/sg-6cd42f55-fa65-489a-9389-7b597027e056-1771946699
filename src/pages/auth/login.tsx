import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { authService } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user, error } = await authService.signIn(email, password);

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (user) {
        toast({
          title: "Login successful",
          description: "Redirecting to your dashboard...",
        });

        // Get user role from profiles table
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        const role = profileData?.role || "user";

        // Redirect based on role
        switch (role) {
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "agency":
            router.push("/agency/dashboard");
            break;
          case "anchor":
            router.push("/anchor/dashboard");
            break;
          default:
            router.push("/user/dashboard");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: "user" | "anchor" | "agency" | "admin") => {
    const demoCredentials = {
      user: { email: "user@demo.com", password: "demo123456" },
      anchor: { email: "anchor@demo.com", password: "demo123456" },
      agency: { email: "agency@demo.com", password: "demo123456" },
      admin: { email: "admin@demo.com", password: "demo123456" },
    };

    const credentials = demoCredentials[role];
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  return (
    <>
      <SEO title="Login - Pukaarly" description="Login to your Pukaarly account" />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Coins className="w-7 h-7 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                Login to continue earning rewards
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex justify-end">
                    <Link 
                      href="/auth/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-purple-600 hover:text-purple-700 font-semibold">
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="text-center">🎭 Demo Accounts</CardTitle>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Click to auto-fill credentials and explore different dashboards
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleDemoLogin("user")}
                  variant="outline"
                  className="w-full h-14 justify-start text-left hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div>
                      <div className="font-semibold">Regular User</div>
                      <div className="text-xs text-gray-500">user@demo.com</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleDemoLogin("anchor")}
                  variant="outline"
                  className="w-full h-14 justify-start text-left hover:bg-purple-50 dark:hover:bg-purple-950"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xl">
                      ⭐
                    </div>
                    <div>
                      <div className="font-semibold">Anchor (Host)</div>
                      <div className="text-xs text-gray-500">anchor@demo.com</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleDemoLogin("agency")}
                  variant="outline"
                  className="w-full h-14 justify-start text-left hover:bg-green-50 dark:hover:bg-green-950"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-xl">
                      🏢
                    </div>
                    <div>
                      <div className="font-semibold">Agency Manager</div>
                      <div className="text-xs text-gray-500">agency@demo.com</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleDemoLogin("admin")}
                  variant="outline"
                  className="w-full h-14 justify-start text-left hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-xl">
                      ⚡
                    </div>
                    <div>
                      <div className="font-semibold">Administrator</div>
                      <div className="text-xs text-gray-500">admin@demo.com</div>
                    </div>
                  </div>
                </Button>

                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    <strong>Demo Password:</strong> demo123456
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    All demo accounts use the same password for easy testing
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}