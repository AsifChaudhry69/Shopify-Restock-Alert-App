export function WaitingProductCard({ group, index, storeHandle, settings }) {
  const productUrl = "https://admin.shopify.com/store/" + storeHandle + "/products/" + group.productId;

  return (
    <div style={{ background: settings.productCardBg, border: "1px solid " + settings.productCardBorderColor, borderRadius: settings.productCardBorderRadius + "px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <div style={{ background: settings.productCardHeaderBg, padding: "16px 20px", borderBottom: "1px solid " + settings.productCardBorderColor }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: settings.accentColor, color: "#fff", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", flexShrink: 0 }}>
              {index + 1}
            </div>
            {group.productImage && (
              <img src={group.productImage} alt={group.productTitle}
                style={{ width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover", border: "1px solid #e2e8f0" }} />
            )}
            <div>
              <div style={{ fontWeight: "700", fontSize: "15px", color: "#0f172a" }}>{group.productTitle}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>ID: {group.productId}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ background: settings.waitingBadgeBg, color: settings.waitingBadgeColor, padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
              Waiting: {group.waitingCount}
            </span>
            <span style={{ background: settings.accentColor, color: settings.openBadgeColor, padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
              {group.subscribers.length} open
            </span>
            <a href={productUrl} target="_blank" rel="noreferrer"
              style={{ display: "inline-block", background: settings.viewBtnBg, color: settings.viewBtnColor, padding: "7px 16px", borderRadius: settings.viewBtnBorderRadius + "px", textDecoration: "none", fontSize: "12px", fontWeight: "700" }}>
              View Product ↗
            </a>
          </div>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: settings.tableFontSize + "px", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "42%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
        </colgroup>
        <thead>
          <tr style={{ background: settings.tableHeaderBg }}>
            {[
              ["Email", "left"],
              ["Variant ID", "left"],
              ["Status", "center"],
              ["Date", "left"],
            ].map(([label, align]) => (
              <th key={label} style={{ padding: "10px 20px", textAlign: align, color: settings.tableHeaderColor, fontWeight: "600", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.4px", borderBottom: "1px solid #e2e8f0" }}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {group.subscribers.map((sub, subIndex) => (
            <tr key={sub.id} style={{ borderBottom: "1px solid #f1f5f9", background: subIndex % 2 === 0 ? settings.tableRowEvenBg : settings.tableRowOddBg }}>
              <td style={{ padding: "12px 20px", color: settings.tableTextColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "500" }}>{sub.email}</td>
              <td style={{ padding: "12px 20px", fontSize: "12px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace" }}>{sub.variantId}</td>
              <td style={{ padding: "12px 20px", textAlign: "center" }}>
                <span style={{ display: "inline-block", background: settings.statusBadgeBg, color: settings.statusBadgeColor, padding: "3px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>Waiting</span>
              </td>
              <td style={{ padding: "12px 20px", fontSize: "12px", color: "#94a3b8", whiteSpace: "nowrap" }}>{new Date(sub.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ padding: "10px 20px", background: settings.productCardHeaderBg, borderTop: "1px solid #f1f5f9", fontSize: "12px", color: "#94a3b8" }}>
        {group.waitingCount} waiting subscribers for restock notification
      </div>
    </div>
  );
}