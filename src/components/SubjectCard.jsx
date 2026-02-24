// src/components/SubjectCard.jsx
// ─────────────────────────────────────────────
// A single row in the subjects table
// Clicking triggers the SubjectDetails modal
// ─────────────────────────────────────────────

import { useState } from "react";

const TERM_STYLE = {
  Semester: { color: "#5eead4", bg: "rgba(94,234,212,0.1)",   label: "📅 Semester" },
  Term:     { color: "#a78bfa", bg: "rgba(167,139,250,0.1)",  label: "📆 Term"     },
  Both:     { color: "#34d399", bg: "rgba(52,211,153,0.1)",   label: "🗓️ Both"    },
};

export default function SubjectCard({ T, subject, onClick, index = 0, sm }) {
  const [hov, setHov] = useState(false);
  const ts = TERM_STYLE[subject.term] || TERM_STYLE.Semester;

  if (sm) {
    // Mobile card layout
    return (
      <div
        onClick={() => onClick(subject)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: hov ? T.surfaceHov : "transparent",
          borderBottom: `1px solid ${T.border}`,
          padding: "0.85rem 1rem",
          cursor: "pointer",
          transition: "background .13s",
          animation: `fadeIn .3s ease ${Math.min(index * 0.03, 0.25)}s both`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: "0.35rem" }}>
          <span style={{
            fontFamily: "'Courier New',monospace",
            fontSize: "0.72rem", fontWeight: 700,
            color: T.dark ? "#5eead4" : "#0f766e",
            background: T.dark ? "rgba(94,234,212,0.1)" : "rgba(20,184,166,0.07)",
            padding: "0.15rem 0.5rem", borderRadius: 5,
          }}>{subject.code}</span>
          <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: 20, background: ts.bg, color: ts.color }}>
            {ts.label}
          </span>
        </div>
        <div style={{ color: T.text, fontWeight: 600, fontSize: "0.84rem", marginBottom: "0.2rem" }}>
          {subject.title}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.68rem", color: T.textMuted }}>{subject.units} units</span>
          <span style={{ fontSize: "0.68rem", color: T.textMuted }}>·</span>
          <span style={{ fontSize: "0.68rem", color: T.textMuted }}>{subject.semester}</span>
          <span style={{ fontSize: "0.68rem", color: T.textMuted }}>·</span>
          <span style={{ fontSize: "0.68rem", color: T.accentPurp, fontWeight: 600 }}>{subject.program}</span>
        </div>
      </div>
    );
  }

  // Desktop row
  return (
    <div
      onClick={() => onClick(subject)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr 55px 130px 110px 90px 60px",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.8rem 1.2rem",
        borderBottom: `1px solid ${T.border}`,
        cursor: "pointer",
        background: hov ? T.surfaceHov : "transparent",
        transition: "background .13s",
        animation: `fadeIn .3s ease ${Math.min(index * 0.03, 0.25)}s both`,
      }}
    >
      {/* Code */}
      <span style={{
        fontFamily: "'Courier New',monospace",
        fontSize: "0.72rem", fontWeight: 700,
        color: T.dark ? "#5eead4" : "#0f766e",
        background: T.dark ? "rgba(94,234,212,0.08)" : "rgba(20,184,166,0.07)",
        padding: "0.2rem 0.5rem", borderRadius: 5,
        whiteSpace: "nowrap",
      }}>{subject.code}</span>

      {/* Title + desc */}
      <div style={{ minWidth: 0 }}>
        <div style={{ color: T.text, fontWeight: 600, fontSize: "0.84rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {subject.title}
        </div>
        <div style={{ color: T.textMuted, fontSize: "0.7rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
          {subject.description}
        </div>
      </div>

      {/* Units */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.88rem", fontWeight: 800, color: T.text, fontFamily: "'Syne',sans-serif" }}>{subject.units}</div>
        <div style={{ fontSize: "0.62rem", color: T.textMuted }}>units</div>
      </div>

      {/* Semester */}
      <div style={{ fontSize: "0.76rem", color: T.textSub, fontWeight: 500 }}>{subject.semester}</div>

      {/* Term badge */}
      <span style={{
        fontSize: "0.65rem", fontWeight: 700,
        padding: "0.2rem 0.6rem", borderRadius: 20,
        background: ts.bg, color: ts.color,
        display: "inline-flex", alignItems: "center", width: "fit-content",
      }}>{ts.label}</span>

      {/* Program */}
      <span style={{
        fontSize: "0.65rem", fontWeight: 700,
        padding: "0.2rem 0.55rem", borderRadius: 6,
        background: T.dark ? "rgba(167,139,250,0.12)" : "rgba(99,102,241,0.08)",
        color: T.accentPurp,
      }}>{subject.program}</span>

      {/* Arrow */}
      <span style={{ color: hov ? "#5eead4" : T.textMuted, fontSize: "0.85rem", transition: "color .15s" }}>→</span>
    </div>
  );
}