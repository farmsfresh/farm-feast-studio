import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    console.log(`Logging visitor: IP=${ip}, Page=${pagePath}, UA=${userAgent.substring(0, 50)}...`);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert visitor log
    const { data, error } = await supabase
      .from("visitor_logs")
      .insert({
        ip_address: ip,
        user_agent: userAgent,
        page_path: pagePath,
        referrer: referrer,
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
      JSON.stringify({ success: true, ip: ip }),
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
