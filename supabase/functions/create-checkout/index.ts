import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  modifiers?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

interface CheckoutRequest {
  cartItems: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    deliveryDate: string;
    deliveryTime: string;
    notes?: string;
  };
  successUrl: string;
  cancelUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY is not configured");
      throw new Error("Payment processing is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const { cartItems, customerInfo, successUrl, cancelUrl }: CheckoutRequest = await req.json();

    // Basic input validation
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    if (cartItems.length > 50) {
      throw new Error("Cart exceeds maximum item limit");
    }

    if (!customerInfo.email || !customerInfo.name) {
      throw new Error("Customer name and email are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      throw new Error("Invalid email format");
    }

    console.log("Validating cart items against database...");

    // Fetch actual prices from database to prevent price manipulation
    const itemIds = cartItems.map(item => item.id);
    const { data: dbItems, error: dbError } = await supabase
      .from("menu_items")
      .select("id, name, price, is_available")
      .in("id", itemIds);

    if (dbError) {
      console.error("Database error fetching items:", dbError);
      throw new Error("Failed to validate cart items");
    }

    if (!dbItems || dbItems.length === 0) {
      throw new Error("No valid items found in cart");
    }

    // Fetch modifier prices if any cart items have modifiers
    const allModifierIds = cartItems
      .flatMap(item => item.modifiers?.map(m => m.id) || [])
      .filter(Boolean);

    let dbModifiers: Array<{ id: string; name: string; price: number; is_available: boolean }> = [];
    if (allModifierIds.length > 0) {
      const { data: modifierData, error: modifierError } = await supabase
        .from("modifiers")
        .select("id, name, price, is_available")
        .in("id", allModifierIds);

      if (modifierError) {
        console.error("Database error fetching modifiers:", modifierError);
        throw new Error("Failed to validate modifiers");
      }
      dbModifiers = modifierData || [];
    }

    // Validate each cart item against database and build verified line items
    const verifiedLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of cartItems) {
      const dbItem = dbItems.find(db => db.id === item.id);
      
      if (!dbItem) {
        console.warn(`Item not found in database: ${item.id}`);
        throw new Error(`Item "${item.name}" is no longer available`);
      }

      if (!dbItem.is_available) {
        console.warn(`Item not available: ${item.name}`);
        throw new Error(`Item "${item.name}" is currently unavailable`);
      }

      // Validate quantity
      if (item.quantity < 1 || item.quantity > 100) {
        throw new Error(`Invalid quantity for "${item.name}"`);
      }

      // Use database price, not client price
      const verifiedPrice = Number(dbItem.price);
      
      if (Math.abs(item.price - verifiedPrice) > 0.01) {
        console.warn(`Price mismatch for ${item.name}: client=${item.price}, db=${verifiedPrice}`);
      }

      // Calculate modifier total using verified prices
      let modifierTotal = 0;
      const modifierNames: string[] = [];

      if (item.modifiers && item.modifiers.length > 0) {
        for (const modifier of item.modifiers) {
          const dbModifier = dbModifiers.find(m => m.id === modifier.id);
          if (dbModifier) {
            if (!dbModifier.is_available) {
              throw new Error(`Modifier "${modifier.name}" is currently unavailable`);
            }
            modifierTotal += Number(dbModifier.price);
            modifierNames.push(dbModifier.name);
          }
        }
      }

      const totalItemPrice = verifiedPrice + modifierTotal;
      const productName = modifierNames.length > 0 
        ? `${dbItem.name} (${modifierNames.join(", ")})`
        : dbItem.name;

      verifiedLineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: productName,
            ...(item.image_url && { images: [item.image_url] }),
          },
          unit_amount: Math.round(totalItemPrice * 100), // Convert to cents
        },
        quantity: item.quantity,
      });
    }

    console.log("Cart validated successfully. Creating checkout session for:", {
      itemCount: verifiedLineItems.length,
      customerEmail: customerInfo.email,
      verifiedTotal: verifiedLineItems.reduce((sum, item) => 
        sum + (item.price_data?.unit_amount || 0) * (item.quantity || 1), 0) / 100,
    });

    // Create or retrieve customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: customerInfo.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log("Found existing customer:", customer.id);
    } else {
      customer = await stripe.customers.create({
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        metadata: {
          address: customerInfo.address,
        },
      });
      console.log("Created new customer:", customer.id);
    }

    // Create checkout session with verified prices
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: verifiedLineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        deliveryDate: customerInfo.deliveryDate,
        deliveryTime: customerInfo.deliveryTime,
        notes: customerInfo.notes || "",
        address: customerInfo.address,
      },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
