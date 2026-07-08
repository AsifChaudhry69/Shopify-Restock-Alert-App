import { StatCard } from "./StatCard";

export function HistoricalSection({ s, total, notified, waiting, notificationRate, pendingRate, historicalProductStats, timelineData, maxCount, colors }) {
  const chartCard = (extra = {}) => ({
    background: s.chartCardBg,
    border: "1px solid " + s.chartCardBorder,
    borderRadius: s.chartCardBorderRadius + "px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    ...extra,
  });

  return (
    <section style={{ marginBottom: "36px" }}>
      <div style={{ marginBottom: "16px" }}>
        <h2
          style={{
            fontSize: s.sectionTitleSize + "px",
            fontWeight: "700",
            color: s.sectionTitleColor,
            margin: 0,
          }}
        >
          Historical Data
        </h2>
        <p
          style={{
            color: s.sectionSubtitleColor,
            fontSize: s.sectionSubtitleSize + "px",
            marginTop: "6px",
          }}
        >
          Past form submissions and resolved subscriptions.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <StatCard bg={s.hist1Bg} numColor={s.hist1NumColor} value={total} label="Total Subscribers" settings={s} />
        <StatCard bg={s.hist2Bg} numColor={s.hist2NumColor} value={notified} label="Total Responses" settings={s} />
        <StatCard bg={s.hist3Bg} numColor={s.hist3NumColor} value={notificationRate + "%"} label="Response Percentage" settings={s} />
        <StatCard bg={s.hist4Bg} numColor={s.hist4NumColor} value={historicalProductStats.length} label="Products Tracked" settings={s} />
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ ...chartCard({ flex: "1", minWidth: "300px" }) }}>
          <h3
            style={{
              fontSize: s.chartTitleSize + "px",
              fontWeight: "700",
              color: s.chartTitleColor,
              margin: "0 0 4px",
            }}
          >
            Submissions Over Time
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: s.chartSubtitleColor,
              marginBottom: "20px",
            }}
          >
            Last 14 days
          </p>
          {timelineData.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#94a3b8",
                padding: "40px",
              }}
            >
              No data yet
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "6px",
                  height: "160px",
                }}
              >
                {timelineData.map((item) => {
                  const barHeight =
                    maxCount > 0
                      ? Math.max((item.count / maxCount) * 140, 8)
                      : 8;
                  return (
                    <div
                      key={item.date}
                      style={{
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          color: s.barColor1,
                          fontWeight: "700",
                        }}
                      >
                        {item.count}
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: barHeight + "px",
                          background: `linear-gradient(to top, ${s.barColor1}, ${s.barColor2})`,
                          borderRadius: "4px 4px 0 0",
                          minHeight: "8px",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div
                style={{ display: "flex", gap: "6px", marginTop: "6px" }}
              >
                {timelineData.map((item) => (
                  <div
                    key={item.date}
                    style={{
                      flex: "1",
                      textAlign: "center",
                      fontSize: "9px",
                      color: s.chartSubtitleColor,
                    }}
                  >
                    {item.date}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ ...chartCard({ flex: "1", minWidth: "300px" }) }}>
          <h3
            style={{
              fontSize: s.chartTitleSize + "px",
              fontWeight: "700",
              color: s.chartTitleColor,
              margin: "0 0 4px",
            }}
          >
            Historical Delivery Status
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: s.chartSubtitleColor,
              marginBottom: "20px",
            }}
          >
            Resolved vs pending across the full history
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "32px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "140px",
                height: "140px",
              }}
            >
              <svg
                viewBox="0 0 36 36"
                style={{
                  width: "140px",
                  height: "140px",
                  transform: "rotate(-90deg)",
                }}
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                {total > 0 && (
                  <>
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke={s.donutColor1}
                      strokeWidth="3"
                      strokeDasharray={
                        notificationRate + " " + (100 - notificationRate)
                      }
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke={s.donutColor2}
                      strokeWidth="3"
                      strokeDasharray={
                        pendingRate + " " + (100 - pendingRate)
                      }
                      strokeDashoffset={"-" + notificationRate}
                    />
                  </>
                )}
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "800",
                    color: s.sectionTitleColor,
                  }}
                >
                  {total}
                </div>
                <div
                  style={{ fontSize: "11px", color: s.chartSubtitleColor }}
                >
                  total
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {[
                {
                  color: s.donutColor1,
                  label: "Responses: " + notified,
                  sub: notificationRate + "%",
                },
                {
                  color: s.donutColor2,
                  label: "Unresolved: " + waiting,
                  sub: pendingRate + "%",
                },
                {
                  color: s.donutColor3,
                  label: "Response Rate: " + notificationRate + "%",
                  sub: "overall",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "3px",
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: s.chartTitleColor,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: s.chartSubtitleColor,
                      }}
                    >
                      {item.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...chartCard() }}>
        <div
          style={{
            padding: "0 0 16px",
            borderBottom: "1px solid " + s.chartCardBorder,
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              fontSize: s.chartTitleSize + "px",
              fontWeight: "700",
              color: s.chartTitleColor,
              margin: 0,
            }}
          >
            Historical Subscribers per Product
          </h3>
        </div>
        {historicalProductStats.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#94a3b8",
              padding: "40px",
            }}
          >
            No data yet
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {historicalProductStats.map((product, index) => {
              const responseRate =
                product.total > 0
                  ? (product.notified / product.total) * 100
                  : 0;
              const barColor = colors[index % colors.length];
              return (
                <div key={product.productId}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: s.chartTitleColor,
                      }}
                    >
                      {product.productTitle}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          background: "#dbeafe",
                          color: "#1d4ed8",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        Responses: {product.notified}
                      </span>
                      <span
                        style={{
                          background: s.waitingBadgeBg,
                          color: s.waitingBadgeColor,
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        Waiting: {product.waiting}
                      </span>
                      <span
                        style={{
                          background: barColor,
                          color: "#fff",
                          padding: "3px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        {product.total} total
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      background: s.progressBg,
                      borderRadius: s.progressBorderRadius + "px",
                      height: "14px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        width: responseRate + "%",
                        background: barColor,
                        borderRadius: s.progressBorderRadius + "px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      color: s.chartSubtitleColor,
                      marginTop: "4px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: barColor,
                        }}
                      />
                      <span>Response {Math.round(responseRate)}%</span>
                    </div>
                    <span>{product.total} total subscribers</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
