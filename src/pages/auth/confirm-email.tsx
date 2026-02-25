import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/router";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ConfirmEmail() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Check for token in URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const type = hashParams.get("type");

      if (!accessToken || type !== "signup") {
        setStatus("error");
        setMessage("Invalid confirmation link. Please try again or request a new confirmation email.");
        return;
      }

      try {
        // Exchange token for session
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get("refresh_token") || "",
        });

        if (error) throw error;

        setStatus("success");
        setMessage("Email confirmed successfully! Redirecting to login...");

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } catch (error: any) {
        console.error("Error confirming email:", error);
        setStatus("error");
        setMessage(error.message || "Failed to confirm email. Please try again.");
      }
    };

    handleEmailConfirmation();
  }, [router]);

  return (
    <>
      <SEO 
        title="Confirm Email - Pukaarly"
        description="Confirm your email address"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="space-y-1 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="mx-auto mb-4"
              >
                {status === "loading" && (
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                  </div>
                )}
                {status === "success" && (
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                )}
                {status === "error" && (
                  <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                )}
              </motion.div>
              
              <CardTitle className="text-2xl font-bold">
                {status === "loading" && "Confirming Email..."}
                {status === "success" && "Email Confirmed!"}
                {status === "error" && "Confirmation Failed"}
              </CardTitle>
              <CardDescription>
                {status === "loading" && "Please wait while we verify your email address"}
                {status === "success" && "Your account is now active"}
                {status === "error" && "We couldn't confirm your email"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {status === "success" && (
                  <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      {message}
                    </AlertDescription>
                  </Alert>
                )}
                
                {status === "error" && (
                  <div className="space-y-4">
                    <Alert variant="destructive">
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                    
                    <div className="flex flex-col gap-2">
                      <Link href="/auth/login">
                        <Button className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Back to Login
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button variant="outline" className="w-full">
                          Create New Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                
                {status === "loading" && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}