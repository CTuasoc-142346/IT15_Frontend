// src/theme.js
// ─────────────────────────────────────────────
// Shared theme tokens — matches existing App.jsx aesthetic
// Dark: deep indigo/navy + teal accent
// Light: clean slate + teal accent
// ─────────────────────────────────────────────

export const mkTheme = (dark) => ({
  dark,
  bg:          dark ? "#07061a"                     : "#f4f6fb",
  bgDeep:      dark ? "#0d0b28"                     : "#e8ecf7",
  surface:     dark ? "rgba(255,255,255,0.045)"     : "#ffffff",
  surfaceHov:  dark ? "rgba(255,255,255,0.07)"      : "#f8f9fe",
  border:      dark ? "rgba(255,255,255,0.08)"      : "#e2e8f0",
  text:        dark ? "#f0f4ff"                     : "#0f172a",
  textSub:     dark ? "#94a3b8"                     : "#4b5563",
  textMuted:   dark ? "#4b5563"                     : "#9ca3af",
  inputBg:     dark ? "rgba(255,255,255,0.06)"      : "#ffffff",
  inputBorder: dark ? "rgba(255,255,255,0.12)"      : "#d1d5db",
  navActive:   dark ? "rgba(94,234,212,0.12)"       : "rgba(20,184,166,0.1)",
  navText:     dark ? "#5eead4"                     : "#0f766e",
  sidebarBg:   dark
    ? "linear-gradient(180deg,#111827,#07061a)"
    : "linear-gradient(180deg,#1e293b,#0f172a)",
  headerBg:    dark ? "rgba(7,6,26,0.85)"           : "rgba(244,246,251,0.9)",
  gridLine:    dark ? "rgba(255,255,255,0.05)"      : "#e5e7eb",
  scrollThumb: dark ? "rgba(255,255,255,0.12)"      : "#cbd5e1",
  shadow:      dark ? "none"                        : "0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)",
  cardHover:   dark ? "0 12px 32px rgba(0,0,0,.4)" : "0 8px 24px rgba(0,0,0,.1)",
  // Accents
  accent:      "#5eead4",
  accentBlue:  "#3b82f6",
  accentPurp:  "#a78bfa",
  accentPink:  "#f472b6",
  accentAmb:   "#fbbf24",
  danger:      "#f87171",
  success:     "#34d399",
  tooltipBg:   "#1e293b",
});

// ── Shared tooltip config for recharts ──────────────────────
export const tipCfg = (T) => ({
  contentStyle: {
    background: T.tooltipBg,
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#f0f4ff",
    fontSize: 11,
    padding: "7px 11px",
  },
  labelStyle: { color: "#94a3b8" },
  cursor: {
    stroke: T.dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    strokeWidth: 16,
  },
});