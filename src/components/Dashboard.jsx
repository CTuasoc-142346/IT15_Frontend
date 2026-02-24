// src/components/Dashboard.jsx
// ─────────────────────────────────────────────
// Dashboard module:
//   - 4 stat cards (animated counters)
//   - Bar chart (subjects by term)
//   - Pie chart (program status)
//   - Horizontal bar (subjects by semester)
//   - Recent programs + recent subjects
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { StatCard, Card, SectionTitle } from "./UI";
import { tipCfg } from "../theme";
import { PROGRAMS, SUBJECTS, STATS, PROGRAM_DIST, RECENT_PROGRAMS, RECENT_SUBJECTS } from "../data/mockData";

/* ── Animated counter ────────────────────────────────────── */
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return count;
}

function AnimatedNum({ value }) {
  const n = useCountUp(value);
  return <>{n}</>;
}

const PIE_COLORS = ["#34d399", "#fbbf24", "#f87171"];

export default function Dashboard({ T, bp }) {
  const { sm, md } = bp;

  // Status breakdown for pie
  const statusData = [
    { name: "Active",       value: STATS.activePrograms                             },
    { name: "Under Review", value: PROGRAMS.filter((p) => p.status === "Under Review").length },
    { name: "Phased Out",   value: PROGRAMS.filter((p) => p.status === "Phased Out").length  },
  ];

  // Term bar data
  const termData = Object.entries(STATS.subjectsByTerm).map(([name, Subjects]) => ({ name, Subjects }));

  // Semester horizontal bar
  const semData = Object.entries(STATS.subjectsBySemester).map(([name, Subjects]) => ({ name, Subjects }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: sm ? "1rem" : "1.4rem" }}>

      {/* ── Header ── */}
      <div style={{ animation: "fadeInUp .4s ease" }}>
        <h2 style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: sm ? "1.3rem" : "1.6rem",
          fontWeight: 800, color: T.text,
          margin: "0 0 0.2rem", letterSpacing: "-0.03em",
        }}>
          Dashboard Overview 📊
        </h2>
        <p style={{ color: T.textMuted, fontSize: "0.8rem", margin: 0 }}>
          AY 2025–26 · Program & Subject Summary
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: sm ? "1fr 1fr" : "repeat(4,1fr)",
        gap: sm ? "0.65rem" : "0.9rem",
      }}>
        <StatCard T={T} sm={sm} icon="🎓" label="Total Programs"
          value={<AnimatedNum value={STATS.totalPrograms} />}
          sub={`${STATS.activePrograms} active`}
          color={T.accent} trend={8} delay={0.05}
        />
        <StatCard T={T} sm={sm} icon="📚" label="Total Subjects"
          value={<AnimatedNum value={STATS.totalSubjects} />}
          sub={`${STATS.subjectsWithPrereqs} with prereqs`}
          color={T.accentPurp} trend={5} delay={0.1}
        />
        <StatCard T={T} sm={sm} icon="✅" label="Active Programs"
          value={<AnimatedNum value={STATS.activePrograms} />}
          sub={`${STATS.inactivePrograms} inactive/review`}
          color={T.success} delay={0.15}
        />
        <StatCard T={T} sm={sm} icon="⚠️" label="With Prerequisites"
          value={<AnimatedNum value={STATS.subjectsWithPrereqs} />}
          sub="Require prior completion"
          color={T.accentAmb} delay={0.2}
        />
      </div>

      {/* ── Charts row ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: sm || md ? "1fr" : "3fr 2fr",
        gap: sm ? "0.75rem" : "1rem",
      }}>
        {/* Bar chart — subjects by term */}
        <Card T={T} style={{ padding: sm ? "1rem" : "1.3rem", animation: "fadeInUp .5s ease .15s both" }}>
          <SectionTitle T={T} sm={sm}>📊 Subjects per Term Type</SectionTitle>
          <ResponsiveContainer width="100%" height={sm ? 160 : 200}>
            <BarChart data={termData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...tipCfg(T)} />
              <Bar dataKey="Subjects" radius={[6, 6, 0, 0]}>
                {termData.map((_, i) => (
                  <Cell key={i} fill={["#5eead4", "#a78bfa", "#34d399"][i] || "#5eead4"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie chart — program status */}
        <Card T={T} style={{ padding: sm ? "1rem" : "1.3rem", animation: "fadeInUp .5s ease .2s both" }}>
          <SectionTitle T={T} sm={sm}>🥧 Program Status</SectionTitle>
          <ResponsiveContainer width="100%" height={sm ? 160 : 200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%" cy="48%"
                innerRadius={sm ? 42 : 52}
                outerRadius={sm ? 65 : 80}
                dataKey="value"
                paddingAngle={4}
                strokeWidth={0}
              >
                {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip {...tipCfg(T)} />
              <Legend
                iconType="circle" iconSize={7}
                formatter={(v) => <span style={{ color: T.textSub, fontSize: 10 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Semester breakdown ── */}
      <Card T={T} style={{ padding: sm ? "1rem" : "1.3rem", animation: "fadeInUp .5s ease .25s both" }}>
        <SectionTitle T={T} sm={sm}>📅 Subjects by Semester</SectionTitle>
        <ResponsiveContainer width="100%" height={sm ? 120 : 150}>
          <BarChart data={semData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
            <XAxis type="number" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
            <Tooltip {...tipCfg(T)} />
            <Bar dataKey="Subjects" radius={[0, 6, 6, 0]} fill="#a78bfa" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Recent items ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: sm || md ? "1fr" : "1fr 1fr",
        gap: sm ? "0.75rem" : "1rem",
      }}>
        {/* Recent Programs */}
        <Card T={T} style={{ overflow: "hidden", animation: "fadeInUp .5s ease .3s both" }}>
          <div style={{ padding: sm ? "0.9rem 1rem" : "1rem 1.3rem", borderBottom: `1px solid ${T.border}` }}>
            <SectionTitle T={T} sm={sm} style={{ margin: 0 }}>🕐 Recently Added Programs</SectionTitle>
          </div>
          {RECENT_PROGRAMS.map((p, i) => (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: sm ? "0.7rem 1rem" : "0.8rem 1.3rem",
              borderBottom: i < RECENT_PROGRAMS.length - 1 ? `1px solid ${T.border}` : "none",
              transition: "background .13s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = T.surfaceHov}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: T.text, fontWeight: 600, fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.code} — {p.name}
                </div>
                <div style={{ color: T.textMuted, fontSize: "0.68rem" }}>Added: {p.dateAdded}</div>
              </div>
              <span style={{
                fontSize: "0.62rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: 20,
                background: p.status === "Active" ? "rgba(52,211,153,0.12)" : p.status === "Phased Out" ? "rgba(248,113,113,0.12)" : "rgba(251,191,36,0.12)",
                color: p.status === "Active" ? "#34d399" : p.status === "Phased Out" ? "#f87171" : "#fbbf24",
                whiteSpace: "nowrap", flexShrink: 0,
              }}>{p.status}</span>
            </div>
          ))}
        </Card>

        {/* Recent Subjects */}
        <Card T={T} style={{ overflow: "hidden", animation: "fadeInUp .5s ease .35s both" }}>
          <div style={{ padding: sm ? "0.9rem 1rem" : "1rem 1.3rem", borderBottom: `1px solid ${T.border}` }}>
            <SectionTitle T={T} sm={sm} style={{ margin: 0 }}>🕐 Recently Added Subjects</SectionTitle>
          </div>
          {RECENT_SUBJECTS.map((s, i) => (
            <div key={s.id} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: sm ? "0.7rem 1rem" : "0.8rem 1.3rem",
              borderBottom: i < RECENT_SUBJECTS.length - 1 ? `1px solid ${T.border}` : "none",
              transition: "background .13s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = T.surfaceHov}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accentPurp, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: T.text, fontWeight: 600, fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.code} — {s.title}
                </div>
                <div style={{ color: T.textMuted, fontSize: "0.68rem" }}>{s.program} · Added: {s.dateAdded}</div>
              </div>
              <span style={{
                fontSize: "0.62rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: 20,
                background: s.term === "Semester" ? "rgba(94,234,212,0.1)" : s.term === "Term" ? "rgba(167,139,250,0.1)" : "rgba(52,211,153,0.1)",
                color: s.term === "Semester" ? "#5eead4" : s.term === "Term" ? "#a78bfa" : "#34d399",
                whiteSpace: "nowrap", flexShrink: 0,
              }}>{s.term}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}