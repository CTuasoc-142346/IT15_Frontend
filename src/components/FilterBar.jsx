// src/components/FilterBar.jsx
// ─────────────────────────────────────────────
// Reusable search + filter bar
// Props:
//   search, onSearch
//   filters[] — [{ label, value, onChange, options: [{label, value}] }]
//   actions[] — [{ label, icon, onClick, variant }]
// ─────────────────────────────────────────────

export default function FilterBar({ T, search, onSearch, filters = [], actions = [] }) {
  const inp = {
    flex: 1, minWidth: 160,
    padding: "0.65rem 0.9rem 0.65rem 2.2rem",
    borderRadius: 10,
    border: `1.5px solid ${T.inputBorder}`,
    background: T.inputBg,
    color: T.text,
    fontSize: "0.84rem",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color .2s, box-shadow .2s",
    boxSizing: "border-box",
  };

  const sel = {
    padding: "0.65rem 0.85rem",
    borderRadius: 10,
    border: `1.5px solid ${T.inputBorder}`,
    background: T.inputBg,
    color: T.text,
    fontSize: "0.83rem",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    cursor: "pointer",
    transition: "border-color .2s",
    minWidth: 130,
  };

  return (
    <div style={{
      display: "flex",
      gap: "0.65rem",
      padding: "0.9rem 1.2rem",
      borderTop: `1px solid ${T.border}`,
      flexWrap: "wrap",
      alignItems: "center",
      background: T.dark ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.02)",
    }}>
      {/* Search */}
      <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
        <span style={{
          position: "absolute", left: "0.75rem", top: "50%",
          transform: "translateY(-50%)",
          fontSize: "0.9rem", pointerEvents: "none",
          color: T.textMuted,
        }}>🔍</span>
        <input
          style={inp}
          placeholder="Search…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = "#5eead4";
            e.target.style.boxShadow = "0 0 0 3px rgba(94,234,212,0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = T.inputBorder;
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Selects */}
      {filters.map((f, i) => (
        <select
          key={i}
          style={sel}
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
          onFocus={(e) => { e.target.style.borderColor = "#5eead4"; }}
          onBlur={(e)  => { e.target.style.borderColor = T.inputBorder; }}
        >
          <option value="">{f.label}</option>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ))}

      {/* Action buttons */}
      {actions.map((a, i) => {
        const variants = {
          primary: { background: "linear-gradient(135deg,#5eead4,#3b82f6)", color: "#07061a", border: "none" },
          ghost:   { background: "transparent", color: T.textSub, border: `1.5px solid ${T.border}` },
          purple:  { background: "linear-gradient(135deg,#a78bfa,#6366f1)", color: "white", border: "none" },
        };
        const v = variants[a.variant || "ghost"];
        return (
          <button
            key={i}
            onClick={a.onClick}
            style={{
              padding: "0.65rem 1rem",
              borderRadius: 10,
              fontWeight: 700, fontSize: "0.82rem",
              fontFamily: "'DM Sans',sans-serif",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: "0.35rem",
              transition: "all .17s",
              whiteSpace: "nowrap",
              ...v,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
          >
            {a.icon && <span>{a.icon}</span>}
            {a.label}
          </button>
        );
      })}
    </div>
  );
}