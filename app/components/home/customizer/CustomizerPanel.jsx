const DEFAULT_FONT_OPTIONS = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "'Trebuchet MS', sans-serif", label: "Trebuchet MS" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
];

export const DEFAULT_SETTINGS = {
  pageFontFamily: "Inter, sans-serif",
  pageBackground: "#f4f6f9",
  titleText: "Restock Alerts",
  titleSize: "28",
  titleColor: "#0f172a",
  titleWeight: "bold",
  subtitleSize: "14",
  subtitleColor: "#64748b",
  card1Bg: "#fffbeb",
  card1NumColor: "#d97706",
  card2Bg: "#eff6ff",
  card2NumColor: "#1d4ed8",
  card3Bg: "#f0fdf4",
  card3NumColor: "#16a34a",
  cardNumSize: "32",
  cardLabelSize: "13",
  cardLabelColor: "#64748b",
  cardBorderRadius: "16",
  sectionTitleSize: "18",
  sectionTitleColor: "#1e293b",
  productCardBg: "#ffffff",
  productCardBorderColor: "#e2e8f0",
  productCardBorderRadius: "14",
  productCardHeaderBg: "#f8fafc",
  accentColor: "#6366f1",
  waitingBadgeBg: "#fef9c3",
  waitingBadgeColor: "#854d0e",
  openBadgeColor: "#ffffff",
  tableHeaderBg: "#f8fafc",
  tableHeaderColor: "#64748b",
  tableRowEvenBg: "#ffffff",
  tableRowOddBg: "#f8fafc",
  tableFontSize: "14",
  tableTextColor: "#334155",
  statusBadgeBg: "#fef9c3",
  statusBadgeColor: "#854d0e",
  viewBtnBg: "#0f172a",
  viewBtnColor: "#ffffff",
  viewBtnBorderRadius: "8",
};

const TABS = ["Page", "Title", "Cards", "Products", "Table", "Buttons"];

function Label({ children }) {
  return (
    <div style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "6px" }}>
      {children}
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
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

