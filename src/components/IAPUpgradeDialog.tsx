import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  configurePurchases,
  getProducts,
  isNativeIOS,
  PRODUCT_TIER1,
  PRODUCT_TIER2,
  PRODUCT_GYM_STANDARD,
  PRODUCT_GYM_FEATURED,
} from "@/lib/purchases";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which subscription group to show. Defaults to player memberships. */
  group?: "player" | "gym";
}

const GROUP_IDS = {
  player: [PRODUCT_TIER1, PRODUCT_TIER2],
  gym: [PRODUCT_GYM_STANDARD, PRODUCT_GYM_FEATURED],
} as const;

const IAPUpgradeDialog = ({ open, onOpenChange, group = "player" }: Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [loadError, setLoadError] = useState("");
  const native = isNativeIOS();

  useEffect(() => {
    if (!open || !native) return;
    (async () => {
      try {
        setLoading(true);
        setLoadError("");
        await configurePurchases(user?.id);
        setProducts(getProducts([...GROUP_IDS[group]]));
      } catch (e: any) {
        setLoadError(e?.message ?? "Could not connect to the App Store.");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, user?.id, group, native]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{group === "gym" ? "Gym Memberships" : "Player Memberships"}</DialogTitle>
          <DialogDescription>{native ? "App Store memberships are temporarily unavailable while purchase verification is set up." : "Explore memberships for pickup basketball runs."}</DialogDescription>
        </DialogHeader>

        {!native ? (
          <div className="space-y-3">
            {(group === "player" ? [
              ["Standard State Search", "Find runs in your home state", "$5.99/month"],
              ["BY5 Player Tier 2", "Find runs nationwide", "$9.99/month"],
            ] : [
              ["Gym Standard", "List your gym", "$10.99/month"],
              ["Gym Featured", "Featured gym listing", "$14.99/month"],
            ]).map(([label, benefit, price]) => (
              <div key={label} className="border border-border rounded-md p-4 flex items-center justify-between gap-3">
                <div><p className="font-display text-lg">{label}</p><p className="text-sm text-muted-foreground">{benefit}</p></div>
                <span className="text-primary font-semibold shrink-0">{price}</span>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">Subscriptions are purchased in the iOS app. Prices shown are US prices; your App Store may show a different price.</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : loadError || products.length === 0 ? (
          <p role="alert" className="text-sm text-muted-foreground py-4">{loadError || "Subscriptions are not available from the App Store right now. Check your connection and try again."}</p>
        ) : (
          <div className="space-y-3">
            {GROUP_IDS[group].map((id) => {
              const p = products.find((product) => product.id === id);
              if (!p) return null;
              const offer = p.getOffer?.() ?? p.offers?.[0];
              const price = offer?.pricingPhases?.[0]?.price;
              const label = id === PRODUCT_TIER1 ? "Standard State Search" : id === PRODUCT_TIER2 ? "BY5 Player Tier 2" : id === PRODUCT_GYM_STANDARD ? "Gym Standard" : "Gym Featured";
              const benefit = id === PRODUCT_TIER1 ? "Find runs in your home state" : id === PRODUCT_TIER2 ? "Find runs nationwide" : id === PRODUCT_GYM_STANDARD ? "List your gym" : "Featured gym listing";
              return (
                <Button
                  key={p.id}
                  disabled
                  variant="outline"
                  className="w-full h-auto min-h-20 whitespace-normal text-left border-border p-4 hover:border-primary"
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-display text-lg">{label}</div>
                      <div className="text-sm text-muted-foreground">{benefit}</div>
                    </div>
                    <div className="shrink-0 font-semibold text-primary">{price ? `${price}/mo` : "Unavailable"}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        )}

        {!user && <Button asChild className="w-full" onClick={() => onOpenChange(false)}><Link to="/auth">Sign in to subscribe</Link></Button>}
        {native && <div className="flex justify-between items-center pt-2">
          {loadError && <Button variant="outline" size="sm" onClick={() => { onOpenChange(false); setTimeout(() => onOpenChange(true), 0); }}>Try again</Button>}
        </div>}
        <p className="text-xs text-muted-foreground">Auto-renews monthly until canceled in your Apple account. <Link className="underline" to="/terms" onClick={() => onOpenChange(false)}>Terms of Use</Link> · <Link className="underline" to="/privacy" onClick={() => onOpenChange(false)}>Privacy Policy</Link></p>
      </DialogContent>
    </Dialog>
  );
};

export default IAPUpgradeDialog;
