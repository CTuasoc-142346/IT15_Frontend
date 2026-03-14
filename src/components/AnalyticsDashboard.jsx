// src/components/AnalyticsDashboard.jsx
// ─────────────────────────────────────────────
// Analytics page — three live charts from the API:
//   1. Bar Chart  — monthly enrollment trends (students by dept)
//   2. Pie Chart  — student distribution across courses
//   3. Line Chart — attendance pattern over school days
//
// All data fetched from Laravel API with loading + error states.
// Fully responsive — stacks to single column on mobile.
// ─────────────────────────────────────────────

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line, ReferenceLine, Area, AreaChart,
} from "recharts";
import { Card, SectionTitle, StatCard } from "./UI";
import { tipCfg } from "../theme";
import { useFetch } from "../hooks/useFetch";

// ── Colour palette shared across charts ──────────────────────
const PALETTE = [
  "#5eead4", "#a78bfa", "#f472b6", "#fbbf24",
  "#34d399", "#60a5fa", "#fb923c", "#e879f9",
];

// ── Skeleton loader (shimmer effect) ─────────────────────────
const Shimmer = ({ T, height = 200, style = {} }) => (
  <div style={{
    height,
    borderRadius: 10,
    background: T.dark
      ? "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)"
      : "linear-gradient(90deg,#f0f4ff 25%,#e2e8f0 50%,#f0f4ff 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.6s ease-in-out infinite",
    ...style,
  }} />
);

// ── Error card ────────────────────────────────────────────────
const ChartError = ({ T, message, onRetry }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: "0.65rem",
    padding: "2.5rem 1rem", textAlign: "center",
  }}>
    <div style={{ fontSize: "2rem" }}>⚠️</div>
    <p style={{ color: T.textSub, fontSize: "0.83rem", margin: 0 }}>{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          marginTop: "0.25rem",
          padding: "0.45rem 1rem", borderRadius: 9,
          background: "rgba(94,234,212,0.1)",
          border: "1px solid rgba(94,234,212,0.3)",
          color: "#5eead4", fontSize: "0.78rem", fontWeight: 700,
          cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
        }}
      >↻ Retry</button>
    )}
  </div>
);

// ── Chart wrapper: handles loading / error / content ──────────
const ChartCard = ({ T, sm, title, loading, error, onRetry, height = 220, children, style = {} }) => (
  <Card T={T} style={{ padding: sm ? "1rem" : "1.25rem 1.4rem", ...style }}>
    <SectionTitle T={T} sm={sm}>{title}</SectionTitle>
    {loading ? (
      <Shimmer T={T} height={height} />
    ) : error ? (
      <ChartError T={T} message={error} onRetry={onRetry} />
    ) : (
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    )}
  </Card>
);

// ── Stat row at top ───────────────────────────────────────────
function AnalyticsStats({ T, sm, studentStats, courseStats }) {
  const totalStudents  = studentStats?.total ?? "—";
  const activeStudents = studentStats?.by_status?.Active ?? "—";
  const totalCourses   = courseStats?.total ?? "—";
  const avgEnrolled    = courseStats?.most_enrolled
    ? Math.round(
        courseStats.most_enrolled.reduce((s, c) => s + (c.enrollments_count ?? 0), 0) /
        Math.max(courseStats.most_enrolled.length, 1)
      )
    : "—";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: sm ? "1fr 1fr" : "repeat(4,1fr)",
      gap: sm ? "0.65rem" : "0.9rem",
    }}>
      <StatCard T={T} sm={sm} icon="👥" label="Total Students"
        value={totalStudents} sub={`${activeStudents} active`}
        color={T.accent} trend={4} delay={0.05}
      />
      <StatCard T={T} sm={sm} icon="🎓" label="Total Courses"
        value={totalCourses} sub="across 8 departments"
        color={T.accentPurp} delay={0.1}
      />
      <StatCard T={T} sm={sm} icon="📊" label="Avg Enrolled"
        value={typeof avgEnrolled === "number" ? `${avgEnrolled}` : "—"}
        sub="per top course" color={T.accentPink} delay={0.15}
      />
      <StatCard T={T} sm={sm} icon="🏫" label="Departments"
        value={courseStats?.by_department?.length ?? "—"}
        sub="offering courses" color={T.accentAmb} delay={0.2}
      />
    </div>
  );
}