function SliderRow({ label, value, onChange, min, max }) {
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

function TextRow({ label, value, onChange }) {
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

function SelectRow({ label, value, onChange, options }) {
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

function Divider({ title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "18px 0 12px" }}>
      <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
      <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{title}</span>
      <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
    </div>
  );
}

function renderTabContent(tab, settings, setSettings) {
  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  switch (tab) {
    case "Page":
      return (
        <>
          <SelectRow label="Font Family" value={settings.pageFontFamily} onChange={(value) => update("pageFontFamily", value)} options={DEFAULT_FONT_OPTIONS} />
          <ColorRow label="Page Background" value={settings.pageBackground} onChange={(value) => update("pageBackground", value)} />
        </>
      );
    case "Title":
      return (
        <>
          <Divider title="Page Title" />
          <TextRow label="Title Text" value={settings.titleText} onChange={(value) => update("titleText", value)} />
          <SliderRow label="Title Size" value={settings.titleSize} onChange={(value) => update("titleSize", value)} min={16} max={48} />
          <ColorRow label="Title Color" value={settings.titleColor} onChange={(value) => update("titleColor", value)} />
          <SelectRow
            label="Title Weight"
            value={settings.titleWeight}
            onChange={(value) => update("titleWeight", value)}
            options={[
              { value: "normal", label: "Normal" },
              { value: "600", label: "Semi Bold" },
              { value: "bold", label: "Bold" },
            ]}
          />
          <Divider title="Subtitle" />
          <SliderRow label="Subtitle Size" value={settings.subtitleSize} onChange={(value) => update("subtitleSize", value)} min={10} max={20} />
          <ColorRow label="Subtitle Color" value={settings.subtitleColor} onChange={(value) => update("subtitleColor", value)} />
          <Divider title="Section Title" />
          <SliderRow label="Size" value={settings.sectionTitleSize} onChange={(value) => update("sectionTitleSize", value)} min={12} max={32} />
          <ColorRow label="Color" value={settings.sectionTitleColor} onChange={(value) => update("sectionTitleColor", value)} />
        </>
      );
    case "Cards":
      return (
        <>
          <SliderRow label="Number Size" value={settings.cardNumSize} onChange={(value) => update("cardNumSize", value)} min={20} max={52} />
          <SliderRow label="Label Size" value={settings.cardLabelSize} onChange={(value) => update("cardLabelSize", value)} min={10} max={20} />
          <ColorRow label="Label Color" value={settings.cardLabelColor} onChange={(value) => update("cardLabelColor", value)} />
          <SliderRow label="Border Radius" value={settings.cardBorderRadius} onChange={(value) => update("cardBorderRadius", value)} min={0} max={28} />
          <Divider title="Card 1 — Waiting" />
          <ColorRow label="Background" value={settings.card1Bg} onChange={(value) => update("card1Bg", value)} />
          <ColorRow label="Number Color" value={settings.card1NumColor} onChange={(value) => update("card1NumColor", value)} />
          <Divider title="Card 2 — Products" />
          <ColorRow label="Background" value={settings.card2Bg} onChange={(value) => update("card2Bg", value)} />
          <ColorRow label="Number Color" value={settings.card2NumColor} onChange={(value) => update("card2NumColor", value)} />
          <Divider title="Card 3 — Total" />
          <ColorRow label="Background" value={settings.card3Bg} onChange={(value) => update("card3Bg", value)} />
          <ColorRow label="Number Color" value={settings.card3NumColor} onChange={(value) => update("card3NumColor", value)} />
        </>
      );
    case "Products":
      return (
        <>
          <Divider title="Product Card" />
          <ColorRow label="Card Background" value={settings.productCardBg} onChange={(value) => update("productCardBg", value)} />
          <ColorRow label="Border Color" value={settings.productCardBorderColor} onChange={(value) => update("productCardBorderColor", value)} />
          <SliderRow label="Border Radius" value={settings.productCardBorderRadius} onChange={(value) => update("productCardBorderRadius", value)} min={0} max={28} />
          <ColorRow label="Header Background" value={settings.productCardHeaderBg} onChange={(value) => update("productCardHeaderBg", value)} />
          <ColorRow label="Accent Color" value={settings.accentColor} onChange={(value) => update("accentColor", value)} />
          <Divider title="Badges" />
          <ColorRow label="Waiting Badge Background" value={settings.waitingBadgeBg} onChange={(value) => update("waitingBadgeBg", value)} />
          <ColorRow label="Waiting Badge Text" value={settings.waitingBadgeColor} onChange={(value) => update("waitingBadgeColor", value)} />
          <ColorRow label="Open Badge Text" value={settings.openBadgeColor} onChange={(value) => update("openBadgeColor", value)} />
          <Divider title="Status Badge" />
          <ColorRow label="Background" value={settings.statusBadgeBg} onChange={(value) => update("statusBadgeBg", value)} />
          <ColorRow label="Text Color" value={settings.statusBadgeColor} onChange={(value) => update("statusBadgeColor", value)} />
        </>
      );
    case "Table":
      return (
        <>
          <SliderRow label="Font Size" value={settings.tableFontSize} onChange={(value) => update("tableFontSize", value)} min={10} max={20} />
          <ColorRow label="Text Color" value={settings.tableTextColor} onChange={(value) => update("tableTextColor", value)} />
          <Divider title="Header" />
          <ColorRow label="Header Background" value={settings.tableHeaderBg} onChange={(value) => update("tableHeaderBg", value)} />
          <ColorRow label="Header Text" value={settings.tableHeaderColor} onChange={(value) => update("tableHeaderColor", value)} />
          <Divider title="Rows" />
          <ColorRow label="Even Row Background" value={settings.tableRowEvenBg} onChange={(value) => update("tableRowEvenBg", value)} />
          <ColorRow label="Odd Row Background" value={settings.tableRowOddBg} onChange={(value) => update("tableRowOddBg", value)} />
        </>
      );
    case "Buttons":
      return (
        <>
          <Divider title="View Product Button" />
          <ColorRow label="Background" value={settings.viewBtnBg} onChange={(value) => update("viewBtnBg", value)} />
          <ColorRow label="Text Color" value={settings.viewBtnColor} onChange={(value) => update("viewBtnColor", value)} />
          <SliderRow label="Border Radius" value={settings.viewBtnBorderRadius} onChange={(value) => update("viewBtnBorderRadius", value)} min={0} max={28} />
          <Divider title="Preview" />
          <div style={{ textAlign: "center", padding: "16px" }}>
            <a style={{ display: "inline-block", background: settings.viewBtnBg, color: settings.viewBtnColor, padding: "8px 20px", borderRadius: settings.viewBtnBorderRadius + "px", textDecoration: "none", fontSize: "13px", fontWeight: "bold" }}>
              View Product ↗
            </a>
          </div>
        </>
      );
    default:
      return null;
  }
}

export function CustomizerPanel({ showCustomizer, setShowCustomizer, activeTab, setActiveTab, settings, setSettings, saved, setSaved, onReset, onSave }) {
  return (
    <>
      {showCustomizer && (
        <div style={{ width: "300px", minWidth: "300px", background: "#ffffff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", position: "sticky", top: 0, maxHeight: "100vh" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: "700", fontSize: "15px", color: "#0f172a" }}> Customizer</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Live preview as you edit</div>
            </div>
            <button
              onClick={() => setShowCustomizer(false)}
              style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", padding: "12px", borderBottom: "1px solid #f1f5f9" }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ padding: "5px 12px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "600", background: activeTab === tab ? "#6366f1" : "#f1f5f9", color: activeTab === tab ? "#ffffff" : "#64748b", transition: "all 0.15s" }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>{renderTabContent(activeTab, settings, setSettings)}</div>

          <div style={{ padding: "16px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "8px" }}>
            <button
              onClick={() => {
                onReset();
                setSaved(false);
              }}
              style={{ flex: 1, padding: "9px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", cursor: "pointer", color: "#64748b", fontWeight: "600" }}
            >
              ↺ Reset
            </button>
            <button
              onClick={onSave}
              style={{ flex: 2, padding: "9px", background: saved ? "#16a34a" : "#6366f1", border: "none", borderRadius: "8px", fontSize: "12px", cursor: "pointer", color: "#fff", fontWeight: "700", transition: "background 0.2s" }}
            >
              {saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}