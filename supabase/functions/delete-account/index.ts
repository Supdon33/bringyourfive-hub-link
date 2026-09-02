import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Validate the caller's JWT
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    // Admin client — delete the user (cascades to app tables via FK ON DELETE CASCADE)
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Optional reason from the client
    let reason: string | null = null;
    try {
      const body = await req.json();
      reason = typeof body?.reason === "string" && body.reason.trim() ? body.reason.trim() : null;
    } catch (_) {
      // no body provided
    }

    // Record the deletion in the backend before removing the account
    const { data: profile } = await admin
      .from("profiles")
      .select("username")
      .eq("user_id", userId)
      .maybeSingle();

    await admin.from("account_deletions").insert({
      user_id: userId,
      email: userData.user.email ?? null,
      username: profile?.username ?? null,
      reason,
    });

    // Remove the matching HubSpot contact (best-effort — never blocks account deletion)
    const HUBSPOT_TOKEN = Deno.env.get("HUBSPOT_ACCESS_TOKEN");
    let hubspotDeleted = false;
    if (HUBSPOT_TOKEN && userData.user.email) {
      try {
        const searchRes = await fetch(
          "https://api.hubapi.com/crm/v3/objects/contacts/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${HUBSPOT_TOKEN}`,
            },
            body: JSON.stringify({
              filterGroups: [
                {
                  filters: [
                    { propertyName: "email", operator: "EQ", value: userData.user.email },
                  ],
                },
              ],
              properties: ["email"],
              limit: 1,
            }),
          }
        );
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const contactId = searchData?.results?.[0]?.id;
          if (contactId) {
            const delRes = await fetch(
              `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` },
              }
            );
            hubspotDeleted = delRes.ok;
            if (!delRes.ok) {
              console.error(`HubSpot contact delete failed [${delRes.status}]: ${await delRes.text()}`);
            }
          } else {
            console.log("No HubSpot contact found for email:", userData.user.email);
          }
        } else {
          console.error(`HubSpot contact search failed [${searchRes.status}]: ${await searchRes.text()}`);
        }
      } catch (hubspotErr) {
        console.error("HubSpot deletion error:", hubspotErr);
      }
    }

    // Best-effort cleanup of app data (in case FKs aren't cascading everywhere)
    await admin.from("run_participants").delete().eq("user_id", userId);
    await admin.from("active_sessions").delete().eq("user_id", userId);
    await admin.from("subscriptions").delete().eq("user_id", userId);
    await admin.from("user_roles").delete().eq("user_id", userId);
    await admin.from("profiles").delete().eq("user_id", userId);

    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      return new Response(JSON.stringify({ error: delErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
