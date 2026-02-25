import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SetupAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("testadmin@pukaarly.com");
  const [password, setPassword] = useState("Admin123456!");
  const [fullName, setFullName] = useState("Test Admin");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const createAdminAccount = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'admin'
          }
        }
      });

      if (authError) {
        setMessage({ type: 'error', text: `Auth Error: ${authError.message}` });
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setMessage({ type: 'error', text: 'Failed to create user' });
        setLoading(false);
        return;
      }

      // Step 2: Update profile to admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin',
          full_name: fullName
        })
        .eq('id', authData.user.id);

      if (profileError) {
        setMessage({ type: 'error', text: `Profile Error: ${profileError.message}` });
        setLoading(false);
        return;
      }

      // Step 3: Initialize wallet
      const { error: walletError } = await supabase
        .from('wallets')
        .insert({
          user_id: authData.user.id,
          coins_balance: 10000,
          beans_balance: 0,
          tokens_balance: 0
        });

      if (walletError) {
        console.error('Wallet creation error:', walletError);
      }

      setMessage({ 
        type: 'success', 
        text: `✅ Admin account created successfully!\n\nEmail: ${email}\nPassword: ${password}\n\nRedirecting to login...` 
      });

      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);

    } catch (error: any) {
      setMessage({ type: 'error', text: `Unexpected error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">🔐 Setup Admin Account</CardTitle>
          <CardDescription>
            Create a test admin account for development and testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Test Admin"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="testadmin@pukaarly.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin123456!"
            />
          </div>

          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription className="whitespace-pre-line">
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={createAdminAccount}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? "Creating Admin Account..." : "Create Admin Account"}
          </Button>

          <div className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => router.push('/auth/login')}
            >
              Login here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}