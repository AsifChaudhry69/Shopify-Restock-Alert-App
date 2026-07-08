export function TopBar({ title, subtitle, showCustomizer, onToggleCustomizer, settings }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
      <div>
        <h1 style={{ fontSize: settings.titleSize + "px", fontWeight: settings.titleWeight, color: settings.titleColor, margin: "0 0 6px" }}>
          {title}
        </h1>
        <p style={{ color: settings.subtitleColor, fontSize: settings.subtitleSize + "px", margin: 0 }}>
          {subtitle}
        </p>
      </div>
      <button
        onClick={onToggleCustomizer}
        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: showCustomizer ? "#6366f1" : "#ffffff", color: showCustomizer ? "#fff" : "#374151", border: "1px solid " + (showCustomizer ? "#6366f1" : "#e2e8f0"), borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", transition: "all 0.2s" }}
      >
        {showCustomizer ? "Hide Customizer" : "Customize Panel"}
      </button>
    </div>
  );
}
