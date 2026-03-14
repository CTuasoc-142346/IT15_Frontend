// src/components/SubjectList.jsx
// ─────────────────────────────────────────────────────────────────
// Subject Offerings page
//   - Filter by Program, Year Level, Semester, Search
//   - Subject cards showing title, code, units, type, prerequisites
// ─────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { useFetch } from "../hooks/useFetch";

// ── Type badge colours ────────────────────────────────────────
const TYPE_STYLE = {
  "Lecture":       { color: "#60a5fa", bg: "rgba(96,165,250,0.1)"  },
  "Laboratory":    { color: "#34d399", bg: "rgba(52,211,153,0.1)"  },
  "Lecture & Lab": { color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
};

const typeStyle = (t) => TYPE_STYLE[t] ?? TYPE_STYLE["Lecture"];

// ── Semester display names ────────────────────────────────────
const SEM_LABELS = { "1st": "1st Semester", "2nd": "2nd Semester", "Summer": "Summer" };
const YEAR_LABELS = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" };

// ── Shimmer ───────────────────────────────────────────────────
const Shimmer = ({ T, h = 16, w = "100%", r = 6 }) => (
  <div style={{
    height: h, width: w, borderRadius: r,
    background: T.dark
      ? "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)"
      : "linear-gradient(90deg,#f0f4ff 25%,#e2e8f0 50%,#f0f4ff 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease-in-out infinite",
  }} />
);

const SubjectSkeleton = ({ T }) => (
  <div style={{
    background: T.surface, border: `1px solid ${T.border}`,
    borderRadius: 12, padding: "1rem",
    display: "flex", flexDirection: "column", gap: "0.55rem",
  }}>
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Shimmer T={T} h={18} w={70} r={6} />
      <Shimmer T={T} h={18} w={80} r={20} />
    </div>
    <Shimmer T={T} h={14} w="85%" />
    <div style={{ display: "flex", gap: "0.4rem" }}>
      <Shimmer T={T} h={16} w={60} r={8} />
      <Shimmer T={T} h={16} w={80} r={8} />
    </div>
  </div>
);

// ── Subject card ──────────────────────────────────────────────
function SubjectCard({ subject, T }) {
  const [hov, setHov] = useState(false);
  const ts = typeStyle(subject.type);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.surface,
        border: `1px solid ${hov ? ts.color + "55" : T.border}`,
        borderRadius: 12, padding: "1rem 1.1rem",
        display: "flex", flexDirection: "column", gap: "0.45rem",
        transition: "all .18s",
        boxShadow: hov ? T.cardHover : T.shadow,
        transform: hov ? "translateY(-2px)" : "none",
        animation: "fadeInUp .35s ease both",
      }}
    >
      {/* Code + type badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
        <span style={{
          fontSize: "0.7rem", fontWeight: 700,
          fontFamily: "'DM Mono','Courier New',monospace",
          color: "#5eead4", background: "rgba(94,234,212,0.1)",
          padding: "0.16rem 0.55rem", borderRadius: 6,
          letterSpacing: "0.04em",
        }}>{subject.code}</span>
        <span style={{
          fontSize: "0.62rem", fontWeight: 700,
          padding: "0.16rem 0.5rem", borderRadius: 20,
          background: ts.bg, color: ts.color,
        }}>{subject.type}</span>
      </div>

      {/* Title */}
      <div style={{
        fontSize: "0.88rem", fontWeight: 700, color: T.text,
        lineHeight: 1.35,
        fontFamily: "'Syne',sans-serif",
      }}>{subject.title}</div>

      {/* Meta row */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{
          fontSize: "0.67rem", color: T.textMuted,
          background: T.dark ? "rgba(255,255,255,0.05)" : "#f0f4ff",
          padding: "0.15rem 0.45rem", borderRadius: 6,
        }}>📚 {subject.units} unit{subject.units !== 1 ? "s" : ""}</span>
        <span style={{
          fontSize: "0.67rem", color: T.textMuted,
          background: T.dark ? "rgba(255,255,255,0.05)" : "#f0f4ff",
          padding: "0.15rem 0.45rem", borderRadius: 6,
        }}>📅 {SEM_LABELS[subject.semester] ?? subject.semester}</span>
        <span style={{
          fontSize: "0.67rem", color: T.textMuted,
          background: T.dark ? "rgba(255,255,255,0.05)" : "#f0f4ff",
          padding: "0.15rem 0.45rem", borderRadius: 6,
        }}>🎓 {YEAR_LABELS[subject.year_level] ?? `Year ${subject.year_level}`}</span>
      </div>

      {/* Prerequisites */}
      {subject.prerequisites && subject.prerequisites !== "None" && (
        <div style={{ fontSize: "0.67rem", color: T.textMuted, display: "flex", gap: "0.3rem", alignItems: "flex-start" }}>
          <span style={{ color: "#fbbf24", flexShrink: 0 }}>⚠️</span>
          <span>Pre-req: <span style={{ color: T.textSub }}>{subject.prerequisites}</span></span>
        </div>
      )}

      {/* Program */}
      {subject.program && (
        <div style={{
          fontSize: "0.64rem", color: T.textMuted,
          borderTop: `1px solid ${T.border}`, paddingTop: "0.4rem", marginTop: "0.1rem",
        }}>
          🏛️ {subject.program.code}
          {subject.program.department && (
            <span style={{ color: T.textMuted }}> · {subject.program.department.code}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Filter pill button ────────────────────────────────────────
const FilterPill = ({ label, active, color = "#5eead4", onClick, T }) => (
  <button onClick={onClick} style={{
    padding: "0.38rem 0.75rem", borderRadius: 20, border: "none",
    background: active
      ? `rgba(${color === "#5eead4" ? "94,234,212" : color === "#a78bfa" ? "167,139,250" : "251,191,36"},0.15)`
      : T.dark ? "rgba(255,255,255,0.05)" : "#f0f4ff",
    color: active ? color : T.textSub,
    fontWeight: active ? 700 : 500, fontSize: "0.75rem",
    cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
    transition: "all .15s",
    border: `1px solid ${active ? color + "40" : T.border}`,
    whiteSpace: "nowrap",
  }}>{label}</button>
);

// ── Main export ───────────────────────────────────────────────
export default function SubjectList({ T, bp }) {
  const { sm, md } = bp;

  const [selectedProgId,  setSelectedProgId]  = useState("");
  const [selectedYear,    setSelectedYear]     = useState("");
  const [selectedSem,     setSelectedSem]      = useState("");
  const [searchInput,     setSearchInput]      = useState("");
  const [search,          setSearch]           = useState("");

  // All programs for filter dropdown
  const { data: programs } = useFetch("/programs");
  const progList = programs ?? [];

  // Build subject params
  const params = { per_page: 50 };
  if (selectedProgId) params.program_id = selectedProgId;
  if (selectedYear)   params.year_level  = selectedYear;
  if (selectedSem)    params.semester    = selectedSem;
  if (search)         params.search      = search;

  const { data, loading, error, refetch } = useFetch("/subjects", { params });
  const subjects = data?.data ?? [];

  const handleSearch = useCallback(() => setSearch(searchInput.trim()), [searchInput]);

  const clearAll = () => {
    setSelectedProgId(""); setSelectedYear(""); setSelectedSem("");
    setSearch(""); setSearchInput("");
  };

  const hasFilters = selectedProgId || selectedYear || selectedSem || search;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      <style>{`
        @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Header ── */}
      <div style={{ animation: "fadeInUp .4s ease" }}>
        <h2 style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: sm ? "1.3rem" : "1.6rem",
          fontWeight: 800, color: T.text,
          margin: "0 0 0.2rem", letterSpacing: "-0.03em",
        }}>Subject Offerings 📚</h2>
        <p style={{ color: T.textMuted, fontSize: "0.8rem", margin: 0 }}>
          Browse all subjects by program, year level, and semester
        </p>
      </div>

      {/* ── Filters ── */}
      <div style={{
        display: "flex", flexDirection: "column", gap: "0.7rem",
        animation: "fadeInUp .4s ease .05s both",
        padding: "1rem",
        background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`,
      }}>
        {/* Search + Program select row */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ display: "flex", gap: "0.4rem", flex: 1, minWidth: 200 }}>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search subject code or title…"
              style={{
                flex: 1, padding: "0.6rem 0.9rem", borderRadius: 9,
                border: `1.5px solid ${T.inputBorder}`,
                background: T.inputBg, color: T.text,
                fontSize: "0.82rem", fontFamily: "'DM Sans',sans-serif", outline: "none",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#5eead4"; }}
              onBlur={(e)  => { e.target.style.borderColor = T.inputBorder; }}
            />
            <button onClick={handleSearch} style={{
              padding: "0.6rem 0.9rem", borderRadius: 9,
              background: "linear-gradient(135deg,#5eead4,#3b82f6)",
              border: "none", color: "#07061a",
              fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
            }}>🔍</button>
          </div>

          {/* Program dropdown */}
          <div style={{ position: "relative", minWidth: 200 }}>
            <select
              value={selectedProgId}
              onChange={(e) => setSelectedProgId(e.target.value)}
              style={{
                width: "100%", padding: "0.6rem 2rem 0.6rem 0.9rem",
                borderRadius: 9, border: `1.5px solid ${T.inputBorder}`,
                background: T.inputBg, color: T.text,
                fontSize: "0.82rem", fontFamily: "'DM Sans',sans-serif",
                appearance: "none", cursor: "pointer", outline: "none",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#5eead4"; }}
              onBlur={(e)  => { e.target.style.borderColor = T.inputBorder; }}
            >
              <option value="">All Programs</option>
              {progList.map((p) => (
                <option key={p.id} value={p.id}>{p.code}</option>
              ))}
            </select>
            <span style={{
              position: "absolute", right: "0.65rem", top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none",
              color: T.textMuted, fontSize: "0.7rem",
            }}>▾</span>
          </div>
        </div>

        {/* Year level pills */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.68rem", color: T.textMuted, fontWeight: 700, marginRight: "0.2rem" }}>YEAR:</span>
          <FilterPill T={T} label="All"     active={!selectedYear}    onClick={() => setSelectedYear("")} />
          <FilterPill T={T} label="1st Year" active={selectedYear==="1"} onClick={() => setSelectedYear("1")} />
          <FilterPill T={T} label="2nd Year" active={selectedYear==="2"} onClick={() => setSelectedYear("2")} />
          <FilterPill T={T} label="3rd Year" active={selectedYear==="3"} onClick={() => setSelectedYear("3")} />
          <FilterPill T={T} label="4th Year" active={selectedYear==="4"} onClick={() => setSelectedYear("4")} />
        </div>

        {/* Semester pills */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.68rem", color: T.textMuted, fontWeight: 700, marginRight: "0.2rem" }}>SEM:</span>
          <FilterPill T={T} label="All"          active={!selectedSem}         onClick={() => setSelectedSem("")}      color="#5eead4" />
          <FilterPill T={T} label="1st Semester" active={selectedSem==="1st"}  onClick={() => setSelectedSem("1st")}  color="#5eead4" />
          <FilterPill T={T} label="2nd Semester" active={selectedSem==="2nd"}  onClick={() => setSelectedSem("2nd")}  color="#a78bfa" />
          <FilterPill T={T} label="Summer"       active={selectedSem==="Summer"} onClick={() => setSelectedSem("Summer")} color="#fbbf24" />
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button onClick={clearAll} style={{
            alignSelf: "flex-start", padding: "0.35rem 0.75rem",
            borderRadius: 8, border: `1px solid ${T.border}`,
            background: "transparent", color: T.textMuted,
            fontSize: "0.73rem", cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
          }}>✕ Clear all filters</button>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          padding: "0.8rem 1rem", borderRadius: 10,
          background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
        }}>
          <span>⚠️</span>
          <span style={{ color: "#fca5a5", fontSize: "0.82rem", flex: 1 }}>{error}</span>
          <button onClick={refetch} style={{
            background: "none", border: "none", color: "#5eead4",
            cursor: "pointer", fontSize: "0.78rem", fontWeight: 700,
            fontFamily: "'DM Sans',sans-serif",
          }}>↻ Retry</button>
        </div>
      )}

      {/* ── Count ── */}
      {!loading && !error && (
        <div style={{ color: T.textMuted, fontSize: "0.75rem" }}>
          {subjects.length === 0
            ? "No subjects found"
            : `Showing ${subjects.length} of ${data?.total ?? subjects.length} subjects`}
          {search && <span style={{ color: "#5eead4", fontWeight: 600 }}> · "{search}"</span>}
        </div>
      )}

      {/* ── Grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: sm
          ? "1fr"
          : md
            ? "repeat(2,1fr)"
            : "repeat(3,1fr)",
        gap: "0.75rem",
      }}>
        {loading
          ? [1,2,3,4,5,6,7,8,9].map((i) => <SubjectSkeleton key={i} T={T} />)
          : subjects.length === 0
            ? (
              <div style={{
                gridColumn: "1/-1", textAlign: "center",
                padding: "3rem 1rem", color: T.textMuted, fontSize: "0.85rem",
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📚</div>
                No subjects match the selected filters.
              </div>
            )
            : subjects.map((subj) => (
              <SubjectCard key={subj.id} subject={subj} T={T} />
            ))
        }
      </div>
    </div>
  );
}