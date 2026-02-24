// src/components/SubjectList.jsx
// ─────────────────────────────────────────────
// Subject Offerings module:
//   - Table list with column headers (desktop)
//   - Card list (mobile)
//   - Search by code or title
//   - Filter: semester, term, program, units, prereqs
//   - Click row → SubjectDetails modal
//   - Add Subject modal (design only)
// ─────────────────────────────────────────────

import { useState, useMemo } from "react";
import { SUBJECTS, PROGRAMS } from "../data/mockData";
import SubjectCard from "./SubjectCard";
import SubjectDetails from "./SubjectDetails";
import FilterBar from "./FilterBar";
import { EmptyState } from "./UI";

export default function SubjectList({ T, bp }) {
  const { sm } = bp;
  const [search,       setSearch]       = useState("");
  const [filterSem,    setFilterSem]    = useState("");
  const [filterTerm,   setFilterTerm]   = useState("");
  const [filterProg,   setFilterProg]   = useState("");
  const [filterUnits,  setFilterUnits]  = useState("");
  const [filterPrereq, setFilterPrereq] = useState("");
  const [selected,     setSelected]     = useState(null);
  const [showAdd,      setShowAdd]      = useState(false);

  // Filtered subjects
  const filtered = useMemo(() => {
    return SUBJECTS.filter((s) => {
      const q = search.toLowerCase();
      const matchQ      = !q            || s.code.toLowerCase().includes(q) || s.title.toLowerCase().includes(q);
      const matchSem    = !filterSem    || s.semester === filterSem;
      const matchTerm   = !filterTerm   || s.term     === filterTerm;
      const matchProg   = !filterProg   || s.program  === filterProg;
      const matchUnits  = !filterUnits  || String(s.units) === filterUnits;
      const matchPrereq = !filterPrereq || (filterPrereq === "yes" ? s.prereqs !== "None" : s.prereqs === "None");
      return matchQ && matchSem && matchTerm && matchProg && matchUnits && matchPrereq;
    });
  }, [search, filterSem, filterTerm, filterProg, filterUnits, filterPrereq]);

  const uniqueSems  = [...new Set(SUBJECTS.map((s) => s.semester))].filter(Boolean);
  const uniqueTerms = ["Semester", "Term", "Both"];
  const uniqueProgs = [...new Set(SUBJECTS.map((s) => s.program))];
  const uniqueUnits = [...new Set(SUBJECTS.map((s) => s.units))].sort((a, b) => a - b);

  const resetAll = () => {
    setSearch(""); setFilterSem(""); setFilterTerm("");
    setFilterProg(""); setFilterUnits(""); setFilterPrereq("");
  };

  const inp = {
    width: "100%", padding: "0.65rem 0.85rem", borderRadius: 9,
    border: `1.5px solid ${T.inputBorder}`, background: T.inputBg,
    color: T.text, fontSize: "0.84rem", fontFamily: "'DM Sans',sans-serif",
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
        }}>Subject Offerings 📚</h2>
        <p style={{ color: T.textMuted, fontSize: "0.8rem", margin: 0 }}>
          Browse and manage all subject listings
        </p>
      </div>

      {/* ── Main Card ── */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 14, overflow: "hidden",
        animation: "fadeInUp .45s ease .08s both",
      }}>
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: sm ? "0.9rem 1rem" : "1rem 1.2rem",
          borderBottom: `1px solid ${T.border}`, gap: "0.75rem", flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.92rem", fontWeight: 700, color: T.text }}>
              All Subjects
            </div>
            <div style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 2 }}>
              {filtered.length} of {SUBJECTS.length} subjects
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: sm ? "0.5rem 0.9rem" : "0.6rem 1.1rem",
              borderRadius: 9, border: "none",
              background: "linear-gradient(135deg,#a78bfa,#6366f1)",
              color: "white", fontWeight: 700,
              fontSize: sm ? "0.75rem" : "0.82rem",
              fontFamily: "'DM Sans',sans-serif",
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "all .18s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
          >+ Add Subject</button>
        </div>

        {/* Filter bar */}
        <FilterBar
          T={T}
          search={search} onSearch={setSearch}
          filters={[
            { label: "All Semesters", value: filterSem,  onChange: setFilterSem,  options: uniqueSems.map((s) => ({ label: s, value: s })) },
            { label: "All Terms",     value: filterTerm,  onChange: setFilterTerm, options: uniqueTerms.map((t) => ({ label: t, value: t })) },
            { label: "All Programs",  value: filterProg,  onChange: setFilterProg, options: uniqueProgs.map((p) => ({ label: p, value: p })) },
            { label: "All Units",     value: filterUnits, onChange: setFilterUnits,options: uniqueUnits.map((u) => ({ label: `${u} units`, value: String(u) })) },
            {
              label: "Prerequisites", value: filterPrereq, onChange: setFilterPrereq,
              options: [{ label: "With Prereqs", value: "yes" }, { label: "Without Prereqs", value: "no" }],
            },
          ]}
          actions={[
            { label: "Reset", icon: "↺", onClick: resetAll, variant: "ghost" },
          ]}
        />

        {/* Column headers — desktop only */}
        {!sm && filtered.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "90px 1fr 55px 130px 110px 90px 60px",
            gap: "0.75rem",
            padding: "0.6rem 1.2rem",
            background: T.dark ? "rgba(255,255,255,0.03)" : T.bgDeep,
            borderBottom: `1px solid ${T.border}`,
          }}>
            {["Code", "Title", "Units", "Semester", "Term", "Program", ""].map((h) => (
              <span key={h} style={{
                fontSize: "0.63rem", fontWeight: 700,
                color: T.textMuted, textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>{h}</span>
            ))}
          </div>
        )}

        {/* Rows */}
        {filtered.length === 0 ? (
          <EmptyState T={T} icon="📭" message="No subjects match your filters." />
        ) : (
          <div>
            {filtered.map((s, i) => (
              <SubjectCard key={s.id} T={T} subject={s} onClick={setSelected} index={i} sm={sm} />
            ))}
          </div>
        )}
      </div>

      {/* ── Subject Details Modal ── */}
      {selected && (
        <SubjectDetails T={T} subject={selected} onClose={() => setSelected(null)} />
      )}

      {/* ── Add Subject Modal (Design Only) ── */}
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
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#1e1b4b,#0d0b28)", padding: "1.3rem 1.5rem", position: "relative", overflow: "hidden", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.12),transparent 70%)", pointerEvents: "none" }} />
              <div style={{ fontSize: "0.68rem", color: "#a78bfa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.35rem" }}>Subject Form</div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "#f0f4ff", margin: 0 }}>Add New Subject</h2>
              <button onClick={() => setShowAdd(false)} style={{ position: "absolute", top: 18, right: 18, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "#f0f4ff", fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* Body */}
            <div style={{ overflowY: "auto", padding: "1.3rem 1.5rem", flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                {[
                  ["Subject Code",   "e.g., IT101",     "text",     false],
                  ["Units",          "e.g., 3",          "number",   false],
                  ["Subject Title",  "Subject title",    "text",     true ],
                  ["Semester",       null,               "selSem",   false],
                  ["Term Type",      null,               "selTerm",  false],
                  ["Program",        null,               "selProg",  false],
                  ["Pre-requisites", "e.g., IT101 or None", "text", false],
                  ["Co-requisites",  "e.g., IT102 or None", "text", false],
                  ["Description",    "Subject description…", "textarea", true],
                ].map(([label, ph, type, full]) => (
                  <div key={label} style={{ gridColumn: full ? "1 / -1" : "auto" }}>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>
                      {label}
                    </label>
                    {type === "selSem"  ? (
                      <select style={{ ...inp }}>
                        {["1st Semester","2nd Semester","Both"].map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : type === "selTerm" ? (
                      <select style={{ ...inp }}>
                        {["Semester","Term","Both"].map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : type === "selProg" ? (
                      <select style={{ ...inp }}>
                        {PROGRAMS.map((p) => <option key={p.id} value={p.code}>{p.code}</option>)}
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

            {/* Footer */}
            <div style={{ padding: "1rem 1.5rem", borderTop: `1px solid ${T.border}`, display: "flex", gap: "0.6rem", justifyContent: "flex-end", flexShrink: 0 }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: "0.7rem 1.2rem", borderRadius: 10, border: `1.5px solid ${T.border}`, background: "transparent", color: T.textSub, fontWeight: 600, fontSize: "0.84rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
              <button style={{ padding: "0.7rem 1.3rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#a78bfa,#6366f1)", color: "white", fontWeight: 700, fontSize: "0.84rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Save Subject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}