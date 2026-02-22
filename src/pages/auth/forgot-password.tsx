import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Forgot Password - Pukaarly"
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
                <div className="flex items-center justify-between">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Link href="/auth/login">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="sm">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Login
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <CardDescription>
                    Enter your email address and we&apos;ll send you a link to reset your password
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
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      >
                        <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </motion.div>
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                        >
                          <p className="font-semibold mb-2">Check your email!</p>
                          <p className="text-sm">
                            We&apos;ve sent a password reset link to <strong>{email}</strong>
                          </p>
                          <p className="text-sm mt-2">
                            Click the link in the email to reset your password. The link will expire in 1 hour.
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
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
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
                          disabled={loading || !email}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Sending Reset Link...
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Reset Link
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>
                )}

                <motion.div 
                  className="mt-6 text-center text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <p>
                    Remember your password?{" "}
                    <Link 
                      href="/auth/login" 
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              </CardContent>
            </Card>

            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <p className="text-xs text-muted-foreground">
                Having trouble? Contact{" "}
                <a 
                  href="mailto:support@pukaarly.com" 
                  className="text-primary hover:underline"
                >
                  support@pukaarly.com
                </a>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}