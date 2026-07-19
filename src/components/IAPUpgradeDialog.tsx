import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  configurePurchases,
  getProducts,
  isNativeIOS,
  purchaseProduct,
  restorePurchases,
} from "@/lib/purchases";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IAPUpgradeDialog = ({ open, onOpenChange }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!open || !isNativeIOS()) return;
    (async () => {
      try {
        setLoading(true);
        await configurePurchases(user?.id);
        setProducts(getProducts());
      } catch (e: any) {
        toast({ title: "Unable to load subscriptions", description: e?.message ?? String(e), variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [open, user?.id, toast]);

  const handleBuy = async (product: any) => {
    setBusy(true);
    try {
      const ok = await purchaseProduct(product);
      if (ok) {
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
        ) : products.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No subscriptions available right now.</p>
        ) : (
          <div className="space-y-3">
            {products.map((p) => {
              const offer = p.getOffer?.() ?? p.offers?.[0];
              const price = offer?.pricingPhases?.[0]?.price ?? "";
              return (
                <button
                  key={p.id}
                  onClick={() => handleBuy(p)}
                  disabled={busy}
                  className="w-full text-left border border-border rounded-lg p-4 hover:border-primary transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display text-lg">{p.title}</div>
                      <div className="text-sm text-muted-foreground">{p.description}</div>
                    </div>
                    <div className="font-semibold">{price}</div>
                  </div>
                </button>
              );
            })}
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
