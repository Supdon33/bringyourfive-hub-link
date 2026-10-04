# Architecture decisions

- Keep native App Store purchase discovery in the shared React experience and invoke StoreKit only on iOS; browser previews cannot process Apple payments.
- Treat StoreKit product metadata as the source of displayed prices and availability; static prices can diverge by storefront.
- Grant paid subscription access only from server-verified Apple entitlements, never signup metadata or client-reported receipts, because either can be forged. The verify-purchase edge function checks receipts with Apple's verifyReceipt endpoint (production, sandbox fallback) using APPLE_APP_SHARED_SECRET and upserts the subscriptions table.