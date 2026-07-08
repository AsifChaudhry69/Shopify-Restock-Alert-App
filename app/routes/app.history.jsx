import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { useState } from "react";
import { DEFAULT_SETTINGS } from "../components/history/Settings";
import { Customizer } from "../components/history/Customizer";
import { TopBar } from "../components/history/TopBar";
import { HistoricalSection } from "../components/history/HistoricalSection";
import { CurrentSection } from "../components/history/CurrentSection";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const subscriptions = await db.subscription.findMany({
    where: { shop: session.shop },
    orderBy: { createdAt: "desc" },
  });
  const total = subscriptions.length;
  const notified = subscriptions.filter((s) => s.notified).length;
  const waiting = subscriptions.filter((s) => !s.notified).length;
  const productMap = {};
  subscriptions.forEach((subscription) => {
    if (!productMap[subscription.productId]) {
      productMap[subscription.productId] = {
        productId: subscription.productId,
        total: 0,
        notified: 0,
        waiting: 0,
      };
    }
    productMap[subscription.productId].total += 1;
    if (subscription.notified) productMap[subscription.productId].notified += 1;
    else productMap[subscription.productId].waiting += 1;
  });
  const productStats = await Promise.all(
    Object.values(productMap).map(async (product) => {
      try {
        const response = await admin.graphql(
          `query getProduct($id: ID!) { product(id: $id) { title } }`,
          { variables: { id: "gid://shopify/Product/" + product.productId } },
        );
        const data = await response.json();
        return {
          ...product,
          productTitle:
            data.data?.product?.title || "Product #" + product.productId,
        };
      } catch {
        return { ...product, productTitle: "Product #" + product.productId };
      }
    }),
  );
  const productTitleById = Object.fromEntries(
    productStats.map((p) => [p.productId, p.productTitle]),
  );
  const waitingRequests = subscriptions
    .filter((s) => !s.notified)
    .map((s) => ({
      ...s,
      productTitle: productTitleById[s.productId] || "Product #" + s.productId,
    }));
  const dateMap = {};
  subscriptions.forEach((s) => {
    const date = new Date(s.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!dateMap[date]) dateMap[date] = { date, count: 0 };
    dateMap[date].count += 1;
  });
  const timelineData = Object.values(dateMap).slice(-14);
  const notificationRate = total > 0 ? Math.round((notified / total) * 100) : 0;
  const pendingRate = total > 0 ? Math.round((waiting / total) * 100) : 0;
  return {
    total,
    notified,
    waiting,
    notificationRate,
    pendingRate,
    historicalProductStats: productStats.sort((a, b) => b.total - a.total),
    currentProductStats: productStats
      .filter((p) => p.waiting > 0)
      .sort((a, b) => b.waiting - a.waiting),
    waitingRequests,
    timelineData,
    shop: session.shop,
  };
};

const colors = [
  "#6366f1",
  "#f97316",
  "#10b981",
  "#f43f5e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export default function HistoryPage() {
  const {
    total,
    notified,
    waiting,
    notificationRate,
    pendingRate,
    historicalProductStats,
    currentProductStats,
    waitingRequests,
    timelineData,
    shop,
  } = useLoaderData();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [activeTab, setActiveTab] = useState("Page");
  const [s, setS] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const maxCount = Math.max(
    ...(timelineData.map((i) => i.count).length > 0
      ? timelineData.map((i) => i.count)
      : [1]),
  );
  const maxWaitingCount = Math.max(
    ...(currentProductStats.map((p) => p.waiting).length > 0
      ? currentProductStats.map((p) => p.waiting)
      : [1]),
  );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const handleReset = () => {
    setS(DEFAULT_SETTINGS);
    setSaved(false);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: s.pageFontFamily,
        background: s.pageBackground,
      }}
    >
      <Customizer
        showCustomizer={showCustomizer}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        settings={s}
        setSettings={setS}
        saved={saved}
        onClose={() => setShowCustomizer(false)}
        onReset={handleReset}
        onSave={handleSave}
      />

      <div style={{ flex: 1, padding: "28px", overflowX: "hidden" }}>
        <TopBar
          shop={shop}
          settings={s}
          showCustomizer={showCustomizer}
          onToggleCustomizer={() => setShowCustomizer(!showCustomizer)}
        />

        <HistoricalSection
          s={s}
          total={total}
          notified={notified}
          waiting={waiting}
          notificationRate={notificationRate}
          pendingRate={pendingRate}
          historicalProductStats={historicalProductStats}
          timelineData={timelineData}
          maxCount={maxCount}
          colors={colors}
        />

        <CurrentSection
          s={s}
          waiting={waiting}
          notificationRate={notificationRate}
          pendingRate={pendingRate}
          currentProductStats={currentProductStats}
          waitingRequests={waitingRequests}
          maxWaitingCount={maxWaitingCount}
          colors={colors}
        />
      </div>
    </div>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);
