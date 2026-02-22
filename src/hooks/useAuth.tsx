import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isAgency: boolean;
  isAnchor: boolean;
  profile: any | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false,
    isAgency: false,
    isAnchor: false,
    profile: null,
  });
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthChange = async (session: Session | null) => {
    if (!session?.user) {
      setState({
        user: null,
        session: null,
        loading: false,
        isAdmin: false,
        isAgency: false,
        isAnchor: false,
        profile: null,
      });
      return;
    }

    // Check role from metadata or profile
    // For now we'll fetch the profile to be sure about the role
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    const role = profile?.role || "user";

    setState({
      user: session.user,
      session,
      loading: false,
      isAdmin: role === "admin",
      isAgency: role === "agency",
      isAnchor: role === "anchor",
      profile,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return {
    ...state,
    signOut,
  };
}