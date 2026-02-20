import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SkillLevel } from "@/components/GameCard";

export const RUNS_QUERY_KEY = ["runs"];

export interface Run {
  id: string;
  title: string;
  location: string;
  time: string;
  skill_level: string;
  spots_total: number;
  spots_filled: number;
  gym_name: string;
}

export const useRuns = (skillFilter: SkillLevel | "all" = "all") => {
  return useQuery({
    queryKey: [...RUNS_QUERY_KEY, skillFilter],
    queryFn: async () => {
      let query = supabase
        .from("runs")
        .select("id, title, location, time, skill_level, spots_total, spots_filled, gym_name")
        .order("created_at", { ascending: false });

      if (skillFilter !== "all") {
        query = query.eq("skill_level", skillFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Run[];
    },
  });
};
