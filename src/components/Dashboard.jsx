// src/components/Dashboard.jsx
import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts";
import { StatCard, Card, SectionTitle } from "./UI";
import { tipCfg } from "../theme";
import { useFetch } from "../hooks/useFetch";

const PALETTE = [
  "#5eead4", "#a78bfa", "#f472b6", "#fbbf24",
  "#34d399", "#60a5fa", "#fb923c", "#e879f9",
];

const Shimmer = ({ T, height = 200 }) => (
  <div style={{
    height, borderRadius: 10,
    background: T.dark
      ? "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)"
      : "linear-gradient(90deg,#f0f4ff 25%,#e2e8f0 50%,#f0f4ff 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.6s ease-in-out infinite",
  }} />
);

const ChartError = ({ T, message, onRetry }) => (
  <div style={{
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: "0.6rem", padding: "2.5rem 1rem", textAlign: "center",
  }}>
    <div style={{ fontSize: "2rem" }}>⚠️</div>
    <p style={{ color: T.textSub, fontSize: "0.82rem", margin: 0 }}>{message}</p>
    {onRetry && (
      <button onClick={onRetry} style={{
        padding: "0.42rem 1rem", borderRadius: 9,
        background: "rgba(94,234,212,0.1)",
        border: "1px solid rgba(94,234,212,0.3)",
        color: "#5eead4", fontSize: "0.78rem", fontWeight: 700,
        cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
      }}>↻ Retry</button>
    )}
  </div>
);

// ── Stat cards ────────────────────────────────────────────────
function DashboardStats({ T, sm }) {
  const { data: studentStats } = useFetch("/students/stats");
  const { data: courseStats  } = useFetch("/courses/stats");

  const total   = studentStats?.total               ?? "—";
  const active  = studentStats?.by_status?.Active   ?? "—";
  // courseStats.total = total number of courses in the courses table
  const courses = courseStats?.total                ?? "—";
  // by_department is now an array of {department, dept_code, count}
  // so length gives us how many departments have at least one course
  const depts   = Array.isArray(courseStats?.by_department)
    ? courseStats.by_department.length
    : "—";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: sm ? "1fr 1fr" : "repeat(4,1fr)",
      gap: sm ? "0.65rem" : "0.9rem",
    }}>
      <StatCard T={T} sm={sm} icon="👥" label="Total Students"
        value={total} sub={`${active} active`}
        color={T.accent} trend={4} delay={0.05}
      />
      <StatCard T={T} sm={sm} icon="🎓" label="Courses Offered"
        value={courses} sub="across all departments"
        color={T.accentPurp} trend={2} delay={0.1}
      />
      <StatCard T={T} sm={sm} icon="🏫" label="Departments"
        value={depts} sub="offering courses"
        color={T.success} delay={0.15}
      />
      <StatCard T={T} sm={sm} icon="📋" label="Enrolled"
        value={studentStats?.by_status?.Active ?? "—"}
        sub="currently active"
        color={T.accentAmb} delay={0.2}
      />
    </div>
  );
}

