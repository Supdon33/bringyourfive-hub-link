import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountDialog = ({ open, onOpenChange }: AccountDialogProps) => {
  const { user, username } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      toast({
        title: "Account deleted",
        description: "Your account and data have been permanently removed.",
      });
      await supabase.auth.signOut();
      window.location.replace("/");
    } catch (e: any) {
      toast({
        title: "Could not delete account",
        description: e?.message ?? "Please try again or contact support.",
        variant: "destructive",
      });
      setDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Account</DialogTitle>
            <DialogDescription>
              Manage your account settings and data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="rounded-md border border-border bg-secondary/40 p-4 space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Username: </span>
                <span className="text-foreground">{username || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email: </span>
                <span className="text-foreground break-all">{user?.email}</span>
              </div>
            </div>

            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4">
              <h4 className="font-display text-base text-foreground mb-1">
                Delete Account
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Permanently delete your account, profile, subscriptions, and
                run participation. This cannot be undone.
              </p>
              <Button
                variant="destructive"
                onClick={() => {
                  setConfirmText("");
                  setConfirmOpen(true);
                }}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove your account and all associated
              data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="confirm-delete">
              Type <span className="font-semibold text-foreground">DELETE</span> to confirm
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={confirmText !== "DELETE" || deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Permanently Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AccountDialog;
