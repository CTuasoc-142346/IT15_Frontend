// src/components/ProgramList.jsx
// ─────────────────────────────────────────────────────────────────
// Program Offerings page
//   - Department dropdown filter
//   - Program cards (code, name, duration, units, description, status)
//   - Click "View Curriculum" → modal with subjects grouped by
//     year level + semester (subject titles only, per mockData style)
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useFetch } from "../hooks/useFetch";

// ── Status badge colours ──────────────────────────────────────
const STATUS = {
  Active:      { color: "#34d399", bg: "rgba(52,211,153,0.12)"  },
  "Phased Out":{ color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  Inactive:    { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

const statusStyle = (s) => STATUS[s] ?? STATUS["Active"];

// ── Duration label ────────────────────────────────────────────
const durLabel = (yrs) => `${yrs}-Year Program`;

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

const CardSkeleton = ({ T }) => (
  <div style={{
    background: T.surface, border: `1px solid ${T.border}`,
    borderRadius: 14, padding: "1.3rem",
    display: "flex", flexDirection: "column", gap: "0.7rem",
  }}>
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Shimmer T={T} h={26} w={60} r={20} />
      <Shimmer T={T} h={20} w={70} r={20} />
    </div>
    <Shimmer T={T} h={15} w="80%" />
    <Shimmer T={T} h={11} w="95%" />
    <Shimmer T={T} h={11} w="70%" />
    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.3rem" }}>
      <Shimmer T={T} h={20} w={80} r={6} />
      <Shimmer T={T} h={20} w={80} r={6} />
    </div>
    <Shimmer T={T} h={34} r={8} />
  </div>
);

// ── Curriculum Modal ──────────────────────────────────────────
function CurriculumModal({ programId, T, onClose }) {
  const { data: prog, loading, error, refetch } = useFetch(
    programId ? `/programs/${programId}` : null
  );

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
        animation: "fadeIn .18s ease",
      }} />

      {/* Panel */}
      <div style={{
        position: "fixed", zIndex: 51,
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "min(780px, calc(100vw - 2rem))",
        maxHeight: "calc(100vh - 3rem)",
        display: "flex", flexDirection: "column",
        borderRadius: 18,
        background: T.dark ? "#0d0b28" : "#ffffff",
        border: `1px solid ${T.border}`,
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        animation: "scaleIn .22s ease",
        fontFamily: "'DM Sans',sans-serif",
        overflow: "hidden",
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: "1.2rem 1.5rem",
          borderBottom: `1px solid ${T.border}`,
          background: T.dark
            ? "linear-gradient(135deg,rgba(94,234,212,0.06),rgba(59,130,246,0.06))"
            : "linear-gradient(135deg,rgba(20,184,166,0.05),rgba(59,130,246,0.05))",
          flexShrink: 0,
        }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Shimmer T={T} h={13} w={120} r={6} />
              <Shimmer T={T} h={20} w="60%" r={6} />
            </div>
          ) : error ? (
            <span style={{ color: "#f87171", fontSize: "0.85rem" }}>Failed to load program.</span>
          ) : prog ? (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                  <span style={{
                    fontFamily: "'Syne',sans-serif", fontWeight: 800,
                    fontSize: "1rem", color: "#5eead4",
                    background: "rgba(94,234,212,0.12)",
                    padding: "0.18rem 0.65rem", borderRadius: 20,
                  }}>{prog.code}</span>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 700, padding: "0.18rem 0.55rem",
                    borderRadius: 20,
                    background: statusStyle(prog.status).bg,
                    color: statusStyle(prog.status).color,
                  }}>{prog.status}</span>
                  <span style={{ fontSize: "0.68rem", color: T.textMuted }}>
                    {prog.department?.name}
                  </span>
                </div>
                <h2 style={{
                  fontFamily: "'Syne',sans-serif", fontWeight: 800,
                  fontSize: "1.1rem", color: T.text,
                  margin: "0 0 0.3rem", letterSpacing: "-0.02em", lineHeight: 1.3,
                }}>{prog.name}</h2>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {[
                    { icon: "🎓", label: durLabel(prog.duration_years) },
                    { icon: "📚", label: `${prog.total_units} Total Units` },
                    { icon: "📋", label: `${prog.subjects_count} Subjects` },
                  ].map(({ icon, label }) => (
                    <span key={label} style={{ fontSize: "0.72rem", color: T.textMuted }}>
                      {icon} {label}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={onClose} style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                border: "none", background: T.dark ? "rgba(255,255,255,0.07)" : "#f1f5f9",
                color: T.textSub, fontSize: "0.9rem", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>
          ) : null}

          {/* Close button when loading/error */}
          {(loading || error) && (
            <button onClick={onClose} style={{
              position: "absolute", top: "1rem", right: "1.2rem",
              width: 30, height: 30, borderRadius: "50%",
              border: "none", background: T.dark ? "rgba(255,255,255,0.07)" : "#f1f5f9",
              color: T.textSub, fontSize: "0.9rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          )}
        </div>

        {/* ── Curriculum Body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.2rem 1.5rem" }}>
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <Shimmer T={T} h={14} w={120} r={6} />
                  {[1,2,3,4,5].map((j) => <Shimmer key={j} T={T} h={11} w="90%" r={4} />)}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "0.6rem", padding: "2rem",
            }}>
              <span style={{ fontSize: "2rem" }}>⚠️</span>
              <span style={{ color: "#fca5a5", fontSize: "0.85rem" }}>{error}</span>
              <button onClick={refetch} style={{
                background: "rgba(94,234,212,0.12)", border: "1px solid rgba(94,234,212,0.3)",
                borderRadius: 8, padding: "0.4rem 0.8rem",
                color: "#5eead4", fontWeight: 700, cursor: "pointer", fontSize: "0.8rem",
                fontFamily: "'DM Sans',sans-serif",
              }}>↻ Retry</button>
            </div>
          )}

          {prog && prog.curriculum && prog.curriculum.map((yearBlock) => (
            <div key={yearBlock.year_level} style={{ marginBottom: "1.8rem" }}>
              {/* Year heading */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                marginBottom: "0.9rem",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg,#5eead4,#3b82f6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#07061a", fontWeight: 800, fontSize: "0.75rem",
                }}>{yearBlock.year_level}</div>
                <h3 style={{
                  fontFamily: "'Syne',sans-serif", fontWeight: 800,
                  fontSize: "0.97rem", color: T.text, margin: 0,
                }}>{yearBlock.year_label}</h3>
              </div>

              {/* Semesters */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "0.75rem" }}>
                {yearBlock.semesters.map((semBlock) => (
                  <div key={semBlock.semester} style={{
                    background: T.dark ? "rgba(255,255,255,0.03)" : "#f8fafd",
                    border: `1px solid ${T.border}`,
                    borderRadius: 12, padding: "1rem",
                  }}>
                    {/* Semester label + unit count */}
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      marginBottom: "0.65rem",
                      paddingBottom: "0.5rem",
                      borderBottom: `1px solid ${T.border}`,
                    }}>
                      <span style={{
                        fontSize: "0.72rem", fontWeight: 700,
                        color: "#5eead4", textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}>{semBlock.semester_label}</span>
                      <span style={{
                        fontSize: "0.65rem", color: T.textMuted,
                        background: T.dark ? "rgba(255,255,255,0.06)" : "#e8edf5",
                        padding: "0.12rem 0.45rem", borderRadius: 12,
                      }}>{semBlock.total_units} units</span>
                    </div>

                    {/* Subject list — title only */}
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      {semBlock.subjects.map((subj) => (
                        <li key={subj.id} style={{
                          display: "flex", alignItems: "flex-start", gap: "0.45rem",
                        }}>
                          <span style={{
                            width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                            background: "#5eead4", marginTop: "0.45rem",
                          }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: "0.8rem", color: T.text,
                              lineHeight: 1.4, wordBreak: "break-word",
                            }}>{subj.title}</div>
                            <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.15rem", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "0.62rem", color: T.textMuted }}>
                                {subj.units} unit{subj.units !== 1 ? "s" : ""}
                              </span>
                              {subj.type !== "Lecture" && (
                                <span style={{
                                  fontSize: "0.6rem", color: "#a78bfa",
                                  background: "rgba(167,139,250,0.1)",
                                  padding: "0.05rem 0.35rem", borderRadius: 8,
                                }}>{subj.type}</span>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Program card ──────────────────────────────────────────────
function ProgramCard({ program, T, onViewCurriculum }) {
  const [hov, setHov] = useState(false);
  const ss = statusStyle(program.status);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.surface,
        border: `1px solid ${hov ? "rgba(94,234,212,0.4)" : T.border}`,
        borderRadius: 14,
        padding: "1.3rem",
        display: "flex", flexDirection: "column", gap: "0.65rem",
        transition: "all .2s",
        boxShadow: hov ? T.cardHover : T.shadow,
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        animation: "fadeInUp .4s ease both",
      }}
    >
      {/* Code + status */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <span style={{
          fontFamily: "'Syne',sans-serif", fontWeight: 800,
          fontSize: "0.95rem", color: "#5eead4",
          background: "rgba(94,234,212,0.1)",
          padding: "0.18rem 0.7rem", borderRadius: 20,
        }}>{program.code}</span>
        <span style={{
          fontSize: "0.65rem", fontWeight: 700,
          padding: "0.18rem 0.55rem", borderRadius: 20,
          background: ss.bg, color: ss.color,
        }}>{program.status}</span>
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "'Syne',sans-serif", fontWeight: 700,
        fontSize: "0.93rem", color: T.text, lineHeight: 1.35,
      }}>{program.name}</div>

      {/* Description */}
      {program.description && (
        <div style={{
          fontSize: "0.78rem", color: T.textMuted,
          lineHeight: 1.6, flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>{program.description}</div>
      )}

      {/* Meta chips */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {[
          { icon: "🎓", label: durLabel(program.duration_years) },
          { icon: "📚", label: `${program.total_units} Units` },
        ].map(({ icon, label }) => (
          <span key={label} style={{
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
            fontSize: "0.68rem", fontWeight: 600,
            padding: "0.22rem 0.6rem", borderRadius: 8,
            background: T.dark ? "rgba(255,255,255,0.05)" : "#f0f4ff",
            color: T.textSub,
          }}>{icon} {label}</span>
        ))}
      </div>

      {/* View Curriculum button */}
      <button
        onClick={() => onViewCurriculum(program.id)}
        style={{
          marginTop: "0.2rem",
          padding: "0.6rem",
          borderRadius: 9,
          border: "none",
          background: hov
            ? "linear-gradient(135deg,#5eead4,#3b82f6)"
            : T.dark ? "rgba(94,234,212,0.08)" : "rgba(20,184,166,0.07)",
          color: hov ? "#07061a" : "#5eead4",
          fontWeight: 700, fontSize: "0.8rem",
          cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
          transition: "all .2s",
        }}
      >
        📋 View Curriculum
      </button>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function ProgramList({ T, bp }) {
  const { sm, md } = bp;

  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedProgId, setSelectedProgId] = useState(null);
  const [searchInput,    setSearchInput]    = useState("");
  const [search,         setSearch]         = useState("");

  // Departments for dropdown
  const { data: departments, loading: deptLoading } = useFetch("/departments");

  // Programs filtered by selected department + search
  const programParams = {};
  if (selectedDeptId) programParams.department_id = selectedDeptId;
  if (search)         programParams.search        = search;

  const { data: programs, loading: progLoading, error: progError, refetch } =
    useFetch("/programs", { params: programParams });

  const deptList  = departments ?? [];
  const progList  = programs   ?? [];

  const handleSearch = () => setSearch(searchInput.trim());
  const handleClear  = () => { setSearch(""); setSearchInput(""); setSelectedDeptId(""); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      <style>{`
        @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:translate(-50%,-50%) scale(.93)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
      `}</style>

      {/* ── Page header ── */}
      <div style={{ animation: "fadeInUp .4s ease" }}>
        <h2 style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: sm ? "1.3rem" : "1.6rem",
          fontWeight: 800, color: T.text,
          margin: "0 0 0.2rem", letterSpacing: "-0.03em",
        }}>Program Offerings 🎓</h2>
        <p style={{ color: T.textMuted, fontSize: "0.8rem", margin: 0 }}>
          Browse academic programs by department and view their full curriculum
        </p>
      </div>

      {/* ── Search bar ── */}
      <div style={{ display: "flex", gap: "0.5rem", animation: "fadeInUp .4s ease .05s both" }}>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search program code or name…"
          style={{
            flex: 1, padding: "0.7rem 1rem", borderRadius: 10,
            border: `1.5px solid ${T.inputBorder}`,
            background: T.inputBg, color: T.text,
            fontSize: "0.85rem", fontFamily: "'DM Sans',sans-serif",
            outline: "none", transition: "border-color .2s, box-shadow .2s",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#5eead4"; e.target.style.boxShadow = "0 0 0 3px rgba(94,234,212,0.12)"; }}
          onBlur={(e)  => { e.target.style.borderColor = T.inputBorder; e.target.style.boxShadow = "none"; }}
        />
        <button onClick={handleSearch} style={{
          padding: "0.7rem 1.1rem", borderRadius: 10,
          background: "linear-gradient(135deg,#5eead4,#3b82f6)",
          border: "none", color: "#07061a", fontWeight: 700,
          fontSize: "0.83rem", cursor: "pointer",
          fontFamily: "'DM Sans',sans-serif", transition: "filter .15s",
          whiteSpace: "nowrap",
        }}
          onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.filter = ""}
        >🔍 Search</button>
        {(search || selectedDeptId) && (
          <button onClick={handleClear} style={{
            padding: "0.7rem 0.9rem", borderRadius: 10,
            background: T.dark ? "rgba(255,255,255,0.06)" : "#fff",
            border: `1.5px solid ${T.inputBorder}`,
            color: T.textSub, fontSize: "0.82rem", cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif", transition: "all .15s",
          }}>✕ Clear</button>
        )}
      </div>

      {/* ── Department dropdown ── */}
      <div style={{ animation: "fadeInUp .4s ease .08s both", maxWidth: 380 }}>
        <label style={{
          display: "block", fontSize: "0.72rem", fontWeight: 700,
          color: T.textMuted, marginBottom: "0.4rem",
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>Filter by Department</label>
        <div style={{ position: "relative" }}>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            disabled={deptLoading}
            style={{
              width: "100%", padding: "0.72rem 2.2rem 0.72rem 1rem",
              borderRadius: 10, border: `1.5px solid ${T.inputBorder}`,
              background: T.inputBg, color: T.text,
              fontSize: "0.85rem", fontFamily: "'DM Sans',sans-serif",
              appearance: "none", cursor: "pointer",
              outline: "none", transition: "border-color .2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#5eead4"; e.target.style.boxShadow = "0 0 0 3px rgba(94,234,212,0.12)"; }}
            onBlur={(e)  => { e.target.style.borderColor = T.inputBorder; e.target.style.boxShadow = "none"; }}
          >
            <option value="">🏫 All Departments</option>
            {deptList.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code} — {d.name}
              </option>
            ))}
          </select>
          {/* Chevron */}
          <span style={{
            position: "absolute", right: "0.85rem", top: "50%",
            transform: "translateY(-50%)", pointerEvents: "none",
            color: T.textMuted, fontSize: "0.75rem",
          }}>▾</span>
        </div>

        {/* Selected dept info */}
        {selectedDeptId && (() => {
          const dept = deptList.find((d) => String(d.id) === String(selectedDeptId));
          if (!dept) return null;
          return (
            <div style={{
              marginTop: "0.6rem", padding: "0.6rem 0.85rem",
              borderRadius: 9, border: `1px solid ${T.border}`,
              background: T.dark ? "rgba(94,234,212,0.04)" : "rgba(20,184,166,0.04)",
              fontSize: "0.75rem", color: T.textMuted,
              display: "flex", flexDirection: "column", gap: "0.2rem",
            }}>
              <span style={{ color: T.text, fontWeight: 700 }}>🏛️ {dept.name}</span>
              {dept.dean    && <span>👤 Dean: {dept.dean}</span>}
              {dept.contact && <span>📞 {dept.contact}</span>}
              {dept.email   && <span>✉️ {dept.email}</span>}
            </div>
          );
        })()}
      </div>

      {/* ── Error ── */}
      {progError && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          padding: "0.8rem 1rem", borderRadius: 10,
          background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
        }}>
          <span>⚠️</span>
          <span style={{ color: "#fca5a5", fontSize: "0.82rem", flex: 1 }}>{progError}</span>
          <button onClick={refetch} style={{
            background: "none", border: "none", color: "#5eead4",
            cursor: "pointer", fontSize: "0.78rem", fontWeight: 700,
            fontFamily: "'DM Sans',sans-serif",
          }}>↻ Retry</button>
        </div>
      )}

      {/* ── Count label ── */}
      {!progLoading && !progError && (
        <div style={{ color: T.textMuted, fontSize: "0.75rem" }}>
          {progList.length === 0
            ? "No programs found"
            : `${progList.length} program${progList.length !== 1 ? "s" : ""} found`}
          {search && <span style={{ color: "#5eead4", fontWeight: 600 }}> · "{search}"</span>}
        </div>
      )}

      {/* ── Program cards grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: md
          ? "repeat(auto-fill,minmax(260px,1fr))"
          : "repeat(auto-fill,minmax(300px,1fr))",
        gap: "0.9rem",
      }}>
        {progLoading
          ? [1,2,3,4,5,6].map((i) => <CardSkeleton key={i} T={T} />)
          : progList.length === 0
            ? (
              <div style={{
                gridColumn: "1/-1", textAlign: "center",
                padding: "3rem 1rem", color: T.textMuted, fontSize: "0.85rem",
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎓</div>
                No programs found for the selected department.
              </div>
            )
            : progList.map((prog) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                T={T}
                onViewCurriculum={setSelectedProgId}
              />
            ))
        }
      </div>

      {/* ── Curriculum modal ── */}
      {selectedProgId && (
        <CurriculumModal
          programId={selectedProgId}
          T={T}
          onClose={() => setSelectedProgId(null)}
        />
      )}
    </div>
  );
}