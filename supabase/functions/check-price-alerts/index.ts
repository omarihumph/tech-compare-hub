import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

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
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

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

    // Fetch catalog info
    const { data: catalogs } = await supabase
      .from("product_catalog")
      .select("id, name, brand, image_url")
      .in("id", catalogIds);

    const catalogMap: Record<string, CatalogProduct> = {};
    catalogs?.forEach((c) => {
      catalogMap[c.id] = c;
    });

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

    // Get unique user IDs for alerts that need notification
    const userIds = [...new Set(alerts.map((a) => a.user_id))];

    // Fetch user emails from profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", userIds);

    const userMap: Record<string, { email: string; full_name: string | null }> = {};
    profiles?.forEach((p) => {
      userMap[p.id] = { email: p.email, full_name: p.full_name };
    });

    let notifiedCount = 0;
    const notificationResults: any[] = [];

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
        const catalog = catalogMap[alert.catalog_id];
        const user = userMap[alert.user_id];
        const priceDrop = alert.original_price - currentPrice;

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

        // Send email notification if Resend is configured
        if (resendApiKey && user?.email) {
          try {
            const resend = new Resend(resendApiKey);
            
            const productUrl = `${req.headers.get("origin") || "https://techprice.co.ke"}/product/${alert.catalog_id}`;
            
            const emailHtml = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333; margin-bottom: 20px;">🎉 Price Drop Alert!</h1>
                
                <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                  <h2 style="color: #166534; margin: 0 0 10px 0;">
                    ${catalog?.name || "Product"}
                  </h2>
                  ${catalog?.brand ? `<p style="color: #666; margin: 0 0 15px 0;">${catalog.brand}</p>` : ""}
                  
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <span style="text-decoration: line-through; color: #999; font-size: 18px;">
                      KES ${alert.original_price.toLocaleString()}
                    </span>
                    <span style="color: #166534; font-size: 24px; font-weight: bold;">
                      KES ${currentPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <p style="color: #166534; font-weight: 600; margin: 0;">
                    You save KES ${priceDrop.toLocaleString()}!
                  </p>
                </div>

                <a href="${productUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">
                  View Product
                </a>

                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  You received this email because you set a price alert for this product on TechPrice.
                </p>
              </div>
            `;

            const { error: emailError } = await resend.emails.send({
              from: "TechPrice <alerts@techprice.co.ke>",
              to: [user.email],
              subject: `🎉 Price dropped on ${catalog?.name || "a product you're watching"}!`,
              html: emailHtml,
            });

            if (emailError) {
              console.error(`Error sending email to ${user.email}:`, emailError);
              notificationResults.push({ alertId: alert.id, email: user.email, success: false, error: emailError.message });
            } else {
              console.log(`Email sent to ${user.email} for alert ${alert.id}`);
              notificationResults.push({ alertId: alert.id, email: user.email, success: true });
            }
          } catch (emailErr: any) {
            console.error(`Error sending email:`, emailErr);
            notificationResults.push({ alertId: alert.id, email: user?.email, success: false, error: emailErr.message });
          }
        } else {
          console.log(`Resend not configured or no email for user ${alert.user_id}`);
          notificationResults.push({ alertId: alert.id, success: true, emailSkipped: true });
        }
      }
    }

    console.log(`Processed ${alerts.length} alerts, notified ${notifiedCount}`);

    return new Response(
      JSON.stringify({
        message: "Price check complete",
        totalAlerts: alerts.length,
        notified: notifiedCount,
        results: notificationResults,
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
