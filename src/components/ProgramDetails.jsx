// src/components/ProgramDetails.jsx
// ─────────────────────────────────────────────
// Modal showing full program info + year levels
// ─────────────────────────────────────────────

const STATUS_COLOR = {
  Active:         "#34d399",
  "Phased Out":   "#f87171",
  "Under Review": "#fbbf24",
};

export default function ProgramDetails({ T, program, onClose }) {
  if (!program) return null;
  const sc = STATUS_COLOR[program.status] || "#94a3b8";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 400,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
        padding: "1rem",
        animation: "fadeIn .2s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.dark ? "#0d0b28" : "#ffffff",
          border: `1px solid ${T.border}`,
          borderRadius: 18,
          width: "100%", maxWidth: 660,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          animation: "scaleIn .25s ease",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          background: T.dark
            ? "linear-gradient(135deg,#1e1b4b,#0d0b28)"
            : "linear-gradient(135deg,#1e293b,#0f172a)",
          padding: "1.5rem 1.6rem",
          position: "relative", overflow: "hidden", flexShrink: 0,
        }}>
          {/* Decorative orb */}
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 160, height: 160, borderRadius: "50%",
            background: "radial-gradient(circle,rgba(94,234,212,0.12),transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: "0.68rem", fontWeight: 700,
                color: "#5eead4", letterSpacing: "0.12em",
                textTransform: "uppercase", marginBottom: "0.4rem",
              }}>{program.code} · {program.type}</div>
              <h2 style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: "1.25rem", fontWeight: 800,
                color: "#f0f4ff", margin: 0, lineHeight: 1.25,
              }}>{program.name}</h2>
              <span style={{
                display: "inline-flex", marginTop: "0.55rem",
                fontSize: "0.62rem", fontWeight: 700,
                padding: "0.2rem 0.6rem", borderRadius: 20,
                background: `${sc}20`, color: sc,
              }}>{program.status}</span>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "rgba(255,255,255,0.1)", border: "none",
                color: "#f0f4ff", fontSize: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0, transition: "background .15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >✕</button>
          </div>
        </div>

        {/* ── Body (scrollable) ── */}
        <div style={{ overflowY: "auto", padding: "1.4rem 1.6rem", flex: 1 }}>

          {/* Info grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)",
            gap: "0.8rem", marginBottom: "1.2rem",
          }}>
            {[
              ["⏱️", "Duration",    program.duration],
              ["📋", "Total Units", `${program.units} units`],
              ["🗓️", "Year Levels", `${Object.keys(program.yearLevels).length} levels`],
            ].map(([ic, lb, val]) => (
              <div key={lb} style={{
                background: T.dark ? "rgba(255,255,255,0.04)" : T.bgDeep,
                borderRadius: 10, padding: "0.8rem 0.9rem",
              }}>
                <div style={{ fontSize: "0.68rem", color: T.textMuted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                  {ic} {lb}
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: T.text }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "1.3rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
              📝 Description
            </div>
            <p style={{
              background: T.dark ? "rgba(94,234,212,0.05)" : "rgba(20,184,166,0.05)",
              borderLeft: "3px solid #5eead4",
              borderRadius: "0 8px 8px 0",
              padding: "0.85rem 1rem",
              color: T.textSub, fontSize: "0.84rem", lineHeight: 1.7, margin: 0,
            }}>{program.description}</p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: T.border, margin: "0 0 1.2rem" }} />

          {/* Year levels */}
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.85rem" }}>
            📚 Curriculum by Year Level
          </div>

          {Object.entries(program.yearLevels).map(([year, subjects], yi) => (
            <div key={year} style={{ marginBottom: "1rem" }}>
              {/* Year header */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                marginBottom: "0.5rem",
              }}>
                <span style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: "0.78rem", fontWeight: 800,
                  color: ["#5eead4", "#a78bfa", "#f472b6", "#fbbf24"][yi % 4],
                }}>{year}</span>
                <div style={{ flex: 1, height: 1, background: T.border }} />
                <span style={{ fontSize: "0.65rem", color: T.textMuted }}>{subjects.length} subjects</span>
              </div>
              {/* Subject chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {subjects.map((code) => (
                  <span key={code} style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.72rem", fontWeight: 600,
                    background: T.dark ? "rgba(255,255,255,0.06)" : T.bgDeep,
                    color: T.textSub,
                    padding: "0.22rem 0.6rem", borderRadius: 5,
                    transition: "background .15s",
                  }}>{code}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: "1rem 1.6rem",
          borderTop: `1px solid ${T.border}`,
          display: "flex", gap: "0.65rem", justifyContent: "flex-end",
          flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            padding: "0.7rem 1.3rem", borderRadius: 10,
            border: `1.5px solid ${T.border}`, background: "transparent",
            color: T.textSub, fontWeight: 600, fontSize: "0.85rem",
            cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5eead4"; e.currentTarget.style.color = "#5eead4"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; }}
          >Close</button>
          <button style={{
            padding: "0.7rem 1.3rem", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg,#5eead4,#3b82f6)",
            color: "#07061a", fontWeight: 700, fontSize: "0.85rem",
            cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            transition: "all .15s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
          >✏️ Edit Program</button>
        </div>
      </div>
    </div>
  );
}