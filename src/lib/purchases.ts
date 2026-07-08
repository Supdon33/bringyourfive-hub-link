import { Capacitor } from "@capacitor/core";
import { Purchases, LOG_LEVEL, PURCHASES_ERROR_CODE } from "@revenuecat/purchases-capacitor";
import type { PurchasesPackage } from "@revenuecat/purchases-capacitor";
import { supabase } from "@/integrations/supabase/client";

// Replace with your real RevenueCat public SDK keys before submitting to the App Store.
// Get them from https://app.revenuecat.com → Project Settings → API keys.
const REVENUECAT_APPLE_API_KEY = "appl_YOUR_KEY_HERE";

// Entitlement identifiers configured in RevenueCat (Entitlements tab).
// These must match the identifiers on your entitlements exactly.
export const ENTITLEMENT_TIER1 = "tier1";
export const ENTITLEMENT_TIER2 = "tier2";

let configured = false;

export const isNativeIOS = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === "ios";

export async function configurePurchases(appUserId?: string) {
  if (!isNativeIOS() || configured) return;
  await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
  await Purchases.configure({
    apiKey: REVENUECAT_APPLE_API_KEY,
    appUserID: appUserId,
  });
  configured = true;
}

export async function getOfferings() {
  const { current } = await Purchases.getOfferings();
  return current;
}

export async function purchasePackage(pkg: PurchasesPackage) {
  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    await syncEntitlementsToBackend(customerInfo.entitlements.active);
    return customerInfo;
  } catch (e: any) {
    if (e?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return null;
    throw e;
  }
}

export async function restorePurchases() {
  const { customerInfo } = await Purchases.restorePurchases();
  await syncEntitlementsToBackend(customerInfo.entitlements.active);
  return customerInfo;
}

async function syncEntitlementsToBackend(active: Record<string, unknown>) {
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) return;

  const tiers: Array<"tier1" | "tier2"> = [];
  if (active[ENTITLEMENT_TIER1]) tiers.push("tier1");
  if (active[ENTITLEMENT_TIER2]) tiers.push("tier2");

  // Upsert active subscriptions so the rest of the app (hasTier) works unchanged.
  for (const tier of tiers) {
    await supabase.from("subscriptions").upsert(
      { user_id: user.id, tier, status: "active" },
      { onConflict: "user_id,tier" }
    );
  }
}
