export function Label({ children }) {
  return (
    <div style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "6px" }}>
      {children}
    </div>
  );
}

export function ColorRow({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <Label>{label}</Label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 10px" }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "28px", height: "28px", border: "none", borderRadius: "4px", cursor: "pointer", background: "none" }}
        />
        <span style={{ fontSize: "12px", color: "#475569", fontFamily: "monospace" }}>{value}</span>
        <div style={{ marginLeft: "auto", width: "20px", height: "20px", borderRadius: "4px", background: value, border: "1px solid #e2e8f0" }} />
      </div>
    </div>
  );
}

export function SliderRow({ label, value, onChange, min, max }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <Label>{label}</Label>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#6366f1", background: "#eef2ff", padding: "2px 8px", borderRadius: "20px" }}>{value}px</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", accentColor: "#6366f1" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#cbd5e1", marginTop: "2px" }}>
        <span>{min}px</span>
        <span>{max}px</span>
      </div>
    </div>
  );
}

export function TextRow({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <Label>{label}</Label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", background: "#f8fafc", boxSizing: "border-box", outline: "none" }}
      />
    </div>
  );
}

export function SelectRow({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#1e293b", background: "#f8fafc", cursor: "pointer" }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Divider({ title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "18px 0 12px" }}>
      <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
      <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{title}</span>
      <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
    </div>
  );
}
