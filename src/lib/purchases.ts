import { Capacitor } from "@capacitor/core";
import "cordova-plugin-purchase";
import { supabase } from "@/integrations/supabase/client";

// Product identifiers must match what you create in App Store Connect exactly.
export const PRODUCT_TIER1 = "com.bringyour5.tier1.monthly";
export const PRODUCT_TIER2 = "com.bringyour5.tier2.monthly";

export const isNativeIOS = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === "ios";

// cordova-plugin-purchase exposes `CdvPurchase` on window.
const store = () => (globalThis as any).CdvPurchase?.store as any;
const CDV = () => (globalThis as any).CdvPurchase as any;

let initialized = false;
let readyPromise: Promise<void> | null = null;

export async function configurePurchases(appUserId?: string) {
  if (!isNativeIOS() || initialized) return readyPromise ?? Promise.resolve();
  const cdv = CDV();
  const s = store();
  if (!cdv || !s) return;

  s.verbosity = cdv.LogLevel.WARNING;
  if (appUserId) s.applicationUsername = () => appUserId;

  s.register([
    { id: PRODUCT_TIER1, type: cdv.ProductType.PAID_SUBSCRIPTION, platform: cdv.Platform.APPLE_APPSTORE },
    { id: PRODUCT_TIER2, type: cdv.ProductType.PAID_SUBSCRIPTION, platform: cdv.Platform.APPLE_APPSTORE },
  ]);

  s.when()
    .approved((transaction: any) => transaction.verify())
    .verified((receipt: any) => {
      receipt.finish();
      syncEntitlementsToBackend();
    });

  readyPromise = new Promise<void>((resolve) => {
    s.ready(() => resolve());
    s.initialize([cdv.Platform.APPLE_APPSTORE]).catch(() => resolve());
  });
  initialized = true;
  await readyPromise;
}

export function getProducts(): any[] {
  const s = store();
  if (!s) return [];
  return [PRODUCT_TIER1, PRODUCT_TIER2]
    .map((id) => s.get(id, CDV().Platform.APPLE_APPSTORE))
    .filter(Boolean);
}

export async function purchaseProduct(product: any): Promise<boolean> {
  const offer = product.getOffer?.() ?? product.offers?.[0];
  if (!offer) throw new Error("No offer available for this product.");
  const result = await store().order(offer);
  if (result && result.isError) {
    if (result.code === CDV().ErrorCode.PAYMENT_CANCELLED) return false;
    throw new Error(result.message ?? "Purchase failed");
  }
  return true;
}

export async function restorePurchases() {
  await store().restorePurchases();
  await syncEntitlementsToBackend();
}

async function syncEntitlementsToBackend() {
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) return;
  const s = store();
  const active: Array<"tier1" | "tier2"> = [];
  if (s.owned(PRODUCT_TIER1)) active.push("tier1");
  if (s.owned(PRODUCT_TIER2)) active.push("tier2");
  for (const tier of active) {
    await supabase
      .from("subscriptions")
      .upsert({ user_id: user.id, tier, status: "active" }, { onConflict: "user_id,tier" });
  }
}
