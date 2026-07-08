import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  configurePurchases,
  getOfferings,
  isNativeIOS,
  purchasePackage,
  restorePurchases,
} from "@/lib/purchases";
import type { PurchasesPackage } from "@revenuecat/purchases-capacitor";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IAPUpgradeDialog = ({ open, onOpenChange }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  useEffect(() => {
    if (!open || !isNativeIOS()) return;
    (async () => {
      try {
        setLoading(true);
        await configurePurchases(user?.id);
        const current = await getOfferings();
        setPackages(current?.availablePackages ?? []);
      } catch (e: any) {
        toast({ title: "Unable to load subscriptions", description: e?.message ?? String(e), variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [open, user?.id, toast]);

  const handleBuy = async (pkg: PurchasesPackage) => {
    setBusy(true);
    try {
      const info = await purchasePackage(pkg);
      if (info) {
        toast({ title: "Subscription active", description: "Thanks for supporting Bring Your 5!" });
        onOpenChange(false);
      }
    } catch (e: any) {
      toast({ title: "Purchase failed", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async () => {
    setBusy(true);
    try {
      await restorePurchases();
      toast({ title: "Purchases restored" });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Restore failed", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  if (!isNativeIOS()) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade your membership</DialogTitle>
          <DialogDescription>Purchases are handled securely through the App Store.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : packages.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No subscriptions available right now.</p>
        ) : (
          <div className="space-y-3">
            {packages.map((pkg) => (
              <button
                key={pkg.identifier}
                onClick={() => handleBuy(pkg)}
                disabled={busy}
                className="w-full text-left border border-border rounded-lg p-4 hover:border-primary transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-lg">{pkg.product.title}</div>
                    <div className="text-sm text-muted-foreground">{pkg.product.description}</div>
                  </div>
                  <div className="font-semibold">{pkg.product.priceString}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={handleRestore} disabled={busy}>
            Restore purchases
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IAPUpgradeDialog;
