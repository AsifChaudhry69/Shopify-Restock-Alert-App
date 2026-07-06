import { useState } from "react";
import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { SummaryCards } from "../components/home/SummaryCards";
import { EmptyWaitingState } from "../components/home/EmptyWaitingState";
import { WaitingProductCard } from "../components/home/WaitingProductCard";
import { CustomizerPanel, DEFAULT_SETTINGS } from "../components/home/customizer/CustomizerPanel";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);

  const subscriptions = await db.subscription.findMany({
    where: { shop: session.shop },
    orderBy: { createdAt: "desc" },
  });

  const total = subscriptions.length;
  const waiting = subscriptions.filter((subscription) => !subscription.notified).length;

  const productMap = {};

  subscriptions.forEach((subscription) => {
    if (subscription.notified) return;

    if (!productMap[subscription.productId]) {
      productMap[subscription.productId] = {
        productId: subscription.productId,
        subscribers: [],
        waitingCount: 0,
      };
    }

    productMap[subscription.productId].subscribers.push(subscription);
    productMap[subscription.productId].waitingCount += 1;
  });

  const productGroupsRaw = Object.values(productMap).sort(
    (a, b) => b.waitingCount - a.waitingCount || b.subscribers.length - a.subscribers.length
  );

  const productGroups = await Promise.all(
    productGroupsRaw.map(async (group) => {
      try {
        const response = await admin.graphql(
          `query getProduct($id: ID!) {
            product(id: $id) {
              title
              featuredImage { url }
            }
          }`,
          { variables: { id: "gid://shopify/Product/" + group.productId } }
        );
        const data = await response.json();
        const product = data.data?.product;

        return {
          ...group,
          productTitle: product?.title || "Product #" + group.productId,
          productImage: product?.featuredImage?.url || null,
        };
      } catch {
        return {
          ...group,
          productTitle: "Product #" + group.productId,
          productImage: null,
        };
      }
    })
  );

  return { total, waiting, productGroups, shop: session.shop };
};

export default function Index() {
  const { total, waiting, productGroups, shop } = useLoaderData();
  const storeHandle = shop ? shop.replace(".myshopify.com", "") : "";
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [activeTab, setActiveTab] = useState("Page");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: settings.pageFontFamily, background: settings.pageBackground }}>
      <CustomizerPanel
        showCustomizer={showCustomizer}
        setShowCustomizer={setShowCustomizer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        setSettings={setSettings}
        saved={saved}
        setSaved={setSaved}
        onReset={handleReset}
        onSave={handleSave}
      />

      <div style={{ flex: 1, padding: "28px", overflowX: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: settings.titleSize + "px", fontWeight: settings.titleWeight, color: settings.titleColor, margin: "0 0 6px" }}>
              {settings.titleText}
            </h1>
            <p style={{ color: settings.subtitleColor, fontSize: settings.subtitleSize + "px", margin: 0 }}>
              Waiting subscribers only — {shop}
            </p>
          </div>
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: showCustomizer ? "#6366f1" : "#ffffff", color: showCustomizer ? "#fff" : "#374151", border: "1px solid " + (showCustomizer ? "#6366f1" : "#e2e8f0"), borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", transition: "all 0.2s" }}
          >
            {showCustomizer ? "Hide Customizer" : "Customize Panel"}
          </button>
        </div>

        <SummaryCards waiting={waiting} productCount={productGroups.length} total={total} settings={settings} />

        <h2 style={{ fontSize: settings.sectionTitleSize + "px", fontWeight: "700", color: settings.sectionTitleColor, marginBottom: "16px" }}>
          Waiting Products
        </h2>

        {productGroups.length === 0 && <EmptyWaitingState settings={settings} />}

        {productGroups.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {productGroups.map((group, index) => (
              <WaitingProductCard
                key={group.productId}
                group={group}
                index={index}
                storeHandle={storeHandle}
                settings={settings}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);