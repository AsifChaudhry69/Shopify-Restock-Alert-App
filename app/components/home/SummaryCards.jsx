export function SummaryCards({ waiting, productCount, total, settings }) {
  const cards = [
    { bg: settings.card1Bg, numColor: settings.card1NumColor, value: waiting, label: "Waiting Subscribers" },
    { bg: settings.card2Bg, numColor: settings.card2NumColor, value: productCount, label: "Products With Waiting" },
    { bg: settings.card3Bg, numColor: settings.card3NumColor, value: total, label: "Total Subscribers" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
      {cards.map((card, index) => (
        <div key={index} style={{ background: card.bg, borderRadius: settings.cardBorderRadius + "px", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: settings.cardNumSize + "px", fontWeight: "800", color: card.numColor, lineHeight: 1 }}>{card.value}</div>
          <div style={{ fontSize: settings.cardLabelSize + "px", color: settings.cardLabelColor, marginTop: "6px" }}>{card.label}</div>
        </div>
      ))}
    </div>
  );
}
