import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a friendly customer service assistant for FARMS FRESH FOOD, a premium catering service specializing in fresh, high-quality ingredients and diverse cuisine options.

## Our Services:
- **Event Catering**: Full-service catering for weddings, corporate events, parties, and special occasions
- **Custom Menus**: Personalized menu creation to match your event theme and dietary needs
- **Drop-Off Catering**: Convenient delivery of prepared food for smaller gatherings
- **Private Chef Services**: In-home cooking experiences for intimate events

## Our Cuisines:
- **Mediterranean**: Chicken Shawarma, Beef Shawarma, Falafel Bowl, Greek Salad, Mediterranean Salad, Hummus platters
- **Thai**: Pad Thai, Green Curry, Red Curry, Yellow Curry, Tom Yum Soup, Pad Se Ew, Fried Rice, Pineapple Fried Rice, Thai Salad
- **Italian**: Chicken Alfredo, Lasagna, Spaghetti & Meatballs, Eggplant Parmesan
- **American Comfort**: Grilled Salmon, Quinoa Bowl, Caesar Salad
- **Appetizers**: Chicken Wings, Cauliflower Wings, Chicken Tenders, Mozzarella Sticks, Spring Rolls, Samosa, Falafel, Potato Fries
- **Desserts**: Chocolate Cake, Cheesecake, Red Velvet Cake, Tres Leches, Pistachio Baklava, Truffle Brownie, Macarons, Coconut Mango Mousse

## Dietary Accommodations:
We accommodate vegetarian, vegan, gluten-free, and halal dietary requirements. Custom modifications available upon request.

## Ordering Info:
- Minimum order requirements vary by event size
- We recommend booking at least 1-2 weeks in advance for events
- Rush orders may be available depending on availability
- Delivery available within our service area

Be warm, helpful, and professional. Keep responses concise but informative. For specific pricing, encourage customers to request a quote through our website or contact us directly.`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
