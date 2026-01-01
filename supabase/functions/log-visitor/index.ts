import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GeoLocation {
  country: string | null;
  city: string | null;
}

async function getGeoLocation(ip: string): Promise<GeoLocation> {
  // Skip geolocation for local/private IPs
  if (ip === "unknown" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip === "127.0.0.1" || ip === "::1") {
    return { country: null, city: null };
  }

  try {
    // Using ip-api.com (free, no API key required, 45 requests/minute limit)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
    
    if (!response.ok) {
      console.log(`Geolocation API returned status: ${response.status}`);
      return { country: null, city: null };
    }

    const data = await response.json();
    
    if (data.status === "success") {
      console.log(`Geolocation found: ${data.city}, ${data.country}`);
      return {
        country: data.country || null,
        city: data.city || null,
      };
    }
    
    console.log(`Geolocation lookup failed for IP ${ip}: ${data.message || "Unknown error"}`);
    return { country: null, city: null };
  } catch (error) {
    console.error("Geolocation lookup error:", error);
    return { country: null, city: null };
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get IP address from headers
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
               req.headers.get("cf-connecting-ip") || 
               req.headers.get("x-real-ip") || 
               "unknown";

    const userAgent = req.headers.get("user-agent") || "";
    
    // Parse request body for page info
    let pagePath = "/";
    let referrer = "";
    
    if (req.method === "POST") {
      try {
        const body = await req.json();
        pagePath = body.page_path || "/";
        referrer = body.referrer || "";
      } catch {
        // Body parsing failed, use defaults
      }
    }

    console.log(`Logging visitor: IP=${ip}, Page=${pagePath}`);

    // Get geolocation data
    const geoData = await getGeoLocation(ip);
    console.log(`Geolocation result: ${geoData.city || "N/A"}, ${geoData.country || "N/A"}`);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert visitor log with geolocation
    const { data, error } = await supabase
      .from("visitor_logs")
      .insert({
        ip_address: ip,
        user_agent: userAgent,
        page_path: pagePath,
        referrer: referrer,
        country: geoData.country,
        city: geoData.city,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting visitor log:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Visitor logged successfully: ${data.id}`);

    return new Response(
      JSON.stringify({ success: true, ip: ip, location: geoData }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
