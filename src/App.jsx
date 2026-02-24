// src/App.jsx
// ─────────────────────────────────────────────
// Root component — wires everything together:
//   - Login → Dashboard layout
//   - Sidebar (desktop) + Bottom nav (mobile)
//   - Sticky header with dark toggle
//   - Logout confirmation modal
//   - Responsive breakpoints via useBreakpoint
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import { mkTheme } from "./theme";
import LoginPage    from "./pages/loginPage";
import Sidebar      from "./components/SideBar";
import Dashboard    from "./components/Dashboard";
import ProgramList  from "./components/ProgramList";
import SubjectList  from "./components/SubjectList";
import LogoutConfirm from "./components/LogoutConfirm";

/* ── Responsive hook ─────────────────────────────────────── */
const useBreakpoint = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn); fn();
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { w, xs: w < 400, sm: w < 640, tab: w >= 640 && w < 1024, md: w < 1024, lg: w >= 1024 };
};

/* ── Nav items ───────────────────────────────────────────── */
const NAV = [
  { id: "dashboard", label: "Dashboard",         icon: "⊞" },
  { id: "programs",  label: "Program Offerings", icon: "🎓" },
  { id: "subjects",  label: "Subject Offerings", icon: "📚" },
];

/* ── Mobile bottom nav ───────────────────────────────────── */
const BottomNav = ({ active, setActive, T }) => (
  <nav style={{
    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
    background: T.sidebarBg,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex", alignItems: "stretch",
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
  }}>
    {NAV.map((n) => (
      <button key={n.id} onClick={() => setActive(n.id)} style={{
        flex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "0.18rem", padding: "0.5rem 0.25rem 0.6rem",
        border: "none", background: "transparent", cursor: "pointer",
        color: active === n.id ? "#5eead4" : "#6b7280",
        transition: "color .15s",
        borderTop: active === n.id ? "2px solid #5eead4" : "2px solid transparent",
        fontFamily: "'DM Sans',sans-serif",
      }}>
        <span style={{ fontSize: "1.15rem", lineHeight: 1 }}>{n.icon}</span>
        <span style={{ fontSize: "0.52rem", fontWeight: active === n.id ? 700 : 500, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
          {n.label}
        </span>
      </button>
    ))}
  </nav>
);

/* ── Dashboard layout ────────────────────────────────────── */
function DashboardLayout({ user, onLogout, dark, toggleDark }) {
  const bp = useBreakpoint();
  const { sm, md } = bp;
  const [active,    setActive]    = useState("dashboard");
  const [collapsed, setCollapsed] = useState(md);
  const [showLogout,setShowLogout] = useState(false);
  const T = mkTheme(dark);

  useEffect(() => { setCollapsed(md); }, [md]);

  const renderPage = () => {
    switch (active) {
      case "dashboard": return <Dashboard  T={T} bp={bp} />;
      case "programs":  return <ProgramList T={T} bp={bp} />;
      case "subjects":  return <SubjectList T={T} bp={bp} />;
      default:          return <Dashboard  T={T} bp={bp} />;
    }
  };

  const meta = NAV.find((n) => n.id === active) || NAV[0];

  return (
    <div style={{
      display: "flex", width: "100vw", height: "100vh",
      background: T.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif",
      color: T.text, overflow: "hidden", position: "fixed", top: 0, left: 0,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        html,body,#root { margin:0; padding:0; width:100%; height:100%; overflow:hidden; }
        * { box-sizing:border-box; }
        @keyframes fadeInUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn   { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        @keyframes nekoBob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes nekoZzz   { 0%{opacity:0;transform:translate(0,0) scale(.7)} 20%{opacity:1} 80%{opacity:1} 100%{opacity:0;transform:translate(12px,-20px) scale(1.2)} }
        @keyframes nekoBlink { 0%,92%,100%{transform:scaleY(1)} 96%{transform:scaleY(.08)} }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${T.scrollThumb}; border-radius:4px; }
      `}</style>

      {/* Sidebar — tablet/desktop only */}
      {!sm && (
        <Sidebar
          active={active} setActive={setActive}
          collapsed={collapsed} setCollapsed={setCollapsed}
          onLogout={() => setShowLogout(true)}
          T={T}
        />
      )}

      {/* Main area */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        minWidth: 0, height: "100vh", overflow: "hidden",
      }}>
        {/* ── Sticky Header ── */}
        <header style={{
          padding: sm ? "0.7rem 1rem" : "0.85rem 1.5rem",
          display: "flex", alignItems: "center", gap: sm ? "0.6rem" : "0.9rem",
          borderBottom: `1px solid ${T.border}`,
          background: T.headerBg, backdropFilter: "blur(12px)",
          flexShrink: 0, zIndex: 9, width: "100%",
        }}>
          {sm && (
            <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",marginRight:"auto" }}>
              <div style={{ width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#5eead4,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem" }}>🎓</div>
              <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,color:T.text,fontSize:"0.9rem" }}>AMS Portal</span>
            </div>
          )}
          {!sm && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.78rem", color: T.textMuted }}>
                {meta.icon} {meta.label}
              </div>
            </div>
          )}
          {!sm && (
            <div style={{ display:"flex",alignItems:"center",gap:"0.55rem",padding:"0.38rem 0.85rem",borderRadius:9,background:T.surface,border:`1px solid ${T.border}`,fontSize:"0.78rem",color:T.textMuted }}>
              🟢 <span>Enrollment Open</span>
            </div>
          )}

          {/* Dark toggle */}
          <button
            onClick={toggleDark}
            style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 10, padding: "0.42rem 0.65rem",
              fontSize: "1rem", lineHeight: 1, cursor: "pointer", transition: "all .2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(20deg) scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = ""}
          >{dark ? "☀️" : "🌙"}</button>

          {/* Avatar + Logout (desktop) */}
          {!sm ? (
            <div style={{ position: "relative" }}>
              <div
                title="Click to sign out"
                onClick={() => setShowLogout(true)}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "linear-gradient(135deg,#5eead4,#3b82f6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#07061a", fontWeight: 800, fontSize: "0.75rem",
                  cursor: "pointer", flexShrink: 0,
                  transition: "box-shadow .2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 0 0 3px rgba(94,234,212,0.3)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
          ) : (
            /* Mobile logout button */
            <button
              onClick={() => setShowLogout(true)}
              style={{
                background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
                borderRadius: 9, padding: "0.4rem 0.7rem",
                color: "#f87171", fontSize: "0.78rem", fontWeight: 700,
                fontFamily: "'DM Sans',sans-serif", cursor: "pointer",
              }}
            >🚪</button>
          )}
        </header>

        {/* ── Scrollable content ── */}
        <main style={{
          flex: 1, overflowY: "auto", overflowX: "hidden",
          padding: sm ? "1rem" : "1.5rem 1.8rem",
          paddingBottom: sm ? "calc(4.5rem + env(safe-area-inset-bottom,0px))" : "1.5rem",
          width: "100%",
        }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", width: "100%" }}>
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      {sm && <BottomNav active={active} setActive={setActive} T={T} />}

      {/* Logout confirmation */}
      {showLogout && (
        <LogoutConfirm
          T={T}
          onConfirm={onLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  );
}

/* ── Root ────────────────────────────────────────────────── */
export default function App() {
  const [user,   setUser]   = useState(null);
  const [dark,   setDark]   = useState(true);

  const handleLogin  = (userData)  => setUser(userData);
  const handleLogout = () => { setUser(null); };

  return user ? (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      dark={dark}
      toggleDark={() => setDark((d) => !d)}
    />
  ) : (
    <LoginPage
      onLogin={handleLogin}
      dark={dark}
      toggleDark={() => setDark((d) => !d)}
    />
  );
}