// ── 1. BAR CHART — Monthly enrollment trends ─────────────────
function MonthlyEnrollmentChart({ T, sm, bp }) {
  const { data, loading, error, refetch } = useFetch("/students", {
    params: { per_page: 100 },
  });

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
        const toDate = (s) => {
          const [mon, yr] = s.split(" ");
          return new Date(`${mon} 20${yr}`);
        };
        return toDate(a.month) - toDate(b.month);
      })
      .slice(-12);
  }, [data]);

  const height = sm ? 180 : bp.md ? 210 : 230;

  return (
    <Card T={T} style={{ padding: sm ? "1rem" : "1.25rem 1.4rem", animation: "fadeInUp .5s ease .1s both" }}>
      <SectionTitle T={T} sm={sm}>📅 Monthly Enrollment Trends</SectionTitle>
      {loading ? <Shimmer T={T} height={height} /> :
       error   ? <ChartError T={T} message={error} onRetry={refetch} /> : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -22 }}>
            <defs>
              <linearGradient id="enrollBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#5eead4" stopOpacity={1} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: T.textSub, fontSize: sm ? 9 : 11 }} axisLine={false} tickLine={false} interval={sm ? 2 : 0} />
            <YAxis tick={{ fill: T.textSub, fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip {...tipCfg(T)} />
            <Bar dataKey="Students" fill="url(#enrollBar)" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

// ── 2. PIE CHART — Student distribution by department ────────
function CourseDistributionChart({ T, sm, bp }) {
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

  const total = chartData.reduce((s, d) => s + d.value, 0);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (sm || percent < 0.07) return null;
    const RAD = Math.PI / 180;
    const r   = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x   = cx + r * Math.cos(-midAngle * RAD);
    const y   = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const height = sm ? 200 : bp.md ? 220 : 250;

  return (
    <Card T={T} style={{ padding: sm ? "1rem" : "1.25rem 1.4rem", animation: "fadeInUp .5s ease .15s both" }}>
      <SectionTitle T={T} sm={sm}>🥧 Students by Department</SectionTitle>
      {loading ? <Shimmer T={T} height={height} /> :
       error   ? <ChartError T={T} message={error} onRetry={refetch} /> : (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData} cx="50%" cy="46%"
              innerRadius={sm ? 38 : 55} outerRadius={sm ? 68 : 88}
              dataKey="value" paddingAngle={3} strokeWidth={0}
              labelLine={false} label={renderLabel}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              {...tipCfg(T)}
              formatter={(v, name) => [`${v} students (${total ? Math.round(v / total * 100) : 0}%)`, name]}
            />
            <Legend
              iconType="circle" iconSize={7}
              wrapperStyle={{ fontSize: sm ? 9 : 11, paddingTop: "0.4rem" }}
              formatter={(v) => (
                <span style={{ color: T.textSub, fontFamily: "'DM Sans',sans-serif" }}>{v}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

// ── 3. LINE CHART — Attendance patterns ──────────────────────
function AttendanceChart({ T, sm, bp }) {
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
    }));
  }, [data]);

  const height = sm ? 180 : bp.md ? 210 : 230;

  return (
    <Card T={T} style={{ padding: sm ? "1rem" : "1.25rem 1.4rem", animation: "fadeInUp .5s ease .2s both" }}>
      <SectionTitle T={T} sm={sm}>📈 Attendance Patterns — AY 2025–26</SectionTitle>
      {loading ? <Shimmer T={T} height={height} /> :
       error   ? <ChartError T={T} message={error} onRetry={refetch} /> : (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData} margin={{ top: 6, right: 16, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#5eead4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#5eead4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradAbsent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f87171" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradLate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#fbbf24" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: T.textSub, fontSize: sm ? 9 : 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: T.textSub, fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip {...tipCfg(T)} />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: sm ? 9 : 11 }}
              formatter={(v) => (
                <span style={{ color: T.textSub, fontFamily: "'DM Sans',sans-serif" }}>{v}</span>
              )}
            />
            <Area type="monotone" dataKey="Present" stroke="#5eead4" strokeWidth={2.5}
              fill="url(#gradPresent)" dot={false} activeDot={{ r: 5, fill: "#5eead4" }} />
            <Area type="monotone" dataKey="Absent" stroke="#f87171" strokeWidth={2}
              fill="url(#gradAbsent)" dot={false} activeDot={{ r: 4, fill: "#f87171" }} />
            <Area type="monotone" dataKey="Late" stroke="#fbbf24" strokeWidth={2}
              fill="url(#gradLate)" dot={false} activeDot={{ r: 4, fill: "#fbbf24" }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

// ── Recent activity rows ──────────────────────────────────────
function RecentActivity({ T, sm }) {
  const { data: studentData, loading: sLoad } = useFetch("/students", { params: { per_page: 5 } });
  // courses now use 'code' and 'name', with department as a nested object
  const { data: courseData,  loading: cLoad  } = useFetch("/courses",  { params: { per_page: 5, status: "Active" } });

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: sm ? "1fr" : "1fr 1fr",
      gap: sm ? "0.75rem" : "1rem",
    }}>
      {/* Recent Students */}
      <Card T={T} style={{ overflow: "hidden", animation: "fadeInUp .5s ease .3s both" }}>
        <div style={{ padding: sm ? "0.9rem 1rem" : "1rem 1.3rem", borderBottom: `1px solid ${T.border}` }}>
          <SectionTitle T={T} sm={sm} style={{ margin: 0 }}>🕐 Recently Enrolled Students</SectionTitle>
        </div>
        {sLoad
          ? [1,2,3,4,5].map(i => (
              <div key={i} style={{ padding: "0.8rem 1.2rem", borderBottom: `1px solid ${T.border}` }}>
                <Shimmer T={T} height={28} />
              </div>
            ))
          : (studentData?.data ?? []).map((s, i, arr) => (
              <div key={s.id} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: sm ? "0.7rem 1rem" : "0.8rem 1.3rem",
                borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none",
                transition: "background .13s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = T.surfaceHov}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg,#5eead4,#3b82f6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#07061a", fontWeight: 800, fontSize: "0.7rem",
                }}>
                  {s.first_name?.charAt(0)}{s.last_name?.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: T.text, fontWeight: 600, fontSize: "0.82rem",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.first_name} {s.last_name}
                  </div>
                  <div style={{ color: T.textMuted, fontSize: "0.68rem" }}>
                    {s.student_number} · {s.department?.replace("College of ", "")}
                  </div>
                </div>
                <span style={{
                  fontSize: "0.62rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: 20,
                  background: s.status === "Active" ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
                  color: s.status === "Active" ? "#34d399" : "#f87171",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>{s.status}</span>
              </div>
            ))
        }
      </Card>

      {/* Active Courses — uses new field names: code, name, department (nested object) */}
      <Card T={T} style={{ overflow: "hidden", animation: "fadeInUp .5s ease .35s both" }}>
        <div style={{ padding: sm ? "0.9rem 1rem" : "1rem 1.3rem", borderBottom: `1px solid ${T.border}` }}>
          <SectionTitle T={T} sm={sm} style={{ margin: 0 }}>📚 Active Courses</SectionTitle>
        </div>
        {cLoad
          ? [1,2,3,4,5].map(i => (
              <div key={i} style={{ padding: "0.8rem 1.2rem", borderBottom: `1px solid ${T.border}` }}>
                <Shimmer T={T} height={28} />
              </div>
            ))
          : (courseData?.data ?? []).map((c, i, arr) => (
              <div key={c.id} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: sm ? "0.7rem 1rem" : "0.8rem 1.3rem",
                borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none",
                transition: "background .13s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = T.surfaceHov}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accentPurp, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: T.text, fontWeight: 600, fontSize: "0.82rem",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.code} — {c.name}
                  </div>
                  <div style={{ color: T.textMuted, fontSize: "0.68rem" }}>
                    {c.department?.name?.replace("College of ", "") ?? c.department?.code ?? "—"} · {c.schedule ?? "TBA"}
                  </div>
                </div>
                <span style={{
                  fontSize: "0.62rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: 20,
                  background: "rgba(94,234,212,0.1)", color: "#5eead4",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>{c.units} units</span>
              </div>
            ))
        }
      </Card>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function Dashboard({ T, bp }) {
  const { sm, md } = bp;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: sm ? "1rem" : "1.4rem" }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>

      <div style={{ animation: "fadeInUp .4s ease" }}>
        <h2 style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: sm ? "1.3rem" : "1.6rem",
          fontWeight: 800, color: T.text,
          margin: "0 0 0.2rem", letterSpacing: "-0.03em",
        }}>Dashboard Overview 📊</h2>
        <p style={{ color: T.textMuted, fontSize: "0.8rem", margin: 0 }}>
          AY 2025–26 · Live data from API
        </p>
      </div>

      <DashboardStats T={T} sm={sm} />

      <div style={{
        display: "grid",
        gridTemplateColumns: sm ? "1fr" : md ? "1fr" : "3fr 2fr",
        gap: sm ? "0.9rem" : "1rem",
      }}>
        <MonthlyEnrollmentChart T={T} sm={sm} bp={bp} />
        <CourseDistributionChart T={T} sm={sm} bp={bp} />
      </div>

      <AttendanceChart T={T} sm={sm} bp={bp} />

      <RecentActivity T={T} sm={sm} />
    </div>
  );
}