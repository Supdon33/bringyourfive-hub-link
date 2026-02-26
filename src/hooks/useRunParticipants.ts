import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RUNS_QUERY_KEY } from "@/hooks/useRuns";

export interface RunParticipant {
  id: string;
  run_id: string;
  user_id: string;
  display_name: string;
  joined_at: string;
}

export const useRunParticipants = (runId: string) => {
  return useQuery({
    queryKey: ["run_participants", runId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("run_participants")
        .select("*")
        .eq("run_id", runId)
        .order("joined_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as RunParticipant[];
    },
    enabled: !!runId,
  });
};

export const useJoinRun = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      runId,
      userId,
      displayName,
    }: {
      runId: string;
      userId: string;
      displayName: string;
    }) => {
      // Insert participant
      const { error: joinError } = await supabase
        .from("run_participants")
        .insert({ run_id: runId, user_id: userId, display_name: displayName });
      if (joinError) throw joinError;

      // Increment spots_filled
      const { error: updateError } = await supabase.rpc("increment_spots_filled" as any, { run_id_input: runId });
      if (updateError) throw updateError;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["run_participants", variables.runId] });
      queryClient.invalidateQueries({ queryKey: RUNS_QUERY_KEY });
    },
  });
};

export const useLeaveRun = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ runId, userId }: { runId: string; userId: string }) => {
      const { error: leaveError } = await supabase
        .from("run_participants")
        .delete()
        .eq("run_id", runId)
        .eq("user_id", userId);
      if (leaveError) throw leaveError;

      const { error: updateError } = await supabase.rpc("decrement_spots_filled" as any, { run_id_input: runId });
      if (updateError) throw updateError;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["run_participants", variables.runId] });
      queryClient.invalidateQueries({ queryKey: RUNS_QUERY_KEY });
    },
  });
};
