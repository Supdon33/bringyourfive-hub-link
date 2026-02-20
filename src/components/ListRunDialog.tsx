import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { RUNS_QUERY_KEY } from "@/hooks/useRuns";
import type { SkillLevel } from "@/components/GameCard";

interface ListRunDialogProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
  gyms: { name: string }[];
}

const ListRunDialog = ({ open, onClose, onAdded, gyms }: ListRunDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [gymName, setGymName] = useState(gyms[0]?.name ?? "");
  const [time, setTime] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("adult");
  const [spotsTotal, setSpotsTotal] = useState(10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("runs").insert({
      user_id: user.id,
      title,
      location,
      gym_name: gymName,
      time,
      skill_level: skillLevel,
      spots_total: spotsTotal,
      spots_filled: 0,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Run listed!" });
      setTitle(""); setLocation(""); setGymName(""); setTime(""); setSpotsTotal(10);
      queryClient.invalidateQueries({ queryKey: RUNS_QUERY_KEY });
      onAdded();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">List a Run</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 5v5 Open Run" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div>
              <Label>Gym</Label>
              <select
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                {gyms.map((g) => (
                  <option key={g.name} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Time</Label>
              <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 6:00 PM" required />
            </div>
            <div>
              <Label>Total Spots</Label>
              <Input type="number" value={spotsTotal} onChange={(e) => setSpotsTotal(Number(e.target.value))} min={2} required />
            </div>
          </div>
          <div>
            <Label>Skill Level</Label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="elementary">Elementary</option>
              <option value="highschool">High School</option>
              <option value="college">College</option>
              <option value="adult">Adult</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Listing…" : "List Run"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ListRunDialog;
