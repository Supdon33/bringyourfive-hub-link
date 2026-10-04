import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// App Store product IDs -> subscription tiers. Must match the app exactly.
const PRODUCT_TO_TIER: Record<string, string> = {
  "com.bringyour5.tier001.monthly": "tier1",
  "com.bringyour5.tier002.monthly": "tier2",
  "com.bringyour5.gym.standard.monthly.01": "gym_listing",
  "com.bringyour5.gym.featured.monthly.2": "gym_featured",
};

async function verifyWithApple(receiptData: string, sharedSecret: string, sandbox: boolean) {
  const url = sandbox
    ? "https://sandbox.itunes.apple.com/verifyReceipt"
    : "https://buy.itunes.apple.com/verifyReceipt";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "receipt-data": receiptData,
      password: sharedSecret,
      "exclude-old-transactions": true,
    }),
  });
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const sharedSecret = Deno.env.get("APPLE_APP_SHARED_SECRET");
    if (!sharedSecret) {
      return new Response(JSON.stringify({ error: "Purchase verification is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Identify the signed-in user from their JWT.
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "You must be signed in." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { receiptData } = await req.json();
    if (!receiptData || typeof receiptData !== "string") {
      return new Response(JSON.stringify({ error: "Missing receipt data." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify with Apple: production first, sandbox fallback (status 21007).
    let apple = await verifyWithApple(receiptData, sharedSecret, false);
    if (apple.status === 21007) apple = await verifyWithApple(receiptData, sharedSecret, true);
    if (apple.status !== 0) {
      return new Response(JSON.stringify({ error: "Apple could not verify this purchase.", status: apple.status }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find the latest active entitlement per known product.
    const now = Date.now();
    const latestByTier = new Map<string, number>(); // tier -> expires ms
    const receipts: any[] = apple.latest_receipt_info ?? apple.receipt?.in_app ?? [];
    for (const item of receipts) {
      const tier = PRODUCT_TO_TIER[item.product_id];
      if (!tier) continue;
      const expiresMs = Number(item.expires_date_ms ?? 0);
      const prev = latestByTier.get(tier) ?? 0;
      if (expiresMs > prev) latestByTier.set(tier, expiresMs);
    }

    const serviceClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const activeTiers: string[] = [];

    for (const [tier, expiresMs] of latestByTier) {
      const active = expiresMs > now;
      const { error } = await serviceClient.from("subscriptions").upsert(
        {
          user_id: user.id,
          tier,
          status: active ? "active" : "cancelled",
          expires_at: new Date(expiresMs).toISOString(),
        },
        { onConflict: "user_id,tier" }
      );
      if (error) throw error;
      if (active) activeTiers.push(tier);
    }

    return new Response(JSON.stringify({ active: activeTiers }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("verify-purchase failed", e);
    return new Response(JSON.stringify({ error: "Purchase verification failed. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
