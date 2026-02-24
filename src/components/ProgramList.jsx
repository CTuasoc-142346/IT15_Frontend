// src/components/ProgramList.jsx
// ─────────────────────────────────────────────
// Program Offerings module:
//   - Grid of ProgramCards
//   - Search by code or name
//   - Filter by status and type
//   - Click → ProgramDetails modal
//   - Add/Edit modal (design only)
// ─────────────────────────────────────────────

import { useState, useMemo } from "react";
import { PROGRAMS } from "../data/mockData";
import ProgramCard from "./ProgramCard";
import ProgramDetails from "./ProgramDetails";
import FilterBar from "./FilterBar";
import { EmptyState } from "./UI";

export default function ProgramList({ T, bp }) {
  const { sm } = bp;
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType,   setFilterType]   = useState("");
  const [selected,     setSelected]     = useState(null);
  const [showAdd,      setShowAdd]      = useState(false);

  // Derived filtered list
  const filtered = useMemo(() => {
    return PROGRAMS.filter((p) => {
      const q = search.toLowerCase();
      const matchQ = !q || p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
      const matchS = !filterStatus || p.status === filterStatus;
      const matchT = !filterType   || p.type   === filterType;
      return matchQ && matchS && matchT;
    });
  }, [search, filterStatus, filterType]);

  const uniqueStatuses = [...new Set(PROGRAMS.map((p) => p.status))];
  const uniqueTypes    = [...new Set(PROGRAMS.map((p) => p.type))];

  const inp = {
    width: "100%", padding: "0.65rem 0.85rem",
    borderRadius: 9, border: `1.5px solid ${T.inputBorder}`,
    background: T.inputBg, color: T.text,
    fontSize: "0.84rem", fontFamily: "'DM Sans',sans-serif",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: sm ? "0.9rem" : "1.2rem" }}>

      {/* ── Page Header ── */}
      <div style={{ animation: "fadeInUp .4s ease" }}>
        <h2 style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: sm ? "1.3rem" : "1.6rem",
          fontWeight: 800, color: T.text,
          margin: "0 0 0.2rem", letterSpacing: "-0.03em",
        }}>Program Offerings 🎓</h2>
        <p style={{ color: T.textMuted, fontSize: "0.8rem", margin: 0 }}>
          Manage and view all academic programs
        </p>
      </div>

      {/* ── Card with filter + grid ── */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 14, overflow: "hidden",
        animation: "fadeInUp .45s ease .08s both",
      }}>
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: sm ? "0.9rem 1rem" : "1rem 1.3rem",
          borderBottom: `1px solid ${T.border}`, gap: "0.75rem", flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.92rem", fontWeight: 700, color: T.text }}>
              All Programs
            </div>
            <div style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 2 }}>
              {filtered.length} of {PROGRAMS.length} programs
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: sm ? "0.5rem 0.9rem" : "0.6rem 1.1rem",
              borderRadius: 9, border: "none",
              background: "linear-gradient(135deg,#5eead4,#3b82f6)",
              color: "#07061a", fontWeight: 700,
              fontSize: sm ? "0.75rem" : "0.82rem",
              fontFamily: "'DM Sans',sans-serif",
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "all .18s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
          >+ Add Program</button>
        </div>

        {/* Filter bar */}
        <FilterBar
          T={T}
          search={search} onSearch={setSearch}
          filters={[
            {
              label: "All Statuses", value: filterStatus, onChange: setFilterStatus,
              options: uniqueStatuses.map((s) => ({ label: s, value: s })),
            },
            {
              label: "All Types", value: filterType, onChange: setFilterType,
              options: uniqueTypes.map((t) => ({ label: t, value: t })),
            },
          ]}
          actions={[
            {
              label: "Reset", icon: "↺",
              onClick: () => { setSearch(""); setFilterStatus(""); setFilterType(""); },
              variant: "ghost",
            },
          ]}
        />

        {/* Grid */}
        {filtered.length === 0 ? (
          <EmptyState T={T} icon="🔍" message="No programs match your search." />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: sm ? "1fr" : "repeat(auto-fill,minmax(280px,1fr))",
            gap: "1rem",
            padding: sm ? "1rem" : "1.2rem 1.3rem",
          }}>
            {filtered.map((p, i) => (
              <ProgramCard key={p.id} T={T} program={p} onClick={setSelected} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ── ProgramDetails Modal ── */}
      {selected && (
        <ProgramDetails T={T} program={selected} onClose={() => setSelected(null)} />
      )}

      {/* ── Add Program Modal (Design Only) ── */}
      {showAdd && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 400,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
            padding: "1rem", animation: "fadeIn .2s ease",
          }}
          onClick={() => setShowAdd(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: T.dark ? "#0d0b28" : "#ffffff",
              border: `1px solid ${T.border}`,
              borderRadius: 18, width: "100%", maxWidth: 560,
              maxHeight: "90vh", overflow: "hidden",
              display: "flex", flexDirection: "column",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
              animation: "scaleIn .25s ease",
            }}
          >
            {/* Modal Header */}
            <div style={{
              background: "linear-gradient(135deg,#1e1b4b,#0d0b28)",
              padding: "1.3rem 1.5rem", position: "relative", overflow: "hidden", flexShrink: 0,
            }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,rgba(94,234,212,0.1),transparent 70%)", pointerEvents: "none" }} />
              <div style={{ fontSize: "0.68rem", color: "#5eead4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.35rem" }}>Program Form</div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#f0f4ff", margin: 0 }}>Add New Program</h2>
              <button onClick={() => setShowAdd(false)} style={{ position: "absolute", top: 18, right: 18, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "#f0f4ff", fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* Modal Body */}
            <div style={{ overflowY: "auto", padding: "1.3rem 1.5rem", flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                {[
                  ["Program Code", "e.g., BSIT", "text", false],
                  ["Program Type", null, "select", false],
                  ["Program Name", "Full program name", "text", true],
                  ["Duration",     "e.g., 4 years", "text", false],
                  ["Total Units",  "e.g., 168", "number", false],
                  ["Status",       null, "select", false],
                  ["Description",  "Program description…", "textarea", true],
                ].map(([label, ph, type, full]) => (
                  <div key={label} style={{ gridColumn: full ? "1 / -1" : "auto" }}>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>
                      {label}
                    </label>
                    {type === "select" ? (
                      <select style={{ ...inp }}>
                        {label === "Program Type"
                          ? ["Bachelor's", "Diploma", "Associate", "Master's"].map((o) => <option key={o}>{o}</option>)
                          : ["Active", "Under Review", "Phased Out"].map((o) => <option key={o}>{o}</option>)
                        }
                      </select>
                    ) : type === "textarea" ? (
                      <textarea placeholder={ph} rows={3} style={{ ...inp, resize: "vertical" }} />
                    ) : (
                      <input type={type} placeholder={ph} style={inp} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "1rem 1.5rem", borderTop: `1px solid ${T.border}`, display: "flex", gap: "0.6rem", justifyContent: "flex-end", flexShrink: 0 }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: "0.7rem 1.2rem", borderRadius: 10, border: `1.5px solid ${T.border}`, background: "transparent", color: T.textSub, fontWeight: 600, fontSize: "0.84rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
              <button style={{ padding: "0.7rem 1.3rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#5eead4,#3b82f6)", color: "#07061a", fontWeight: 700, fontSize: "0.84rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Save Program</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}