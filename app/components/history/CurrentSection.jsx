import { StatCard } from "./StatCard";

export function CurrentSection({ s, waiting, notificationRate, pendingRate, currentProductStats, waitingRequests, maxWaitingCount, colors }) {
  const chartCard = (extra = {}) => ({
    background: s.chartCardBg,
    border: "1px solid " + s.chartCardBorder,
    borderRadius: s.chartCardBorderRadius + "px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    ...extra,
  });

  return (
    <section>
      <div style={{ marginBottom: "16px" }}>
        <h2
          style={{
            fontSize: s.sectionTitleSize + "px",
            fontWeight: "700",
            color: s.sectionTitleColor,
            margin: 0,
          }}
        >
          Current Data
        </h2>
        <p
          style={{
            color: s.sectionSubtitleColor,
            fontSize: s.sectionSubtitleSize + "px",
            marginTop: "6px",
          }}
        >
          Waiting subscriptions and unresolved requests that still need a
          response.
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
        <StatCard bg={s.curr1Bg} numColor={s.curr1NumColor} value={waiting} label="Total Waiting Subscribers" settings={s} />
        <StatCard bg={s.curr2Bg} numColor={s.curr2NumColor} value={currentProductStats.length} label="Products With Waiting" settings={s} />
        <StatCard bg={s.curr3Bg} numColor={s.curr3NumColor} value={notificationRate + "%"} label="Response Percentage" settings={s} />
        <StatCard bg={s.curr4Bg} numColor={s.curr4NumColor} value={pendingRate + "%"} label="Waiting Percentage" settings={s} />
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ ...chartCard({ flex: "1", minWidth: "300px" }) }}>
          <h3
            style={{
              fontSize: s.chartTitleSize + "px",
              fontWeight: "700",
              color: s.chartTitleColor,
              margin: "0 0 4px",
            }}
          >
            Waiting Count by Product
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: s.chartSubtitleColor,
              marginBottom: "20px",
            }}
          >
            Current pending data grouped by product
          </p>
          {currentProductStats.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#94a3b8",
                padding: "40px",
              }}
            >
              No waiting requests
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {currentProductStats.map((product, index) => {
                const barWidth =
                  maxWaitingCount > 0
                    ? (product.waiting / maxWaitingCount) * 100
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
                      <div style={{ display: "flex", gap: "8px" }}>
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
                          {product.waiting} open
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
                          width: barWidth + "%",
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
                        <span>
                          {Math.round(barWidth)}% of pending queue
                        </span>
                      </div>
                      <span>{product.waiting} waiting subscribers</span>
                    </div>
                  </div>
                );
              })}
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
            Current Waiting Requests
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: s.chartSubtitleColor,
              marginBottom: "20px",
            }}
          >
            Open requests still in the waiting state
          </p>
          {waitingRequests.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#94a3b8",
                padding: "40px",
              }}
            >
              No pending requests
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {waitingRequests.slice(0, 8).map((request) => (
                <div
                  key={request.id}
                  style={{
                    border: "1px solid " + s.requestCardBorder,
                    borderRadius: s.requestCardBorderRadius + "px",
                    padding: "14px 16px",
                    background: s.requestCardBg,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "700",
                          color: s.requestEmailColor,
                          fontSize: s.requestEmailSize + "px",
                        }}
                      >
                        {request.email}
                      </div>
                      <div
                        style={{
                          color: s.requestProductColor,
                          fontSize: "12px",
                          marginTop: "2px",
                        }}
                      >
                        {request.productTitle}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-block",
                          background: s.waitingBadgeBg,
                          color: s.waitingBadgeColor,
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        Waiting
                      </span>
                      <div
                        style={{
                          color: s.chartSubtitleColor,
                          fontSize: "11px",
                          marginTop: "6px",
                        }}
                      >
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      color: s.chartSubtitleColor,
                      fontSize: "12px",
                      marginTop: "10px",
                      fontFamily: "monospace",
                    }}
                  >
                    Variant ID: {request.variantId}
                  </div>
                </div>
              ))}
              {waitingRequests.length > 8 && (
                <div
                  style={{
                    textAlign: "center",
                    color: s.chartSubtitleColor,
                    fontSize: "12px",
                    paddingTop: "4px",
                  }}
                >
                  Showing 8 of {waitingRequests.length} waiting requests
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
