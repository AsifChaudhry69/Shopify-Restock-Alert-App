import { TABS } from "./Settings";
import { Label, ColorRow, SliderRow, SelectRow, Divider } from "./CustomizerControls";

const fontOptions = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "'Trebuchet MS', sans-serif", label: "Trebuchet MS" },
];

function renderTabContent(tab, s, update) {
  switch (tab) {
    case "Page":
      return (
        <>
          <SelectRow label="Font Family" k="pageFontFamily" options={fontOptions} s={s} update={update} />
          <ColorRow label="Page Background" k="pageBackground" s={s} update={update} />
        </>
      );
    case "Title":
      return (
        <>
          <Divider title="Page Title" />
          <SliderRow label="Title Size" k="titleSize" min={16} max={48} s={s} update={update} />
          <ColorRow label="Title Color" k="titleColor" s={s} update={update} />
          <SelectRow
            label="Title Weight"
            k="titleWeight"
            options={[
              { value: "normal", label: "Normal" },
              { value: "600", label: "Semi Bold" },
              { value: "bold", label: "Bold" },
            ]}
            s={s}
            update={update}
          />
          <SliderRow label="Subtitle Size" k="subtitleSize" min={10} max={20} s={s} update={update} />
          <ColorRow label="Subtitle Color" k="subtitleColor" s={s} update={update} />
          <Divider title="Section Titles" />
          <SliderRow label="Section Title Size" k="sectionTitleSize" min={14} max={32} s={s} update={update} />
          <ColorRow label="Section Title Color" k="sectionTitleColor" s={s} update={update} />
          <SliderRow label="Section Subtitle Size" k="sectionSubtitleSize" min={10} max={18} s={s} update={update} />
          <ColorRow label="Section Subtitle Color" k="sectionSubtitleColor" s={s} update={update} />
        </>
      );
    case "Cards":
      return (
        <>
          <SliderRow label="Number Size" k="cardNumSize" min={20} max={52} s={s} update={update} />
          <SliderRow label="Label Size" k="cardLabelSize" min={10} max={20} s={s} update={update} />
          <ColorRow label="Label Color" k="cardLabelColor" s={s} update={update} />
          <SliderRow label="Border Radius" k="cardBorderRadius" min={0} max={28} s={s} update={update} />
          <Divider title="Historical Cards" />
          <ColorRow label="Card 1 Background" k="hist1Bg" s={s} update={update} />
          <ColorRow label="Card 1 Number" k="hist1NumColor" s={s} update={update} />
          <ColorRow label="Card 2 Background" k="hist2Bg" s={s} update={update} />
          <ColorRow label="Card 2 Number" k="hist2NumColor" s={s} update={update} />
          <ColorRow label="Card 3 Background" k="hist3Bg" s={s} update={update} />
          <ColorRow label="Card 3 Number" k="hist3NumColor" s={s} update={update} />
          <ColorRow label="Card 4 Background" k="hist4Bg" s={s} update={update} />
          <ColorRow label="Card 4 Number" k="hist4NumColor" s={s} update={update} />
          <Divider title="Current Data Cards" />
          <ColorRow label="Card 1 Background" k="curr1Bg" s={s} update={update} />
          <ColorRow label="Card 1 Number" k="curr1NumColor" s={s} update={update} />
          <ColorRow label="Card 2 Background" k="curr2Bg" s={s} update={update} />
          <ColorRow label="Card 2 Number" k="curr2NumColor" s={s} update={update} />
          <ColorRow label="Card 3 Background" k="curr3Bg" s={s} update={update} />
          <ColorRow label="Card 3 Number" k="curr3NumColor" s={s} update={update} />
          <ColorRow label="Card 4 Background" k="curr4Bg" s={s} update={update} />
          <ColorRow label="Card 4 Number" k="curr4NumColor" s={s} update={update} />
        </>
      );
    case "Charts":
      return (
        <>
          <Divider title="Chart Cards" />
          <ColorRow label="Card Background" k="chartCardBg" s={s} update={update} />
          <ColorRow label="Card Border" k="chartCardBorder" s={s} update={update} />
          <SliderRow label="Border Radius" k="chartCardBorderRadius" min={0} max={28} s={s} update={update} />
          <SliderRow label="Title Size" k="chartTitleSize" min={12} max={24} s={s} update={update} />
          <ColorRow label="Title Color" k="chartTitleColor" s={s} update={update} />
          <ColorRow label="Subtitle Color" k="chartSubtitleColor" s={s} update={update} />
          <Divider title="Bar Chart" />
          <ColorRow label="Bar Color (Bottom)" k="barColor1" s={s} update={update} />
          <ColorRow label="Bar Color (Top)" k="barColor2" s={s} update={update} />
          <Divider title="Donut Chart" />
          <ColorRow label="Responses Color" k="donutColor1" s={s} update={update} />
          <ColorRow label="Unresolved Color" k="donutColor2" s={s} update={update} />
          <ColorRow label="Rate Color" k="donutColor3" s={s} update={update} />
          <Divider title="Progress Bars" />
          <ColorRow label="Track Background" k="progressBg" s={s} update={update} />
          <SliderRow label="Border Radius" k="progressBorderRadius" min={0} max={20} s={s} update={update} />
        </>
      );
    case "Badges":
      return (
        <>
          <ColorRow label="Waiting Badge Background" k="waitingBadgeBg" s={s} update={update} />
          <ColorRow label="Waiting Badge Text" k="waitingBadgeColor" s={s} update={update} />
        </>
      );
    case "Requests":
      return (
        <>
          <ColorRow label="Card Background" k="requestCardBg" s={s} update={update} />
          <ColorRow label="Card Border" k="requestCardBorder" s={s} update={update} />
          <SliderRow label="Border Radius" k="requestCardBorderRadius" min={0} max={20} s={s} update={update} />
          <SliderRow label="Email Size" k="requestEmailSize" min={10} max={20} s={s} update={update} />
          <ColorRow label="Email Color" k="requestEmailColor" s={s} update={update} />
          <ColorRow label="Product Name Color" k="requestProductColor" s={s} update={update} />
        </>
      );
    default:
      return null;
  }
}

export function Customizer({ showCustomizer, activeTab, onTabChange, settings, setSettings, saved, onClose, onReset, onSave }) {
  if (!showCustomizer) return null;

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      style={{
        width: "300px",
        minWidth: "300px",
        background: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        maxHeight: "100vh",
      }}
    >
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: "700",
              fontSize: "15px",
              color: "#0f172a",
            }}
          >
            Customizer
          </div>
          <div
            style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}
          >
            Live preview as you edit
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "#f1f5f9",
            border: "none",
            borderRadius: "8px",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            fontSize: "16px",
            color: "#64748b",
          }}
        >
          ✕
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          padding: "12px",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              padding: "5px 12px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
              background: activeTab === tab ? "#6366f1" : "#f1f5f9",
              color: activeTab === tab ? "#ffffff" : "#64748b",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {renderTabContent(activeTab, settings, update)}
      </div>
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          onClick={onReset}
          style={{
            flex: 1,
            padding: "9px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "12px",
            cursor: "pointer",
            color: "#64748b",
            fontWeight: "600",
          }}
        >
          ↺ Reset
        </button>
        <button
          onClick={onSave}
          style={{
            flex: 2,
            padding: "9px",
            background: saved ? "#16a34a" : "#6366f1",
            border: "none",
            borderRadius: "8px",
            fontSize: "12px",
            cursor: "pointer",
            color: "#fff",
            fontWeight: "700",
          }}
        >
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
