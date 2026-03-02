import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useRunNotifications = () => {
  const { toast } = useToast();
  const { user, hasTier } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("new-runs")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "runs" },
        async (payload) => {
          const newRun = payload.new as { title: string; state: string | null; gym_name: string; user_id: string };

          // Don't notify the user who created the run
          if (newRun.user_id === user.id) return;

          const isPremium = hasTier("tier2");

          if (isPremium) {
            // Premium users get notified for all new runs
            toast({
              title: "🏀 New Run Listed!",
              description: `${newRun.title} at ${newRun.gym_name}${newRun.state ? ` in ${newRun.state}` : ""}`,
            });
          } else {
            // Basic users only get notified for runs in their state
            const { data: profile } = await supabase
              .from("profiles")
              .select("home_state")
              .eq("user_id", user.id)
              .single();

            if (profile?.home_state && newRun.state === profile.home_state) {
              toast({
                title: "🏀 New Run in Your State!",
                description: `${newRun.title} at ${newRun.gym_name}`,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, hasTier, toast]);
};
