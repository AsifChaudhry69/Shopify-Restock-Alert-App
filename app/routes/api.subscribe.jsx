import db from "../db.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export const loader = async ({ request }) => {
  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: corsHeaders,
  });
};

export const action = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    console.log("Subscribe request received:", body);
    const { email, productId, variantId, shop, productTitle, productUrl, storeName } = body;

    if (!email || !productId || !variantId || !shop) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    await db.subscription.upsert({
      where: { email_variantId: { email, variantId } },
      update: { notified: false, productId, shop },
      create: { email, productId, variantId, shop },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Subscribe error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
};