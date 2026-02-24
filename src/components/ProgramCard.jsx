// src/components/ProgramCard.jsx
// ─────────────────────────────────────────────
// Individual program card in the grid layout
// Clicking opens ProgramDetails modal
// ─────────────────────────────────────────────

import { useState } from "react";

const STATUS_MAP = {
  Active:         { color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
  "Phased Out":   { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
  "Under Review": { color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
};

const TYPE_ICON = {
  "Bachelor's": "🎓",
  Diploma:      "📜",
  "Master's":   "🏅",
  Associate:    "📋",
};

export default function ProgramCard({ T, program, onClick, index = 0 }) {
  const [hov, setHov] = useState(false);
  const s = STATUS_MAP[program.status] || STATUS_MAP.Active;
  const yearCount = Object.keys(program.yearLevels).length;
  const subjectCount = Object.values(program.yearLevels).flat().length;

  return (
    <div
      onClick={() => onClick(program)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.surface,
        border: `1px solid ${hov ? "rgba(94,234,212,0.35)" : T.border}`,
        borderRadius: 14,
        padding: "1.2rem 1.3rem",
        cursor: "pointer",
        transition: "all .22s",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? T.cardHover : T.shadow,
        position: "relative",
        overflow: "hidden",
        animation: `fadeInUp .45s ease ${Math.min(index * 0.06, 0.36)}s both`,
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: hov
          ? "linear-gradient(90deg,#5eead4,#3b82f6,#a78bfa)"
          : `linear-gradient(90deg,${s.color},${s.color}88)`,
        transition: "background .3s",
      }} />

      {/* Glow orb on hover */}
      {hov && (
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 120, height: 120, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(94,234,212,0.08),transparent 70%)",
          pointerEvents: "none",
        }} />
      )}

      {/* Code + Status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: "0.75rem" }}>
        <div style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: "0.78rem", fontWeight: 800,
          color: T.dark ? "#5eead4" : "#0f766e",
          background: T.dark ? "rgba(94,234,212,0.1)" : "rgba(20,184,166,0.08)",
          padding: "0.22rem 0.65rem",
          borderRadius: 6,
          letterSpacing: "0.04em",
        }}>
          {program.code}
        </div>
        <span style={{
          fontSize: "0.62rem", fontWeight: 700,
          padding: "0.2rem 0.55rem", borderRadius: 20,
          background: s.bg, color: s.color,
          whiteSpace: "nowrap",
        }}>{program.status}</span>
      </div>

      {/* Program name */}
      <div style={{
        fontFamily: "'Syne',sans-serif",
        fontSize: "0.9rem", fontWeight: 700,
        color: T.text, marginBottom: "0.85rem", lineHeight: 1.3,
      }}>
        {program.name}
      </div>

      {/* Meta chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.9rem" }}>
        {[
          [TYPE_ICON[program.type] || "📘", program.type],
          ["⏱️", program.duration],
          ["📋", `${program.units} units`],
        ].map(([ic, lb], i) => (
          <span key={i} style={{
            display: "flex", alignItems: "center", gap: "0.3rem",
            background: T.dark ? "rgba(255,255,255,0.05)" : T.bgDeep,
            color: T.textSub, fontSize: "0.72rem",
            padding: "0.22rem 0.6rem", borderRadius: 6, fontWeight: 500,
          }}>
            {ic} {lb}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: "0.75rem", borderTop: `1px solid ${T.border}`,
      }}>
        <span style={{ fontSize: "0.7rem", color: T.textMuted }}>
          {yearCount} yr levels · {subjectCount} subjects
        </span>
        <span style={{
          fontSize: "0.72rem", fontWeight: 700,
          color: hov ? "#5eead4" : T.textSub,
          transition: "color .2s",
        }}>
          View Details →
        </span>
      </div>
    </div>
  );
}