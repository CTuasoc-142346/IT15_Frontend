// src/components/UI.jsx
// ─────────────────────────────────────────────
// Shared primitive components used across all pages:
//   Card, SectionTitle, Badge, StatCard, EmptyState
// ─────────────────────────────────────────────

import { useState } from "react";

/* ── Card ────────────────────────────────────────────────── */
export const Card = ({ T, children, style = {}, hoverable = false, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hoverable && setHov(true)}
      onMouseLeave={() => hoverable && setHov(false)}
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        boxShadow: hov ? T.cardHover : T.shadow,
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        transition: "all .2s",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ── Section Title ───────────────────────────────────────── */
export const SectionTitle = ({ T, children, sm }) => (
  <h3 style={{
    fontFamily: "'Syne', sans-serif",
    fontSize: sm ? "0.82rem" : "0.92rem",
    fontWeight: 700,
    color: T.text,
    margin: "0 0 0.85rem",
    letterSpacing: "-0.01em",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  }}>
    {children}
  </h3>
);

/* ── Badge ───────────────────────────────────────────────── */
export const Badge = ({ color, bg, children, sm }) => (
  <span style={{
    fontSize: sm ? "0.62rem" : "0.67rem",
    fontWeight: 700,
    padding: "0.2rem 0.55rem",
    borderRadius: 20,
    background: bg || `${color}18`,
    color: color,
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
  }}>
    {children}
  </span>
);

/* ── Status Badge helper ─────────────────────────────────── */
export const StatusBadge = ({ status, sm }) => {
  const map = {
    Active:       { color: "#34d399", label: "Active" },
    "Phased Out": { color: "#f87171", label: "Phased Out" },
    "Under Review":{ color: "#fbbf24", label: "Under Review" },
    Semester:     { color: "#5eead4", label: "📅 Semester" },
    Term:         { color: "#a78bfa", label: "📆 Term" },
    Both:         { color: "#34d399", label: "🗓️ Both" },
  };
  const m = map[status] || { color: "#94a3b8", label: status };
  return <Badge color={m.color} sm={sm}>{m.label}</Badge>;
};

/* ── Stat Card ───────────────────────────────────────────── */
export const StatCard = ({ T, icon, label, value, sub, color, trend, sm, delay = 0 }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        boxShadow: hov ? T.cardHover : T.shadow,
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        transition: "all .22s",
        padding: sm ? "1rem" : "1.2rem 1.3rem",
        animation: `fadeInUp 0.5s ease ${delay}s both`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.7rem" }}>
        <div style={{
          width: sm ? 36 : 40, height: sm ? 36 : 40,
          borderRadius: 10,
          background: `${color}20`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: sm ? "1.1rem" : "1.25rem",
        }}>{icon}</div>
        {trend != null && (
          <span style={{
            fontSize: "0.67rem", fontWeight: 700,
            padding: "0.18rem 0.5rem", borderRadius: 20,
            color: trend > 0 ? "#34d399" : "#f87171",
            background: trend > 0 ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
          }}>{trend > 0 ? "+" : ""}{trend}%</span>
        )}
      </div>
      <div style={{
        fontSize: sm ? "1.55rem" : "1.9rem",
        fontWeight: 800, color: T.text,
        letterSpacing: "-0.04em",
        fontFamily: "'Syne', sans-serif",
        lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: "0.78rem", color: T.textSub, marginTop: "0.2rem" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.68rem", color, marginTop: "0.18rem", fontWeight: 600 }}>{sub}</div>}
    </div>
  );
};

/* ── Empty State ─────────────────────────────────────────── */
export const EmptyState = ({ T, icon = "🔍", message = "Nothing found." }) => (
  <div style={{
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "3rem 1rem", gap: "0.75rem", textAlign: "center",
    color: T.textMuted,
  }}>
    <div style={{ fontSize: "2.8rem", opacity: 0.5 }}>{icon}</div>
    <p style={{ fontSize: "0.85rem", margin: 0 }}>{message}</p>
  </div>
);

/* ── Input ───────────────────────────────────────────────── */
export const Input = ({ T, style = {}, ...props }) => (
  <input
    {...props}
    style={{
      width: "100%",
      padding: "0.72rem 0.9rem",
      borderRadius: 10,
      border: `1.5px solid ${T.inputBorder}`,
      background: T.inputBg,
      color: T.text,
      fontSize: "0.85rem",
      fontFamily: "'DM Sans', sans-serif",
      outline: "none",
      transition: "border-color .2s, box-shadow .2s",
      boxSizing: "border-box",
      ...style,
    }}
    onFocus={(e) => {
      e.target.style.borderColor = "#5eead4";
      e.target.style.boxShadow = "0 0 0 3px rgba(94,234,212,0.15)";
      props.onFocus && props.onFocus(e);
    }}
    onBlur={(e) => {
      e.target.style.borderColor = T.inputBorder;
      e.target.style.boxShadow = "none";
      props.onBlur && props.onBlur(e);
    }}
  />
);

/* ── Select ──────────────────────────────────────────────── */
export const Select = ({ T, children, style = {}, ...props }) => (
  <select
    {...props}
    style={{
      padding: "0.72rem 0.9rem",
      borderRadius: 10,
      border: `1.5px solid ${T.inputBorder}`,
      background: T.inputBg,
      color: T.text,
      fontSize: "0.85rem",
      fontFamily: "'DM Sans', sans-serif",
      outline: "none",
      cursor: "pointer",
      transition: "border-color .2s",
      ...style,
    }}
    onFocus={(e) => { e.target.style.borderColor = "#5eead4"; }}
    onBlur={(e)  => { e.target.style.borderColor = T.inputBorder; }}
  >
    {children}
  </select>
);

/* ── Btn ─────────────────────────────────────────────────── */
export const Btn = ({ variant = "primary", children, style = {}, sm, ...props }) => {
  const variants = {
    primary: {
      background: "linear-gradient(135deg,#5eead4,#3b82f6)",
      color: "#07061a", border: "none",
    },
    purple: {
      background: "linear-gradient(135deg,#a78bfa,#6366f1)",
      color: "white", border: "none",
    },
    ghost: {
      background: "transparent",
      color: "#94a3b8",
      border: "1.5px solid rgba(255,255,255,0.08)",
    },
    danger: {
      background: "linear-gradient(135deg,#f87171,#ef4444)",
      color: "white", border: "none",
    },
  };
  return (
    <button
      {...props}
      style={{
        padding: sm ? "0.5rem 0.9rem" : "0.68rem 1.2rem",
        borderRadius: 10,
        fontWeight: 700,
        fontSize: sm ? "0.75rem" : "0.82rem",
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer",
        transition: "all .18s",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        whiteSpace: "nowrap",
        ...variants[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = "brightness(1.08)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "";
        e.currentTarget.style.transform = "";
      }}
    >
      {children}
    </button>
  );
};