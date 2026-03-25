import type { CSSProperties, ReactNode } from "react";

type MarkerTone = {
  panel: string;
  panelEdge: string;
  panelInner: string;
  orb: string;
  orbEdge: string;
  orbGlow: string;
  accent: string;
  badge: string;
  badgeEdge: string;
  text: string;
  subtext: string;
  plus: string;
  plusText: string;
  score: string;
  buttonFace: string;
  buttonEdge: string;
  buttonSymbol: string;
  spark?: string;
};

export type MarkerVariant = "first" | "second" | "third" | "fourth" | "last";

export type MarkerData = {
  variant: MarkerVariant;
  placeLabel: string;
  name: string;
  subtitle: string;
  delta: string;
  score: number;
  initials: string;
  icon?: ReactNode;
};

const THEMES: Record<MarkerVariant, MarkerTone> = {
  first: {
    panel: "linear-gradient(135deg, #a56b14 0%, #f9e7a4 18%, #f8de77 35%, #c48a22 58%, #f7e09e 78%, #87500f 100%)",
    panelEdge: "#f5dc8b",
    panelInner: "rgba(125, 77, 16, 0.28)",
    orb: "radial-gradient(circle at 32% 28%, #fff6cf 0%, #ffc94d 24%, #b86a09 62%, #5a2e04 100%)",
    orbEdge: "#f6db81",
    orbGlow: "0 0 34px rgba(255, 212, 93, 0.45)",
    accent: "linear-gradient(180deg, #f4d36a, #a96d18)",
    badge: "linear-gradient(135deg, #72461f, #f6d15a)",
    badgeEdge: "#f8e198",
    text: "#fff8dc",
    subtext: "rgba(86, 42, 2, 0.76)",
    plus: "linear-gradient(180deg, rgba(130, 81, 15, 0.94), rgba(88, 54, 10, 0.98))",
    plusText: "#ffd967",
    score: "#fff1b5",
    buttonFace: "linear-gradient(180deg, #f0cf6a, #a56a18)",
    buttonEdge: "#f7e29b",
    buttonSymbol: "#fff8df",
    spark: "rgba(255, 220, 120, 0.55)",
  },
  second: {
    panel: "linear-gradient(135deg, #5a6478 0%, #dfe5f3 18%, #b7c3d6 42%, #758196 62%, #edf3fb 82%, #4e5667 100%)",
    panelEdge: "#d6deec",
    panelInner: "rgba(44, 52, 70, 0.3)",
    orb: "radial-gradient(circle at 30% 26%, #ffffff 0%, #d6dde9 22%, #7a8799 58%, #313846 100%)",
    orbEdge: "#dce3ee",
    orbGlow: "0 0 28px rgba(210, 220, 235, 0.35)",
    accent: "linear-gradient(180deg, #e8edf7, #718095)",
    badge: "linear-gradient(135deg, #455164, #cdd8eb)",
    badgeEdge: "#edf4ff",
    text: "#f8fbff",
    subtext: "rgba(31, 39, 56, 0.78)",
    plus: "linear-gradient(180deg, rgba(81, 94, 117, 0.95), rgba(54, 63, 78, 0.98))",
    plusText: "#e7edf8",
    score: "#f9fbff",
    buttonFace: "linear-gradient(180deg, #d6deea, #778497)",
    buttonEdge: "#eff5fd",
    buttonSymbol: "#fefefe",
    spark: "rgba(230, 239, 255, 0.4)",
  },
  third: {
    panel: "linear-gradient(135deg, #6e3f2b 0%, #c88d5c 18%, #8e6f5c 40%, #4f8a86 62%, #a06d49 82%, #4a2c24 100%)",
    panelEdge: "#d6b287",
    panelInner: "rgba(60, 34, 23, 0.34)",
    orb: "radial-gradient(circle at 32% 28%, #ffe5b7 0%, #cc8c59 24%, #6f3b2a 62%, #2d1813 100%)",
    orbEdge: "#ebc08f",
    orbGlow: "0 0 26px rgba(207, 141, 93, 0.3)",
    accent: "linear-gradient(180deg, #dca06b, #7f4b2d)",
    badge: "linear-gradient(135deg, #5c3628, #d09c63)",
    badgeEdge: "#f2c99a",
    text: "#ffe2c2",
    subtext: "rgba(48, 27, 20, 0.7)",
    plus: "linear-gradient(180deg, rgba(107, 67, 39, 0.95), rgba(63, 37, 25, 0.98))",
    plusText: "#f6c894",
    score: "#ffd4aa",
    buttonFace: "linear-gradient(180deg, #dca26d, #77452f)",
    buttonEdge: "#f2cca1",
    buttonSymbol: "#fff0d8",
    spark: "rgba(92, 180, 173, 0.35)",
  },
  fourth: {
    panel: "linear-gradient(135deg, #0d1118 0%, #353b4d 24%, #1d2330 45%, #0d1218 62%, #2f3648 82%, #090c13 100%)",
    panelEdge: "#5a6477",
    panelInner: "rgba(160, 174, 201, 0.08)",
    orb: "radial-gradient(circle at 30% 26%, #dfe5ff 0%, #8a98b6 22%, #2c3446 60%, #06090e 100%)",
    orbEdge: "#5a6a8a",
    orbGlow: "0 0 24px rgba(115, 140, 189, 0.24)",
    accent: "linear-gradient(180deg, #aab6d3, #48536a)",
    badge: "linear-gradient(135deg, #111721, #59657a)",
    badgeEdge: "#73819d",
    text: "#f7f8ff",
    subtext: "rgba(221, 228, 255, 0.72)",
    plus: "linear-gradient(180deg, rgba(36, 43, 58, 0.95), rgba(12, 16, 24, 0.98))",
    plusText: "#8ea0ca",
    score: "#eef1ff",
    buttonFace: "linear-gradient(180deg, #5e6a82, #232b39)",
    buttonEdge: "#7f8aa3",
    buttonSymbol: "#eef2ff",
    spark: "rgba(219, 229, 255, 0.16)",
  },
  last: {
    panel: "linear-gradient(135deg, #270c0c 0%, #671e14 15%, #2f0a0e 32%, #120607 45%, #7c2b12 66%, #2c0908 84%, #090406 100%)",
    panelEdge: "#c65b33",
    panelInner: "rgba(255, 99, 52, 0.14)",
    orb: "radial-gradient(circle at 32% 28%, #ffb8a0 0%, #ff6b39 22%, #6f1e12 55%, #150608 100%)",
    orbEdge: "#f48a59",
    orbGlow: "0 0 30px rgba(255, 94, 47, 0.42)",
    accent: "linear-gradient(180deg, #ff9c62, #8a2914)",
    badge: "linear-gradient(135deg, #58180f, #ef6d3c)",
    badgeEdge: "#ff9a71",
    text: "#ffe8de",
    subtext: "rgba(255, 204, 187, 0.76)",
    plus: "linear-gradient(180deg, rgba(85, 20, 11, 0.96), rgba(28, 8, 7, 0.98))",
    plusText: "#ff8f68",
    score: "#ffd2c1",
    buttonFace: "linear-gradient(180deg, #e76a3b, #5e1810)",
    buttonEdge: "#ff9c79",
    buttonSymbol: "#fff2ec",
    spark: "rgba(255, 128, 77, 0.28)",
  },
};

