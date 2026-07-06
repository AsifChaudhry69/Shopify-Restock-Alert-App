export function EmptyWaitingState({ settings }) {
  return (
    <div style={{ background: "#fff", border: "2px dashed #e2e8f0", borderRadius: settings.productCardBorderRadius + "px", padding: "60px", textAlign: "center", color: "#94a3b8" }}>
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔔</div>
      <div style={{ fontSize: "16px", fontWeight: "600", color: "#64748b" }}>No products with waiting subscribers</div>
      <div style={{ fontSize: "13px", marginTop: "6px" }}>They'll appear here when customers subscribe</div>
    </div>
  );
}