// ── 1. BAR CHART — Monthly enrollment by department ──────────
function EnrollmentBarChart({ T, sm, bp }) {
  const { data, loading, error, refetch } = useFetch("/students", {
    params: { per_page: 100 },
  });

  // Aggregate: count students enrolled per month from enrollment_date
  const chartData = useMemo(() => {
    if (!data?.data) return [];
    const months = {};
    data.data.forEach((student) => {
      if (!student.enrollment_date) return;
      const d     = new Date(student.enrollment_date);
      const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
      months[label] = (months[label] ?? 0) + 1;
    });
    return Object.entries(months)
      .map(([month, count]) => ({ month, Students: count }))
      .sort((a, b) => {
        const parse = (s) => new Date(`01 ${s.replace("-", " 20")}`);
        return parse(a.month) - parse(b.month);
      })
      .slice(-12); // last 12 months
  }, [data]);

  const height = sm ? 180 : bp.md ? 210 : 240;

  return (
    <ChartCard
      T={T} sm={sm}
      title="📅 Monthly Enrollment Trends"
      loading={loading} error={error} onRetry={refetch}
      height={height}
    >
      <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -22 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5eead4" stopOpacity={1} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: T.textSub, fontSize: sm ? 9 : 11 }}
          axisLine={false} tickLine={false}
          interval={sm ? 2 : 0}
        />
        <YAxis
          tick={{ fill: T.textSub, fontSize: 10 }}
          axisLine={false} tickLine={false}
          allowDecimals={false}
        />
        <Tooltip {...tipCfg(T)} />
        <Bar dataKey="Students" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ChartCard>
  );
}

