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
  username: string | null;
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
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const [{ data: subs }, { data: profile }] = await Promise.all([
            supabase.from("subscriptions").select("tier, status").eq("user_id", session.user.id).eq("status", "active"),
            supabase.from("profiles").select("username").eq("user_id", session.user.id).single(),
          ]);
          setSubscriptions((subs as Subscription[]) || []);
          setUsername(profile?.username ?? null);
        } else {
          setSubscriptions([]);
          setUsername(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        Promise.all([
          supabase.from("subscriptions").select("tier, status").eq("user_id", session.user.id).eq("status", "active"),
          supabase.from("profiles").select("username").eq("user_id", session.user.id).single(),
        ]).then(([{ data: subs }, { data: profile }]) => {
          setSubscriptions((subs as Subscription[]) || []);
          setUsername(profile?.username ?? null);
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
    setUsername(null);
  }, []);

  useInactivityTimeout(signOut, !!user);

  return (
    <AuthContext.Provider value={{ user, session, loading, username, subscriptions, hasActiveSub, hasTier, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
