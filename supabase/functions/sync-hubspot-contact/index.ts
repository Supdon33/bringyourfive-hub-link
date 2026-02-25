const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HUBSPOT_TOKEN = Deno.env.get("HUBSPOT_ACCESS_TOKEN");
    if (!HUBSPOT_TOKEN) {
      throw new Error("HUBSPOT_ACCESS_TOKEN not configured");
    }

    const body = await req.json();
    console.log("Received body:", JSON.stringify(body));
    const email = body.email;
    const firstName = body.firstName || "";
    const lastName = body.lastName || "";
    const cellPhone = body.cellPhone || "";
    const homeState = body.homeState || "";

    const contact = {
      properties: {
        email,
        firstname: firstName,
        lastname: lastName,
        phone: cellPhone,
        state: homeState,
        hs_lead_status: "NEW",
        lifecyclestage: "subscriber",
      },
    };

    const hubspotRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        },
        body: JSON.stringify(contact),
      }
    );

    const hubspotData = await hubspotRes.json();

    if (!hubspotRes.ok) {
      console.error("HubSpot error:", JSON.stringify(hubspotData));
      return new Response(JSON.stringify({ error: hubspotData }), {
        status: hubspotRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: hubspotData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("sync-hubspot-contact error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
