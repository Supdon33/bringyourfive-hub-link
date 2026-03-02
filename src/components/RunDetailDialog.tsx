import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRunParticipants, useJoinRun, useLeaveRun } from "@/hooks/useRunParticipants";
import { Users, UserPlus, UserMinus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SkillLevel } from "@/components/GameCard";

interface RunDetailDialogProps {
  open: boolean;
  onClose: () => void;
  run: {
    id: string;
    title: string;
    gymName: string;
    location: string;
    time: string;
    skillLevel: SkillLevel;
    spotsTotal: number;
    spotsFilled: number;
  } | null;
}

const skillLabels: Record<SkillLevel, string> = {
  elementary: "Elementary",
  highschool_male: "High School Male",
  highschool_female: "High School Female",
  college: "College",
  adult: "Adult",
};

const RunDetailDialog = ({ open, onClose, run }: RunDetailDialogProps) => {
  const { user, username } = useAuth();
  const { toast } = useToast();
  const { data: participants = [], isLoading } = useRunParticipants(run?.id ?? "");
  const joinRun = useJoinRun();
  const leaveRun = useLeaveRun();

  if (!run) return null;

  const alreadyJoined = participants.some((p) => p.user_id === user?.id);
  const spotsLeft = run.spotsTotal - run.spotsFilled;
  const isFull = spotsLeft <= 0;

  const handleJoin = async () => {
    if (!user) return;
    const displayName = username || user.user_metadata?.first_name || user.email || "Player";
    try {
      await joinRun.mutateAsync({ runId: run.id, userId: user.id, displayName });
      toast({ title: "You're in!", description: "You joined the run." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleLeave = async () => {
    if (!user) return;
    try {
      await leaveRun.mutateAsync({ runId: run.id, userId: user.id });
      toast({ title: "Left run", description: "You left the run." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Build slot list
  const slots = Array.from({ length: run.spotsTotal }, (_, i) => {
    const participant = participants[i];
    return participant ? participant.display_name : null;
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{run.title}</DialogTitle>
          <p className="text-muted-foreground text-sm">
            {run.gymName} · {run.location} · {run.time} · {skillLabels[run.skillLevel]}
          </p>
        </DialogHeader>

        <div className="mt-2">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Player Roster ({run.spotsFilled}/{run.spotsTotal})
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ol className="space-y-1.5">
              {slots.map((name, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                    name
                      ? "bg-primary/10 text-foreground"
                      : "bg-secondary/50 text-muted-foreground italic"
                  }`}
                >
                  <span className="font-mono text-xs w-5 text-right text-muted-foreground">
                    {i + 1}.
                  </span>
                  {name ?? "Open Spot"}
                </li>
              ))}
            </ol>
          )}
        </div>

        {user && (
          <div className="mt-4">
            {alreadyJoined ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLeave}
                disabled={leaveRun.isPending}
              >
                <UserMinus className="w-4 h-4 mr-2" />
                {leaveRun.isPending ? "Leaving…" : "Leave Run"}
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleJoin}
                disabled={isFull || joinRun.isPending}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {joinRun.isPending ? "Joining…" : isFull ? "Run Full" : "Join Run"}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RunDetailDialog;
