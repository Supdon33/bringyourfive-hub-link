import { Capacitor } from "@capacitor/core";
import { supabase } from "@/integrations/supabase/client";
import "cordova-plugin-purchase";

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

  // A locally reported purchase is not proof of an active subscription.
  // The receipt is verified with Apple by the verify-purchase function,
  // which is the only path that may grant account-wide access.
  s.when()
    .approved(async (transaction: any) => {
      try {
        await syncReceiptToBackend();
        await transaction.finish();
      } catch (error) {
        console.error("Could not verify App Store transaction", error);
      }
    });

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
  await syncReceiptToBackend();
}

// Sends the App Store receipt to the backend, which verifies it with Apple
// and activates the matching subscription tiers server-side.
export async function syncReceiptToBackend(): Promise<string[]> {
  const s = store();
  const receiptData: string | undefined = s?.appStoreReceipt;
  if (!receiptData) throw new Error("No App Store receipt is available yet.");
  const { data, error } = await supabase.functions.invoke("verify-purchase", {
    body: { receiptData },
  });
  if (error) throw new Error(error.message ?? "Purchase verification failed.");
  if (data?.error) throw new Error(data.error);
  window.dispatchEvent(new Event("by5:subscriptions-updated"));
  return (data?.active as string[]) ?? [];
}
