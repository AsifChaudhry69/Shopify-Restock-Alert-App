import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);

  const subscriptions = await db.subscription.findMany({
    where: { shop: session.shop },
    orderBy: { createdAt: "desc" },
  });

  const total = subscriptions.length;
  const notified = subscriptions.filter((subscription) => subscription.notified).length;
  const waiting = subscriptions.filter((subscription) => !subscription.notified).length;

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

    if (subscription.notified) {
      productMap[subscription.productId].notified += 1;
    } else {
      productMap[subscription.productId].waiting += 1;
    }
  });

  const productStats = await Promise.all(
    Object.values(productMap).map(async (product) => {
      try {
        const response = await admin.graphql(
          `query getProduct($id: ID!) {
            product(id: $id) {
              title
            }
          }`,
          { variables: { id: "gid://shopify/Product/" + product.productId } }
        );
        const data = await response.json();

        return {
          ...product,
          productTitle: data.data?.product?.title || "Product #" + product.productId,
        };
      } catch (error) {
        return {
          ...product,
          productTitle: "Product #" + product.productId,
        };
      }
    })
  );

  const productTitleById = Object.fromEntries(
    productStats.map((product) => [product.productId, product.productTitle])
  );

  const waitingRequests = subscriptions
    .filter((subscription) => !subscription.notified)
    .map((subscription) => ({
      ...subscription,
      productTitle: productTitleById[subscription.productId] || "Product #" + subscription.productId,
    }));

  const dateMap = {};

  subscriptions.forEach((subscription) => {
    const date = new Date(subscription.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!dateMap[date]) {
      dateMap[date] = { date, count: 0 };
    }

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
      .filter((product) => product.waiting > 0)
      .sort((a, b) => b.waiting - a.waiting),
    waitingRequests,
    timelineData,
    shop: session.shop,
  };
};

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

  const maxCount = Math.max(...(timelineData.map((item) => item.count).length > 0 ? timelineData.map((item) => item.count) : [1]));
  const maxWaitingCount = Math.max(...(currentProductStats.map((product) => product.waiting).length > 0 ? currentProductStats.map((product) => product.waiting) : [1]));
  const colors = ["#6366f1", "#f97316", "#10b981", "#f43f5e", "#3b82f6", "#8b5cf6", "#ec4899"];

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "#111", marginBottom: "8px" }}>Analytics & History</h1>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "28px" }}>{"Waitlist Management — " + shop}</p>

      <section style={{ marginBottom: "32px" }}>
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#111", margin: 0 }}>Historical Data</h2>
          <p style={{ color: "#666", fontSize: "13px", marginTop: "6px" }}>Past form submissions and resolved subscriptions.</p>
        </div>

        <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "12px", padding: "20px 24px", flex: "1", minWidth: "160px" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#111" }}>{total}</div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>Total Subscribers</div>
          </div>
          <div style={{ background: "#d4edda", border: "1px solid #ddd", borderRadius: "12px", padding: "20px 24px", flex: "1", minWidth: "160px" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#155724" }}>{notified}</div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>Total Responses</div>
          </div>
          <div style={{ background: "#cfe2ff", border: "1px solid #ddd", borderRadius: "12px", padding: "20px 24px", flex: "1", minWidth: "160px" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#0c447c" }}>{notificationRate + "%"}</div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>Response Percentage</div>
          </div>
          <div style={{ background: "#f3e8ff", border: "1px solid #ddd", borderRadius: "12px", padding: "20px 24px", flex: "1", minWidth: "160px" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#6b21a8" }}>{historicalProductStats.length}</div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>Products Tracked</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "300px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", marginBottom: "4px" }}>Submissions Over Time</h3>
            <p style={{ fontSize: "12px", color: "#999", marginBottom: "20px" }}>Last 14 days</p>

            {timelineData.length === 0 ? (
              <div style={{ textAlign: "center", color: "#999", padding: "40px" }}>No data yet</div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "160px" }}>
                  {timelineData.map((item) => {
                    const barHeight = maxCount > 0 ? Math.max((item.count / maxCount) * 140, 8) : 8;
                    return (
                      <div key={item.date} style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        <div style={{ fontSize: "11px", color: "#6366f1", fontWeight: "bold" }}>{item.count}</div>
                        <div style={{ width: "100%", height: barHeight + "px", background: "linear-gradient(to top, #6366f1, #818cf8)", borderRadius: "4px 4px 0 0", minHeight: "8px" }} />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                  {timelineData.map((item) => (
                    <div key={item.date} style={{ flex: "1", textAlign: "center", fontSize: "9px", color: "#999" }}>{item.date}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ flex: "1", minWidth: "300px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", marginBottom: "4px" }}>Historical Delivery Status</h3>
            <p style={{ fontSize: "12px", color: "#999", marginBottom: "20px" }}>Resolved vs pending across the full history</p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "32px" }}>
              <div style={{ position: "relative", width: "140px", height: "140px" }}>
                <svg viewBox="0 0 36 36" style={{ width: "140px", height: "140px", transform: "rotate(-90deg)" }}>
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  {total > 0 && (
                    <>
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={notificationRate + " " + (100 - notificationRate)} strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray={pendingRate + " " + (100 - pendingRate)} strokeDashoffset={"-" + notificationRate} />
                    </>
                  )}
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: "bold", color: "#111" }}>{total}</div>
                  <div style={{ fontSize: "11px", color: "#666" }}>total</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#10b981" }} />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>{"Responses: " + notified}</div>
                    <div style={{ fontSize: "11px", color: "#999" }}>{notificationRate + "%"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#f97316" }} />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>{"Unresolved: " + waiting}</div>
                    <div style={{ fontSize: "11px", color: "#999" }}>{pendingRate + "%"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#6366f1" }} />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>{"Response Rate: " + notificationRate + "%"}</div>
                    <div style={{ fontSize: "11px", color: "#999" }}>overall response percentage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: 0 }}>Historical Subscribers per Product</h3>
          </div>
          <div style={{ padding: "20px 24px" }}>
            {historicalProductStats.length === 0 ? (
              <div style={{ textAlign: "center", color: "#999", padding: "40px" }}>No data yet</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {historicalProductStats.map((product, index) => {
                  const responseRate = product.total > 0 ? (product.notified / product.total) * 100 : 0;
                  const barColor = colors[index % colors.length];

                  return (
                    <div key={product.productId}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", gap: "12px", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>{product.productTitle}</div>
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                          <div style={{ background: "#d4edda", color: "#155724", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>{"Responses: " + product.notified}</div>
                          <div style={{ background: "#fff3cd", color: "#856404", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>{"Waiting: " + product.waiting}</div>
                          <div style={{ background: barColor, color: "#fff", padding: "3px 12px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold" }}>{product.total + " total"}</div>
                        </div>
                      </div>

                      <div style={{ background: "#f0f0f0", borderRadius: "8px", height: "14px", overflow: "hidden", position: "relative" }}>
                        <div style={{ position: "absolute", left: "0", top: "0", height: "100%", width: responseRate + "%", background: barColor, borderRadius: "8px" }} />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#999", marginTop: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: barColor }} />
                          <span>{"Response " + Math.round(responseRate) + "%"}</span>
                        </div>
                        <span>{product.total + " total subscribers"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#111", margin: 0 }}>Current Data</h2>
          <p style={{ color: "#666", fontSize: "13px", marginTop: "6px" }}>Waiting subscriptions and unresolved requests that still need a response.</p>
        </div>

        <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ background: "#fff3cd", border: "1px solid #ddd", borderRadius: "12px", padding: "20px 24px", flex: "1", minWidth: "160px" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#856404" }}>{waiting}</div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>Total Waiting Subscribers</div>
          </div>
          <div style={{ background: "#cfe2ff", border: "1px solid #ddd", borderRadius: "12px", padding: "20px 24px", flex: "1", minWidth: "160px" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#0c447c" }}>{currentProductStats.length}</div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>Products With Waiting Requests</div>
          </div>
          <div style={{ background: "#d4edda", border: "1px solid #ddd", borderRadius: "12px", padding: "20px 24px", flex: "1", minWidth: "160px" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#155724" }}>{notificationRate + "%"}</div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>Response Percentage</div>
          </div>
          <div style={{ background: "#f3e8ff", border: "1px solid #ddd", borderRadius: "12px", padding: "20px 24px", flex: "1", minWidth: "160px" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#6b21a8" }}>{pendingRate + "%"}</div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>Waiting Percentage</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "300px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", marginBottom: "4px" }}>Waiting Count by Product</h3>
            <p style={{ fontSize: "12px", color: "#999", marginBottom: "20px" }}>Current pending data grouped by product</p>

            {currentProductStats.length === 0 ? (
              <div style={{ textAlign: "center", color: "#999", padding: "40px" }}>No waiting requests</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {currentProductStats.map((product, index) => {
                  const barWidth = maxWaitingCount > 0 ? (product.waiting / maxWaitingCount) * 100 : 0;
                  const barColor = colors[index % colors.length];

                  return (
                    <div key={product.productId}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", gap: "12px", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>{product.productTitle}</div>
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                          <div style={{ background: "#fff3cd", color: "#856404", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>{"Waiting: " + product.waiting}</div>
                          <div style={{ background: barColor, color: "#fff", padding: "3px 12px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold" }}>{product.waiting + " open"}</div>
                        </div>
                      </div>

                      <div style={{ background: "#f0f0f0", borderRadius: "8px", height: "14px", overflow: "hidden", position: "relative" }}>
                        <div style={{ position: "absolute", left: "0", top: "0", height: "100%", width: barWidth + "%", background: barColor, borderRadius: "8px" }} />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#999", marginTop: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: barColor }} />
                          <span>{Math.round(barWidth) + "% of pending queue"}</span>
                        </div>
                        <span>{product.waiting + " waiting subscribers"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ flex: "1", minWidth: "300px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", marginBottom: "4px" }}>Current Waiting Requests</h3>
            <p style={{ fontSize: "12px", color: "#999", marginBottom: "20px" }}>Open requests still in the waiting state</p>

            {waitingRequests.length === 0 ? (
              <div style={{ textAlign: "center", color: "#999", padding: "40px" }}>No pending requests</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {waitingRequests.slice(0, 8).map((request) => (
                  <div key={request.id} style={{ border: "1px solid #eee", borderRadius: "10px", padding: "14px 16px", background: "#fafafa" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: "bold", color: "#111", fontSize: "14px" }}>{request.email}</div>
                        <div style={{ color: "#666", fontSize: "12px", marginTop: "2px" }}>{request.productTitle}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-block", background: "#fff3cd", color: "#856404", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>Waiting</div>
                        <div style={{ color: "#999", fontSize: "11px", marginTop: "6px" }}>{new Date(request.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div style={{ color: "#888", fontSize: "12px", marginTop: "10px" }}>Variant ID: {request.variantId}</div>
                  </div>
                ))}
                {waitingRequests.length > 8 && <div style={{ textAlign: "center", color: "#666", fontSize: "12px", paddingTop: "4px" }}>{"Showing 8 of " + waitingRequests.length + " waiting requests"}</div>}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};