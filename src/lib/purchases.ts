import { Capacitor } from "@capacitor/core";
import "cordova-plugin-purchase";
import { supabase } from "@/integrations/supabase/client";

// Product identifiers must match what you create in App Store Connect exactly.
export const PRODUCT_TIER1 = "com.bringyour5.tier001.monthly";
export const PRODUCT_TIER2 = "com.bringyour5.tier002.monthly";
export const PRODUCT_GYM_STANDARD = "com.bringyour5.gym.standard.monthly.01";
export const PRODUCT_GYM_FEATURED = "com.bringyour5.gym.featured.monthly.2";

export type SubTier = "tier1" | "tier2" | "gym_listing" | "gym_featured";

export const PRODUCT_TO_TIER: Record<string, SubTier> = {
  [PRODUCT_TIER1]: "tier1",
  [PRODUCT_TIER2]: "tier2",
  [PRODUCT_GYM_STANDARD]: "gym_listing",
  [PRODUCT_GYM_FEATURED]: "gym_featured",
};

export const ALL_PRODUCT_IDS = [
  PRODUCT_TIER1,
  PRODUCT_TIER2,
  PRODUCT_GYM_STANDARD,
  PRODUCT_GYM_FEATURED,
];

export const isNativeIOS = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === "ios";

// cordova-plugin-purchase exposes `CdvPurchase` on window.
const store = () => (globalThis as any).CdvPurchase?.store as any;
const CDV = () => (globalThis as any).CdvPurchase as any;

let initialized = false;
let readyPromise: Promise<void> | null = null;

export async function configurePurchases(appUserId?: string) {
  if (!isNativeIOS()) return;
  const cdv = CDV();
  const s = store();
  if (!cdv || !s) throw new Error("The App Store is not ready yet. Please reopen the app and try again.");
  if (appUserId) s.applicationUsername = () => appUserId;
  if (initialized) return readyPromise ?? Promise.resolve();

  s.verbosity = cdv.LogLevel.WARNING;

  s.register(
    ALL_PRODUCT_IDS.map((id) => ({
      id,
      type: cdv.ProductType.PAID_SUBSCRIPTION,
      platform: cdv.Platform.APPLE_APPSTORE,
    }))
  );

  // No receipt validator is configured. The plugin's `verified` event never fires
  // without one, so listen for local StoreKit receipts instead of leaving orders open.
  s.when()
    .approved(async (transaction: any) => {
      try {
        await syncEntitlementsToBackend();
        await transaction.finish();
      } catch (error) {
        console.error("Could not deliver App Store membership", error);
      }
    })
    .receiptUpdated(() => { void syncEntitlementsToBackend().catch(console.error); });
  s.when().receiptsReady(() => { void syncEntitlementsToBackend().catch(console.error); });

  readyPromise = s.initialize([cdv.Platform.APPLE_APPSTORE]).then(() => new Promise<void>((resolve) => {
    if (s.isReady) resolve();
    else s.ready(() => resolve());
  }));
  initialized = true;
  try {
    await readyPromise;
  } catch (error) {
    initialized = false;
    readyPromise = null;
    throw error;
  }
}

export function getProducts(filterIds?: string[]): any[] {
  const s = store();
  if (!s) return [];
  return (filterIds ?? ALL_PRODUCT_IDS)
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
  const result = await store().restorePurchases();
  if (result?.isError) throw new Error(result.message ?? "Could not restore purchases");
  await syncEntitlementsToBackend();
}

async function syncEntitlementsToBackend() {
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) return;
  const s = store();
  if (!s) return;
  const active = ALL_PRODUCT_IDS.filter((id) => s.owned(id)).map((id) => PRODUCT_TO_TIER[id]);
  for (const tier of active) {
    const { error } = await supabase
      .from("subscriptions")
      .upsert({ user_id: user.id, tier, status: "active" }, { onConflict: "user_id,tier" });
    if (error) throw error;
  }
  window.dispatchEvent(new Event("by5:subscriptions-updated"));
}