const ROOT_STYLES: CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  width: "min(100%, 62rem)",
  minHeight: "10rem",
  padding: "0.9rem 1rem 0.9rem 7.25rem",
  borderRadius: "1.9rem",
  border: "2px solid rgba(255,255,255,0.14)",
  overflow: "visible",
  boxShadow:
    "0 28px 44px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -2px 10px rgba(0,0,0,0.25)",
};

const swirlMap: Record<MarkerVariant, string> = {
  first: "✦",
  second: "⚙",
  third: "❈",
  fourth: "✶",
  last: "✹",
};

function PlaceBadge({ tone, label }: { tone: MarkerTone; label: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "-0.75rem",
        top: "50%",
        transform: "translateY(-50%)",
        width: "5.8rem",
        height: "5.8rem",
        borderRadius: "9999px",
        display: "grid",
        placeItems: "center",
        padding: "0.42rem",
        background: tone.badge,
        border: `2px solid ${tone.badgeEdge}`,
        boxShadow:
          "0 12px 24px rgba(0,0,0,0.26), inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -6px 12px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-0.5rem",
          borderRadius: "9999px",
          border: `2px solid ${tone.panelEdge}`,
          opacity: 0.75,
          filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.25))",
          clipPath:
            "polygon(50% 0%, 62% 12%, 78% 6%, 82% 22%, 98% 26%, 90% 40%, 100% 50%, 90% 60%, 98% 74%, 82% 78%, 78% 94%, 62% 88%, 50% 100%, 38% 88%, 22% 94%, 18% 78%, 2% 74%, 10% 60%, 0% 50%, 10% 40%, 2% 26%, 18% 22%, 22% 6%, 38% 12%)",
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "9999px",
          display: "grid",
          placeItems: "center",
          background: tone.orb,
          color: tone.text,
          fontSize: "2.2rem",
          fontWeight: 900,
          textShadow: "0 3px 4px rgba(0,0,0,0.38)",
          border: `2px solid ${tone.orbEdge}`,
          boxShadow: `${tone.orbGlow}, inset 0 4px 10px rgba(255,255,255,0.2), inset 0 -12px 16px rgba(0,0,0,0.3)`,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function PortraitOrb({ tone, initials, icon }: { tone: MarkerTone; initials: string; icon?: ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        width: "7.35rem",
        height: "7.35rem",
        borderRadius: "9999px",
        padding: "0.28rem",
        background: `linear-gradient(145deg, ${tone.panelEdge}, ${tone.panelInner})`,
        boxShadow: `${tone.orbGlow}, 0 15px 30px rgba(0,0,0,0.26)`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0.32rem",
          borderRadius: "9999px",
          border: `2px solid ${tone.orbEdge}`,
          opacity: 0.68,
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "9999px",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          color: tone.text,
          fontWeight: 900,
          background: `radial-gradient(circle at 35% 25%, rgba(255,255,255,0.72), transparent 24%), ${tone.orb}`,
          border: `2px solid ${tone.orbEdge}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.16), transparent 28%, transparent 72%, rgba(0,0,0,0.24))",
          }}
        />
        {icon ? (
          <div style={{ position: "relative", width: "64%", height: "64%" }}>{icon}</div>
        ) : (
          <span style={{ position: "relative", fontSize: "2rem", letterSpacing: "0.08em" }}>{initials}</span>
        )}
      </div>
    </div>
  );
}

function ScoreButtons({ tone }: { tone: MarkerTone }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.72rem",
        marginLeft: "0.1rem",
        flexShrink: 0,
      }}
    >
      {[
        { symbol: "−", key: "minus" },
        { symbol: "+", key: "plus" },
      ].map((item) => (
        <button
          key={item.key}
          type="button"
          aria-label={item.key}
          style={{
            width: "3.5rem",
            height: "3.5rem",
            borderRadius: "1rem",
            border: `2px solid ${tone.buttonEdge}`,
            background: tone.buttonFace,
            color: tone.buttonSymbol,
            fontSize: "2rem",
            fontWeight: 900,
            boxShadow:
              "0 10px 18px rgba(0,0,0,0.25), inset 0 2px 8px rgba(255,255,255,0.2), inset 0 -6px 10px rgba(0,0,0,0.25)",
            cursor: "default",
          }}
        >
          {item.symbol}
        </button>
      ))}
    </div>
  );
}

export function PositionMarkerAsset({
  variant,
  placeLabel,
  name,
  subtitle,
  delta,
  score,
  initials,
  icon,
}: MarkerData) {
  const tone = THEMES[variant];

  return (
    <article
      style={{
        ...ROOT_STYLES,
        background: tone.panel,
        borderColor: tone.panelEdge,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0.35rem",
          borderRadius: "1.55rem",
          border: `1px solid ${tone.panelInner}`,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.14), transparent 22%, transparent 75%, rgba(0,0,0,0.18))",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            `radial-gradient(circle at 12% 50%, ${tone.spark ?? "transparent"} 0, transparent 22%), radial-gradient(circle at 86% 18%, ${tone.spark ?? "transparent"} 0, transparent 18%), radial-gradient(circle at 78% 78%, ${tone.spark ?? "transparent"} 0, transparent 16%)`,
          opacity: 0.9,
        }}
      />

      <PlaceBadge tone={tone} label={placeLabel} />

      <div
        style={{
          position: "absolute",
          left: "5.95rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
        }}
      >
        <PortraitOrb tone={tone} initials={initials} icon={icon} />
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          paddingLeft: "7rem",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: "clamp(2rem, 4vw, 3.35rem)",
              lineHeight: 0.94,
              letterSpacing: "0.08em",
              fontWeight: 900,
              color: tone.text,
              textTransform: "uppercase",
              textShadow: "0 3px 8px rgba(0,0,0,0.3)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </div>
          <div
            style={{
              marginTop: "0.45rem",
              color: tone.subtext,
              fontSize: "clamp(1rem, 2vw, 1.5rem)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              minWidth: "6.5rem",
              height: "4.5rem",
              padding: "0 1.15rem",
              borderRadius: "1.1rem",
              display: "grid",
              placeItems: "center",
              background: tone.plus,
              color: tone.plusText,
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 900,
              boxShadow:
                "inset 0 2px 10px rgba(255,255,255,0.12), inset 0 -10px 18px rgba(0,0,0,0.26), 0 10px 18px rgba(0,0,0,0.18)",
            }}
          >
            {delta}
          </div>

          <div
            style={{
              minWidth: "2.7rem",
              textAlign: "center",
              color: tone.score,
              fontSize: "clamp(2.6rem, 4vw, 4rem)",
              fontWeight: 900,
              textShadow: "0 4px 10px rgba(0,0,0,0.24)",
            }}
          >
            {score}
          </div>

          <ScoreButtons tone={tone} />
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "7.15rem",
          bottom: "0.58rem",
          color: tone.panelEdge,
          opacity: 0.22,
          fontSize: "1.2rem",
          letterSpacing: "0.15em",
          fontWeight: 900,
        }}
      >
        {swirlMap[variant]}
      </div>
    </article>
  );
}
