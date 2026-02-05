import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PriceAlert {
  id: string;
  user_id: string;
  catalog_id: string;
  original_price: number;
  target_price: number | null;
  is_active: boolean;
  notified_at: string | null;
}

interface CatalogProduct {
  id: string;
  name: string;
  brand: string | null;
  image_url: string | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Checking price alerts...");

    // Fetch all active alerts that haven't been notified
    const { data: alerts, error: alertsError } = await supabase
      .from("price_alerts")
      .select("id, user_id, catalog_id, original_price, target_price, is_active, notified_at")
      .eq("is_active", true)
      .is("notified_at", null);

    if (alertsError) {
      console.error("Error fetching alerts:", alertsError);
      throw alertsError;
    }

    if (!alerts || alerts.length === 0) {
      console.log("No active alerts to check");
      return new Response(
        JSON.stringify({ message: "No active alerts to check", processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${alerts.length} active alerts to check`);

    // Get unique catalog IDs
    const catalogIds = [...new Set(alerts.map((a) => a.catalog_id))];

    // Fetch current lowest prices from products
    const { data: products } = await supabase
      .from("products")
      .select("catalog_id, price")
      .in("catalog_id", catalogIds)
      .eq("status", "approved");

    // Calculate lowest price per catalog
    const lowestPrices: Record<string, number> = {};
    products?.forEach((p) => {
      if (!lowestPrices[p.catalog_id] || p.price < lowestPrices[p.catalog_id]) {
        lowestPrices[p.catalog_id] = p.price;
      }
    });

    let notifiedCount = 0;

    // Check each alert
    for (const alert of alerts) {
      const currentPrice = lowestPrices[alert.catalog_id];
      
      if (!currentPrice) {
        console.log(`No approved products for catalog ${alert.catalog_id}`);
        continue;
      }

      // Check if price dropped
      const shouldNotify = alert.target_price
        ? currentPrice <= alert.target_price
        : currentPrice < alert.original_price;

      if (shouldNotify) {
        console.log(`Price dropped for alert ${alert.id}: ${alert.original_price} -> ${currentPrice}`);

        // Update alert as notified
        const { error: updateError } = await supabase
          .from("price_alerts")
          .update({ notified_at: new Date().toISOString() })
          .eq("id", alert.id);

        if (updateError) {
          console.error(`Error updating alert ${alert.id}:`, updateError);
          continue;
        }

        notifiedCount++;
      }
    }

    console.log(`Processed ${alerts.length} alerts, notified ${notifiedCount}`);

    return new Response(
      JSON.stringify({
        message: "Price check complete",
        totalAlerts: alerts.length,
        notified: notifiedCount,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in check-price-alerts:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
