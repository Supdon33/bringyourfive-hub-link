import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const MIN_AGE = 13;

const AgeGate = () => {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [dob, setDob] = useState("");
  const [saving, setSaving] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (loading || !user) return;

    const checkDob = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("date_of_birth")
        .eq("user_id", user.id)
        .single();

      if (!data?.date_of_birth) {
        setOpen(true);
      }
    };

    checkDob();
  }, [user, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob || !user) return;

    setSaving(true);

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < MIN_AGE) {
      setSaving(false);
      setBlocked(true);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ date_of_birth: dob })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast({
        title: "Could not save date of birth",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setOpen(false);
      toast({
        title: "Age verified",
        description: "You can now use Bring Your 5.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" hideClose>
        <DialogHeader>
          <DialogTitle>Age Verification</DialogTitle>
          <DialogDescription>
            Please confirm your date of birth to continue using Bring Your 5.
            You must be at least {MIN_AGE} years old.
          </DialogDescription>
        </DialogHeader>

        {blocked ? (
          <div className="space-y-4 mt-2">
            <p className="text-sm text-destructive">
              You must be at least {MIN_AGE} years old to use this app. If you
              believe this is an error, please contact support at{" "}
              <a
                href="mailto:coach.bringyour5@gmail.com"
                className="underline underline-offset-2"
              >
                coach.bringyour5@gmail.com
              </a>
              .
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Verifying…" : "Continue"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              This information is used only for age assurance and is not
              shared publicly.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AgeGate;
