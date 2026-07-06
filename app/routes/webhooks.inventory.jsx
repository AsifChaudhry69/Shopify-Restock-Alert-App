import { authenticate, apiVersion } from "../shopify.server";
import db from "../db.server";
import { sendRestockEmail } from "../email.server";

export const action = async ({ request }) => {
  console.log("🔔 Webhook endpoint hit!");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_USER:", process.env.SMTP_USER);

  try {
    const { topic, shop, payload } = await authenticate.webhook(request);

    console.log(`✅ Webhook received: ${topic} from ${shop}`);

    // Accept both forms of the topic (registered key and toml topic string)
    if (
      topic === "INVENTORY_LEVELS_UPDATE" ||
      topic === "inventory_levels/update" ||
      (typeof topic === "string" && topic.toLowerCase().includes("inventory"))
    ) {
      console.log("Handling inventory levels webhook");

      // Normalize possible payload shapes. Shopify may send a single `available`,
      // an `inventory_item_id`, or an `inventory_levels` array.
      const inventoryIds = new Set();

      if (payload?.inventory_item_id) inventoryIds.add(String(payload.inventory_item_id));
      if (payload?.inventory_item_ids && Array.isArray(payload.inventory_item_ids)) {
        payload.inventory_item_ids.forEach((id) => inventoryIds.add(String(id)));
      }
      if (payload?.inventory_levels && Array.isArray(payload.inventory_levels)) {
        payload.inventory_levels.forEach((lvl) => {
          if (lvl?.inventory_item_id) inventoryIds.add(String(lvl.inventory_item_id));
          if (lvl?.available != null && Number(lvl.available) <= 0) {
            // If available is 0 or less for this level, skip it
            console.log(`Level for inventory_item ${lvl.inventory_item_id} is ${lvl.available} — skipping`);
          }
        });
      }

      // If payload had a simple `available` field (older or different hook shape), keep previous behavior
      if (payload && typeof payload.available !== "undefined" && inventoryIds.size === 0) {
        const available = Number(payload.available);
        console.log("Available quantity:", available);
        if (available <= 0) {
          console.log("Available is 0 — no emails sent");
          return new Response(null, { status: 200 });
        }

        // Fallback: notify all unsubscribed entries for this shop
        const subscribers = await db.subscription.findMany({ where: { shop: shop, notified: false } });
        console.log(`Found ${subscribers.length} subscribers to notify (fallback)`);
        for (const subscriber of subscribers) {
          try {
            console.log(`Sending email to ${subscriber.email}...`);
            await sendRestockEmail(
              subscriber.email,
              subscriber.productId,
              shop,
              subscriber.productTitle || null,
              `https://${shop}/products/${subscriber.productId}`,
              shop
            );
            await db.subscription.update({ where: { id: subscriber.id }, data: { notified: true } });
            console.log(`✅ Email sent to ${subscriber.email}`);
          } catch (emailError) {
            console.error(`❌ Failed to email ${subscriber.email}:`, emailError);
          }
        }

        return new Response(null, { status: 200 });
      }

      if (inventoryIds.size === 0) {
        console.log("No inventory_item_id found in payload — nothing to do");
        return new Response(null, { status: 200 });
      }

      // Map inventory_item_id -> variant(s) by calling the Admin API using a stored session token
      const session = await db.session.findFirst({ where: { shop } });
      if (!session || !session.accessToken) {
        console.error("No session/access token found for shop", shop);
        return new Response(null, { status: 200 });
      }

      for (const inventoryItemId of inventoryIds) {
        try {
          const url = `https://${shop}/admin/api/${apiVersion}/variants.json?inventory_item_ids=${inventoryItemId}`;
          console.log("Fetching variants for inventory_item_id", inventoryItemId, url);

          const resp = await fetch(url, {
            headers: { "X-Shopify-Access-Token": session.accessToken, "Content-Type": "application/json" },
          });

          if (!resp.ok) {
            console.error("Failed to fetch variants for inventory_item_id", inventoryItemId, resp.statusText);
            continue;
          }

          const data = await resp.json();
          const variants = data?.variants || [];
          console.log(`Found ${variants.length} variant(s) for inventory_item ${inventoryItemId}`);

          for (const v of variants) {
            const variantId = String(v.id);
            const subscribers = await db.subscription.findMany({ where: { shop: shop, variantId: variantId, notified: false } });
            console.log(`Found ${subscribers.length} subscribers for variant ${variantId}`);

            for (const subscriber of subscribers) {
              try {
                console.log(`Sending email to ${subscriber.email} for variant ${variantId}...`);
                await sendRestockEmail(
                  subscriber.email,
                  subscriber.productId,
                  shop,
                  subscriber.productTitle || null,
                  subscriber.productUrl || `https://${shop}/products/${subscriber.productId}`,
                  shop
                );
                await db.subscription.update({ where: { id: subscriber.id }, data: { notified: true } });
                console.log(`✅ Email sent to ${subscriber.email}`);
              } catch (emailError) {
                console.error(`❌ Failed to email ${subscriber.email}:`, emailError);
              }
            }
          }
        } catch (err) {
          console.error("Error handling inventory_item", inventoryItemId, err);
        }
      }
    }

    return new Response(null, { status: 200 });

  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response("Webhook processing failed", { status: 500 });
  }
};