// ── 2. PIE CHART — Students per department ───────────────────
function DepartmentPieChart({ T, sm, bp }) {
  const { data, loading, error, refetch } = useFetch("/students/stats");

  const chartData = useMemo(() => {
    if (!data?.by_department) return [];
    return data.by_department
      .map((d, i) => ({
        name: d.department
          .replace("College of ", "")
          .replace(" and ", " & "),
        value: Number(d.count),
        color: PALETTE[i % PALETTE.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const height = sm ? 200 : bp.md ? 220 : 250;

  // Custom label for larger screens only
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (sm || percent < 0.07) return null;
    const RAD  = Math.PI / 180;
    const rad  = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x    = cx + rad * Math.cos(-midAngle * RAD);
    const y    = cy + rad * Math.sin(-midAngle * RAD);
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ChartCard
      T={T} sm={sm}
      title="🥧 Students by Department"
      loading={loading} error={error} onRetry={refetch}
      height={height}
    >
      <PieChart>
        <Pie
          data={chartData}
          cx="50%" cy="46%"
          innerRadius={sm ? 38 : 55}
          outerRadius={sm ? 68 : 90}
          dataKey="value"
          paddingAngle={3}
          strokeWidth={0}
          labelLine={false}
          label={renderLabel}
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip {...tipCfg(T)} />
        <Legend
          iconType="circle"
          iconSize={7}
          wrapperStyle={{ fontSize: sm ? 9 : 11, paddingTop: "0.5rem" }}
          formatter={(v) => (
            <span style={{ color: T.textSub, fontFamily: "'DM Sans',sans-serif" }}>{v}</span>
          )}
        />
      </PieChart>
    </ChartCard>
  );
}

// ── 3. LINE CHART — Attendance over school days ───────────────
function AttendanceLineChart({ T, sm, bp }) {
  const [semester, setSemester] = useState("1st Semester");

  const { data, loading, error, refetch } = useFetch("/school-days/stats", {
    params: { academic_year: "2025-2026" },
  });

  const chartData = useMemo(() => {
    if (!data?.monthly) return [];
    return data.monthly.map((m) => ({
      month: new Date(m.month + "-01").toLocaleString("default", { month: "short", year: "2-digit" }),
      Present: Number(m.avg_present),
      Absent:  Number(m.avg_absent),
      Late:    Number(m.avg_late),
      Days:    Number(m.class_days),
    }));
  }, [data]);

  const height = sm ? 180 : bp.md ? 210 : 240;

  return (
    <ChartCard
      T={T} sm={sm}
      title="📈 Attendance Patterns — AY 2025–2026"
      loading={loading} error={error} onRetry={refetch}
      height={height}
      style={{ gridColumn: "1 / -1" }} // full width
    >
      <AreaChart data={chartData} margin={{ top: 6, right: 16, bottom: 0, left: -16 }}>
        <defs>
          <linearGradient id="areaPresent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#5eead4" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#5eead4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="areaAbsent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f87171" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="areaLate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#fbbf24" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: T.textSub, fontSize: sm ? 9 : 11 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fill: T.textSub, fontSize: 10 }}
          axisLine={false} tickLine={false}
          allowDecimals={false}
        />
        <Tooltip {...tipCfg(T)} />
        <Legend
          iconType="circle" iconSize={7}
          wrapperStyle={{ fontSize: sm ? 9 : 11 }}
          formatter={(v) => (
            <span style={{ color: T.textSub, fontFamily: "'DM Sans',sans-serif" }}>{v}</span>
          )}
        />
        <Area type="monotone" dataKey="Present" stroke="#5eead4" strokeWidth={2.5}
          fill="url(#areaPresent)" dot={false} activeDot={{ r: 5, fill: "#5eead4" }} />
        <Area type="monotone" dataKey="Absent" stroke="#f87171" strokeWidth={2}
          fill="url(#areaAbsent)" dot={false} activeDot={{ r: 4, fill: "#f87171" }} />
        <Area type="monotone" dataKey="Late" stroke="#fbbf24" strokeWidth={2}
          fill="url(#areaLate)" dot={false} activeDot={{ r: 4, fill: "#fbbf24" }} />
      </AreaChart>
    </ChartCard>
  );
}

// ── 4. Horizontal bar — top courses by enrollment ─────────────
function TopCoursesChart({ T, sm, bp }) {
  const { data, loading, error, refetch } = useFetch("/courses/stats");

  const chartData = useMemo(() => {
    if (!data?.most_enrolled) return [];
    return data.most_enrolled.map((c) => ({
      name: c.course_code,
      Enrolled: c.enrollments_count,
      Capacity: c.capacity,
    }));
  }, [data]);

  const height = sm ? 160 : 190;

  return (
    <ChartCard
      T={T} sm={sm}
      title="🏆 Top Courses by Enrollment"
      loading={loading} error={error} onRetry={refetch}
      height={height}
    >
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="enrollGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#a78bfa" stopOpacity={1} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#5eead4" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#5eead4" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} horizontal={false} />
        <XAxis type="number" tick={{ fill: T.textSub, fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis
          dataKey="name" type="category"
          tick={{ fill: T.textSub, fontSize: sm ? 9 : 11 }}
          axisLine={false} tickLine={false} width={52}
        />
        <Tooltip {...tipCfg(T)} />
        <Bar dataKey="Capacity" fill="url(#capGrad)" radius={[0, 6, 6, 0]} barSize={sm ? 8 : 12} />
        <Bar dataKey="Enrolled" fill="url(#enrollGrad)" radius={[0, 6, 6, 0]} barSize={sm ? 8 : 12} />
      </BarChart>
    </ChartCard>
  );
}

// ── 5. Gender donut ───────────────────────────────────────────
function GenderDonut({ T, sm }) {
  const { data, loading, error, refetch } = useFetch("/students/stats");

  const chartData = useMemo(() => {
    if (!data?.by_gender) return [];
    return Object.entries(data.by_gender).map(([name, value], i) => ({
      name, value: Number(value),
      color: i === 0 ? "#5eead4" : "#f472b6",
    }));
  }, [data]);

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <ChartCard
      T={T} sm={sm}
      title="⚧ Gender Distribution"
      loading={loading} error={error} onRetry={refetch}
      height={sm ? 170 : 190}
    >
      <PieChart>
        <Pie
          data={chartData}
          cx="50%" cy="48%"
          innerRadius={sm ? 40 : 55}
          outerRadius={sm ? 62 : 78}
          dataKey="value"
          paddingAngle={4}
          strokeWidth={0}
          startAngle={90}
          endAngle={-270}
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          {...tipCfg(T)}
          formatter={(v, name) => [`${v} (${total ? Math.round(v / total * 100) : 0}%)`, name]}
        />
        <Legend
          iconType="circle" iconSize={7}
          wrapperStyle={{ fontSize: sm ? 9 : 11 }}
          formatter={(v) => (
            <span style={{ color: T.textSub, fontFamily: "'DM Sans',sans-serif" }}>{v}</span>
          )}
        />
      </PieChart>
    </ChartCard>
  );
}

// ── 6. Year level bar ─────────────────────────────────────────
function YearLevelChart({ T, sm }) {
  const { data, loading, error, refetch } = useFetch("/students/stats");

  const chartData = useMemo(() => {
    if (!data?.by_year_level) return [];
    const order = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
    return order.map((yr) => ({
      year: yr.replace(" Year", ""),
      Students: Number(data.by_year_level[yr] ?? 0),
    }));
  }, [data]);

  return (
    <ChartCard
      T={T} sm={sm}
      title="📚 Students by Year Level"
      loading={loading} error={error} onRetry={refetch}
      height={sm ? 170 : 190}
    >
      <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -22 }}>
        <defs>
          <linearGradient id="yrGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f472b6" stopOpacity={1} />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} vertical={false} />
        <XAxis dataKey="year" tick={{ fill: T.textSub, fontSize: sm ? 9 : 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: T.textSub, fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip {...tipCfg(T)} />
        <Bar dataKey="Students" fill="url(#yrGrad)" radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ChartCard>
  );
}

// ── Upcoming events strip ─────────────────────────────────────
function UpcomingEvents({ T, sm }) {
  const { data, loading, error } = useFetch("/school-days/upcoming", {
    params: { limit: 6 },
  });

  const typeColor = {
    Holiday:    { color: "#f87171", bg: "rgba(248,113,113,0.1)",  icon: "🎉" },
    Event:      { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",   icon: "📌" },
    Exam:       { color: "#a78bfa", bg: "rgba(167,139,250,0.1)",  icon: "📝" },
    Suspension: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)",   icon: "⚠️" },
    "No Class": { color: "#94a3b8", bg: "rgba(148,163,184,0.1)",  icon: "🚫" },
  };

  return (
    <Card T={T} style={{ padding: sm ? "1rem" : "1.25rem 1.4rem", animation: "fadeInUp .5s ease .3s both" }}>
      <SectionTitle T={T} sm={sm}>🗓️ Upcoming School Events</SectionTitle>
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[1,2,3].map(i => <Shimmer key={i} T={T} height={40} />)}
        </div>
      )}
      {error && <p style={{ color: T.textSub, fontSize: "0.82rem" }}>Could not load events.</p>}
      {data && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {data.length === 0 && (
            <p style={{ color: T.textMuted, fontSize: "0.82rem", margin: 0 }}>No upcoming events.</p>
          )}
          {data.map((day) => {
            const cfg = typeColor[day.day_type] ?? { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", icon: "📅" };
            const date = new Date(day.date);
            return (
              <div key={day.id} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.6rem 0.8rem", borderRadius: 10,
                background: cfg.bg,
                border: `1px solid ${cfg.color}22`,
              }}>
                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{cfg.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: T.text, fontWeight: 600, fontSize: "0.8rem",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {day.title}
                  </div>
                  <div style={{ color: T.textSub, fontSize: "0.68rem" }}>
                    {date.toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <span style={{
                  fontSize: "0.62rem", fontWeight: 700,
                  padding: "0.18rem 0.5rem", borderRadius: 20,
                  color: cfg.color, background: cfg.bg,
                  whiteSpace: "nowrap", flexShrink: 0,
                  border: `1px solid ${cfg.color}44`,
                }}>{day.day_type}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function AnalyticsDashboard({ T, bp }) {
  const { sm, md } = bp;

  // Pre-fetch stats for the top row
  const { data: studentStats } = useFetch("/students/stats");
  const { data: courseStats  } = useFetch("/courses/stats");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: sm ? "1rem" : "1.4rem" }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ animation: "fadeInUp .4s ease" }}>
        <h2 style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: sm ? "1.3rem" : "1.6rem",
          fontWeight: 800, color: T.text,
          margin: "0 0 0.2rem", letterSpacing: "-0.03em",
        }}>Analytics Overview 📈</h2>
        <p style={{ color: T.textMuted, fontSize: "0.8rem", margin: 0 }}>
          Live data · AY 2025–26 · Students, Courses & Attendance
        </p>
      </div>

      {/* ── Stat cards ── */}
      <AnalyticsStats T={T} sm={sm} studentStats={studentStats} courseStats={courseStats} />

      {/* ── Row 1: Monthly bar + Department pie ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: sm ? "1fr" : md ? "1fr" : "3fr 2fr",
        gap: sm ? "0.9rem" : "1rem",
      }}>
        <EnrollmentBarChart T={T} sm={sm} bp={bp} />
        <DepartmentPieChart T={T} sm={sm} bp={bp} />
      </div>

      {/* ── Row 2: Full-width attendance line chart ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: sm ? "0.9rem" : "1rem",
      }}>
        <AttendanceLineChart T={T} sm={sm} bp={bp} />
      </div>

      {/* ── Row 3: Top courses + Gender + Year level ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: sm ? "1fr" : md ? "1fr 1fr" : "2fr 1fr 1fr",
        gap: sm ? "0.9rem" : "1rem",
      }}>
        <TopCoursesChart T={T} sm={sm} bp={bp} />
        <GenderDonut T={T} sm={sm} />
        <YearLevelChart T={T} sm={sm} />
      </div>

      {/* ── Row 4: Upcoming events ── */}
      <UpcomingEvents T={T} sm={sm} />
    </div>
  );
}