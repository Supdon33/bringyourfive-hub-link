import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";
import type { User, Session } from "@supabase/supabase-js";

interface Subscription {
  tier: "tier1" | "tier2" | "gym_listing";
  status: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscriptions: Subscription[];
  hasActiveSub: boolean;
  hasTier: (tier: "tier1" | "tier2" | "gym_listing") => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch subscriptions
          const { data } = await supabase
            .from("subscriptions")
            .select("tier, status")
            .eq("user_id", session.user.id)
            .eq("status", "active");
          setSubscriptions((data as Subscription[]) || []);
        } else {
          setSubscriptions([]);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("subscriptions")
          .select("tier, status")
          .eq("user_id", session.user.id)
          .eq("status", "active")
          .then(({ data }) => {
            setSubscriptions((data as Subscription[]) || []);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => authListener.unsubscribe();
  }, []);

  const hasActiveSub = subscriptions.length > 0;

  const hasTier = (tier: "tier1" | "tier2" | "gym_listing") =>
    subscriptions.some((s) => s.tier === tier && s.status === "active");

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setSubscriptions([]);
  }, []);

  useInactivityTimeout(signOut, !!user);

  return (
    <AuthContext.Provider value={{ user, session, loading, subscriptions, hasActiveSub, hasTier, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
