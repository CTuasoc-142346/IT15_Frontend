// src/components/SubjectDetails.jsx
// ─────────────────────────────────────────────
// Modal: full subject detail view
//   - Code, title, units, semester, term
//   - Pre-requisites and co-requisites
//   - Description, program assignment
// ─────────────────────────────────────────────

const TERM_STYLE = {
  Semester: { color: "#5eead4", bg: "rgba(94,234,212,0.12)", label: "📅 Semester" },
  Term:     { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", label: "📆 Term"   },
  Both:     { color: "#34d399", bg: "rgba(52,211,153,0.12)", label: "🗓️ Both"   },
};

const ReqChip = ({ code, T, color }) => (
  <span style={{
    fontFamily: "'Courier New', monospace",
    fontSize: "0.73rem", fontWeight: 700,
    background: color ? `${color}14` : T.dark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
    color: color || T.textSub,
    padding: "0.22rem 0.6rem", borderRadius: 5,
  }}>{code.trim()}</span>
);

export default function SubjectDetails({ T, subject, onClose }) {
  if (!subject) return null;
  const ts = TERM_STYLE[subject.term] || TERM_STYLE.Semester;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 400,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
        padding: "1rem", animation: "fadeIn .2s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.dark ? "#0d0b28" : "#ffffff",
          border: `1px solid ${T.border}`,
          borderRadius: 18,
          width: "100%", maxWidth: 620,
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
          padding: "1.4rem 1.6rem",
          position: "relative", overflow: "hidden", flexShrink: 0,
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.15),transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: "0.78rem", fontWeight: 800, color: "#5eead4", letterSpacing: "0.06em" }}>
                  {subject.code}
                </span>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: 20, background: ts.bg, color: ts.color }}>
                  {ts.label}
                </span>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: 20, background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>
                  {subject.program}
                </span>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#f0f4ff", margin: 0, lineHeight: 1.25 }}>
                {subject.title}
              </h2>
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

        {/* ── Body ── */}
        <div style={{ overflowY: "auto", padding: "1.4rem 1.6rem", flex: 1 }}>

          {/* Quick info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.8rem", marginBottom: "1.2rem" }}>
            {[
              ["📋", "Units",    `${subject.units} units`],
              ["📅", "Semester", subject.semester],
              ["🗓️", "Term",    subject.term],
            ].map(([ic, lb, val]) => (
              <div key={lb} style={{
                background: T.dark ? "rgba(255,255,255,0.04)" : T.bgDeep,
                borderRadius: 10, padding: "0.75rem 0.9rem",
              }}>
                <div style={{ fontSize: "0.65rem", color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>
                  {ic} {lb}
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.text }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "1.2rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
              📝 Description
            </div>
            <p style={{
              background: T.dark ? "rgba(167,139,250,0.06)" : "rgba(99,102,241,0.04)",
              borderLeft: "3px solid #a78bfa",
              borderRadius: "0 8px 8px 0",
              padding: "0.85rem 1rem",
              color: T.textSub, fontSize: "0.84rem", lineHeight: 1.7, margin: 0,
            }}>{subject.description}</p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: T.border, margin: "0 0 1.1rem" }} />

          {/* Pre-requisites + Co-requisites */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.5rem" }}>
            {/* Prereqs */}
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.55rem" }}>
                ⚠️ Pre-requisites
              </div>
              {subject.prereqs === "None" ? (
                <span style={{ fontSize: "0.8rem", color: T.textMuted, fontStyle: "italic" }}>None</span>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {subject.prereqs.split(",").map((c) => (
                    <ReqChip key={c} code={c} T={T} color="#f87171" />
                  ))}
                </div>
              )}
            </div>

            {/* Coreqs */}
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.55rem" }}>
                🔗 Co-requisites
              </div>
              {subject.coreqs === "None" ? (
                <span style={{ fontSize: "0.8rem", color: T.textMuted, fontStyle: "italic" }}>None</span>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {subject.coreqs.split(",").map((c) => (
                    <ReqChip key={c} code={c} T={T} color="#fbbf24" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: "1rem 1.6rem", borderTop: `1px solid ${T.border}`,
          display: "flex", gap: "0.65rem", justifyContent: "flex-end", flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            padding: "0.7rem 1.2rem", borderRadius: 10,
            border: `1.5px solid ${T.border}`, background: "transparent",
            color: T.textSub, fontWeight: 600, fontSize: "0.85rem",
            cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5eead4"; e.currentTarget.style.color = "#5eead4"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; }}
          >Close</button>
          <button style={{
            padding: "0.7rem 1.3rem", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg,#a78bfa,#6366f1)",
            color: "white", fontWeight: 700, fontSize: "0.85rem",
            cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
          >✏️ Edit Subject</button>
        </div>
      </div>
    </div>
  );
}