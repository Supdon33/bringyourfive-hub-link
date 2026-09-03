import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface ParentalControls {
  restrictSocialFeatures?: boolean;
  restrictInAppPurchases?: boolean;
  pinCode?: string;
}

interface ParentalControlsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ParentalControlsDialog = ({
  open,
  onOpenChange,
}: ParentalControlsDialogProps) => {
  const { user } = useAuth();
  const [restrictSocial, setRestrictSocial] = useState(false);
  const [restrictPurchases, setRestrictPurchases] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !user) return;

    const loadControls = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("parental_controls")
        .eq("user_id", user.id)
        .single();

      const controls: ParentalControls = (data?.parental_controls as ParentalControls) || {};
      setRestrictSocial(!!controls.restrictSocialFeatures);
      setRestrictPurchases(!!controls.restrictInAppPurchases);
      setPin(controls.pinCode || "");
      setConfirmPin(controls.pinCode || "");
      setLoading(false);
    };

    loadControls();
  }, [open, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (pin && pin !== confirmPin) {
      toast({
        title: "PINs do not match",
        description: "Please make sure the PIN and confirmation match.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const controls: ParentalControls = {
      restrictSocialFeatures: restrictSocial,
      restrictInAppPurchases: restrictPurchases,
      pinCode: pin || undefined,
    };

    const { error } = await supabase
      .from("profiles")
      .update({ parental_controls: controls })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast({
        title: "Could not save parental controls",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Parental controls saved" });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Parental Controls</DialogTitle>
          <DialogDescription>
            Manage restrictions for this account. A PIN can be set to prevent
            changes without permission.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Loading…
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5 mt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="restrict-social">Restrict Social Features</Label>
                <p className="text-xs text-muted-foreground">
                  Limits joining or creating runs and viewing participant details.
                </p>
              </div>
              <Switch
                id="restrict-social"
                checked={restrictSocial}
                onCheckedChange={setRestrictSocial}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="restrict-purchases">Restrict In-App Purchases</Label>
                <p className="text-xs text-muted-foreground">
                  Blocks subscription and upgrade purchases inside the app.
                </p>
              </div>
              <Switch
                id="restrict-purchases"
                checked={restrictPurchases}
                onCheckedChange={setRestrictPurchases}
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <Label htmlFor="pin">Parent PIN (optional)</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="4–6 digit PIN"
              />
              <Label htmlFor="confirm-pin">Confirm PIN</Label>
              <Input
                id="confirm-pin"
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Re-enter PIN"
              />
              <p className="text-xs text-muted-foreground">
                Setting a PIN prevents anyone without it from changing these
                controls.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving…" : "Save Parental Controls"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ParentalControlsDialog;
