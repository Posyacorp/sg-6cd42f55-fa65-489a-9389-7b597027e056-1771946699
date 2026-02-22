import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/router";
import { Lock, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkRecoveryToken = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setValidToken(true);
        } else {
          setError("Invalid or expired reset link. Please request a new one.");
        }
      } catch (err) {
        setError("Invalid or expired reset link. Please request a new one.");
      } finally {
        setCheckingToken(false);
      }
    };

    checkRecoveryToken();
  }, []);

  const validatePassword = () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      setSuccess(true);

      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <>
        <SEO 
          title="Reset Password - Pukaarly"
          description="Reset your Pukaarly account password"
        />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-8 w-8 text-primary mb-4" />
                  </motion.div>
                  <motion.p 
                    className="text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Verifying reset link...
                  </motion.p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  if (!validToken) {
    return (
      <>
        <SEO 
          title="Reset Password - Pukaarly"
          description="Reset your Pukaarly account password"
        />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <CardTitle>Invalid Reset Link</CardTitle>
                  <CardDescription>
                    This password reset link is invalid or has expired
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <Link href="/auth/forgot-password">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full">
                        Request New Reset Link
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Reset Password - Pukaarly"
        description="Reset your Pukaarly account password"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="space-y-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <CardTitle className="text-2xl font-bold">Create New Password</CardTitle>
                  <CardDescription>
                    Enter your new password below
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </motion.div>
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                        >
                          <p className="font-semibold mb-2">Password reset successful!</p>
                          <p className="text-sm">
                            Your password has been updated. Redirecting to login page...
                          </p>
                        </motion.div>
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters long
                      </p>
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={loading}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={loading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={loading || !password || !confirmPassword}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Resetting Password...
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Reset Password
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}