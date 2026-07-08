export function StatCard({ bg, numColor, value, label, icon, settings }) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: settings.cardBorderRadius + "px",
        padding: "20px 24px",
        flex: "1",
        minWidth: "160px",
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {icon && (
        <div style={{ fontSize: "20px", marginBottom: "8px" }}>{icon}</div>
      )}
      <div
        style={{
          fontSize: settings.cardNumSize + "px",
          fontWeight: "800",
          color: numColor,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: settings.cardLabelSize + "px",
          color: settings.cardLabelColor,
          marginTop: "6px",
        }}
      >
        {label}
      </div>
    </div>
  );
}
