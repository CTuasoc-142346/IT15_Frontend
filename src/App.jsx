import { useState, useRef, useEffect, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* ─────────────────────────────────────────────
   RESPONSIVE HOOK
───────────────────────────────────────────── */
const useBreakpoint = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    fn();
    return () => window.removeEventListener("resize", fn);
  }, []);
  return {
    w,
    xs:  w < 400,
    sm:  w < 640,
    tab: w >= 640 && w < 1024,
    md:  w < 1024,
    lg:  w >= 1024,
  };
};

/* ─────────────────────────────────────────────  THEME  ── */
const mkTheme = (dark) => ({
  dark,
  bg:          dark ? "#07061a"                    : "#f4f6fb",
  bgDeep:      dark ? "#0d0b28"                    : "#e8ecf7",
  surface:     dark ? "rgba(255,255,255,0.045)"    : "#ffffff",
  surfaceHov:  dark ? "rgba(255,255,255,0.07)"     : "#f8f9fe",
  border:      dark ? "rgba(255,255,255,0.08)"     : "#e2e8f0",
  text:        dark ? "#f0f4ff"                    : "#0f172a",
  textSub:     dark ? "#94a3b8"                    : "#4b5563",
  textMuted:   dark ? "#4b5563"                    : "#9ca3af",
  inputBg:     dark ? "rgba(255,255,255,0.06)"     : "#ffffff",
  inputBorder: dark ? "rgba(255,255,255,0.12)"     : "#d1d5db",
  navActive:   dark ? "rgba(94,234,212,0.12)"      : "rgba(20,184,166,0.1)",
  navText:     dark ? "#5eead4"                    : "#0f766e",
  sidebarBg:   dark ? "linear-gradient(180deg,#111827,#07061a)"
                    : "linear-gradient(180deg,#1e293b,#0f172a)",
  headerBg:    dark ? "rgba(7,6,26,0.85)"          : "rgba(244,246,251,0.9)",
  gridLine:    dark ? "rgba(255,255,255,0.05)"     : "#e5e7eb",
  scrollThumb: dark ? "rgba(255,255,255,0.12)"     : "#cbd5e1",
  shadow:      dark ? "none"                       : "0 1px 3px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04)",
  accent:      "#5eead4",
  accentBlue:  "#3b82f6",
  accentPurp:  "#a78bfa",
  accentPink:  "#f472b6",
  accentAmb:   "#fbbf24",
  danger:      "#f87171",
  success:     "#34d399",
  tooltipBg:   "#1e293b",
});

/* ─────────────────────────────────────────────  DATA  ── */
const STUDENTS = [
  { id:"2024-0001", name:"Aaliyah Reyes",    course:"BS Computer Science",       yr:3, status:"enrolled",  gpa:1.75, av:"AR" },
  { id:"2024-0002", name:"Brent Salcedo",    course:"BS Information Technology", yr:2, status:"enrolled",  gpa:2.10, av:"BS" },
  { id:"2024-0003", name:"Celine Tan",       course:"BS Computer Engineering",   yr:4, status:"irregular", gpa:1.50, av:"CT" },
  { id:"2024-0004", name:"Diego Lim",        course:"BS Computer Science",       yr:1, status:"enrolled",  gpa:1.25, av:"DL" },
  { id:"2024-0005", name:"Elena Cruz",       course:"BS Information Systems",    yr:2, status:"LOA",       gpa:2.50, av:"EC" },
  { id:"2024-0006", name:"Franz Villanueva", course:"BS Computer Science",       yr:3, status:"enrolled",  gpa:1.80, av:"FV" },
  { id:"2024-0007", name:"Giana Mendoza",    course:"BS Information Technology", yr:1, status:"enrolled",  gpa:1.40, av:"GM" },
  { id:"2024-0008", name:"Hiroshi Santos",   course:"BS Computer Engineering",   yr:2, status:"enrolled",  gpa:2.20, av:"HS" },
];
const COURSES = [
  { code:"CS301", name:"Data Structures & Algorithms", units:3, enrolled:45, cap:50, inst:"Dr. Mercado"   },
  { code:"IT201", name:"Web Development",              units:3, enrolled:38, cap:40, inst:"Prof. Aquino"  },
  { code:"CE401", name:"Computer Architecture",        units:3, enrolled:30, cap:35, inst:"Dr. Reyes"    },
  { code:"CS201", name:"Object-Oriented Programming",  units:3, enrolled:50, cap:50, inst:"Prof. Santos" },
  { code:"IS301", name:"Database Management",          units:3, enrolled:42, cap:45, inst:"Dr. Lim"      },
  { code:"CS401", name:"Machine Learning",             units:3, enrolled:28, cap:30, inst:"Dr. Chen"     },
];
const TREND = [
  { mo:"Aug", enrolled:980,  dropped:12, newSt:320 },
  { mo:"Sep", enrolled:1050, dropped:8,  newSt:78  },
  { mo:"Oct", enrolled:1100, dropped:15, newSt:63  },
  { mo:"Nov", enrolled:1090, dropped:25, newSt:15  },
  { mo:"Dec", enrolled:1070, dropped:30, newSt:10  },
  { mo:"Jan", enrolled:1150, dropped:5,  newSt:85  },
  { mo:"Feb", enrolled:1178, dropped:3,  newSt:31  },
];
const PROG_DIST = [
  { name:"BS CS", value:420, color:"#5eead4" },
  { name:"BS IT", value:310, color:"#a78bfa" },
  { name:"BS CE", value:248, color:"#f472b6" },
  { name:"BS IS", value:200, color:"#fbbf24" },
];
const GPA_DIST = [
  { range:"1.00–1.50", count:180 },
  { range:"1.51–2.00", count:340 },
  { range:"2.01–2.50", count:420 },
  { range:"2.51–3.00", count:180 },
  { range:"3.01+",     count:58  },
];
const WEATHER = {
  loc:"Cagayan de Oro, PH", temp:78, cond:"Light Rain", icon:"🌧️",
  daily:[
    { day:"Thu", hi:79, pct:36, icon:"🌦️" },
    { day:"Fri", hi:78, pct:90, icon:"🌧️" },
    { day:"Sat", hi:79, pct:50, icon:"🌦️" },
    { day:"Sun", hi:79, pct:25, icon:"⛅"  },
    { day:"Mon", hi:81, pct:35, icon:"🌦️" },
  ],
};
const BOT_KB = {
  enrollment:"Enrollment for AY 2025-2026 2nd semester is OPEN. Deadline: March 15, 2026.",
  schedule:  "Class schedules are in the Courses section. Filter by department or instructor.",
  gpa:       "GPA is the weighted average of all units taken. 1.00 = highest, 5.00 = failed.",
  grade:     "Grades are posted within 2 weeks after the semester ends.",
  tuition:   "Pay tuition at the Cashier's Office or via online banking.",
  default:   "I'm NekoBot 🐱! Ask about: enrollment, schedule, GPA, grades, or tuition.",
};
const NAV = [
  { id:"dashboard",  label:"Dashboard",  icon:"⊞" },
  { id:"students",   label:"Students",   icon:"👥" },
  { id:"courses",    label:"Courses",    icon:"📚" },
  { id:"enrollment", label:"Enrollment", icon:"📋" },
  { id:"reports",    label:"Reports",    icon:"📊" },
  { id:"settings",   label:"Settings",   icon:"⚙️" },
];

/* ─────────────────────────────────────────────
   NEKO CAT  (interactive)
───────────────────────────────────────────── */
const NekoMascot = ({ state, dark }) => {
  const peek = state === "pw";
  const watch = state === "email";
  const pawY  = peek ? -28 : 0;
  return (
    <div style={{ width:140, height:138, margin:"0 auto 0.8rem" }}>
      <style>{`
        @keyframes nekoBob {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)}
        }
        @keyframes nekoZzz {
          0%{opacity:0;transform:translate(0,0) scale(.7)}
          20%{opacity:1} 80%{opacity:1}
          100%{opacity:0;transform:translate(12px,-20px) scale(1.2)}
        }
        @keyframes nekoBlink {
          0%,92%,100%{transform:scaleY(1)} 96%{transform:scaleY(.08)}
        }
        .nk-float  { animation:nekoBob   3.2s ease-in-out infinite; }
        .nk-zzz    { animation:nekoZzz   2.6s ease-in-out infinite; }
        .nk-blink  { animation:nekoBlink 4.5s ease-in-out infinite; transform-origin:50% 46px; }
        .nk-pupil  { transition:cx .18s ease,cy .18s ease; }
        .nk-paws   { transition:transform .42s cubic-bezier(.34,1.56,.64,1); will-change:transform; }
      `}</style>
      <svg viewBox="0 0 100 105" width="100%" height="100%" style={{ overflow:"visible" }}>
        <defs>
          <radialGradient id="nkHead" cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#3730a3"/>
            <stop offset="100%" stopColor="#0f0c29"/>
          </radialGradient>
          <radialGradient id="nkEar" cx="50%" cy="30%" r="60%">
            <stop offset="0%"   stopColor="#1e1b4b"/>
            <stop offset="100%" stopColor="#07061a"/>
          </radialGradient>
          <radialGradient id="nkBody" cx="40%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#312e81"/>
            <stop offset="100%" stopColor="#0f0c29"/>
          </radialGradient>
          <filter id="nkGlow">
            <feGaussianBlur stdDeviation="1.2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="nkShad">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity=".35"/>
          </filter>
        </defs>
        <ellipse cx="50" cy="100" rx="24" ry="4" fill="rgba(0,0,0,0.2)"/>
        <g className="nk-float" filter="url(#nkShad)">
          <path d="M24 82 Q10 80 11 65 Q12 54 20 57" stroke="#4c1d95" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <ellipse cx="50" cy="80" rx="21" ry="16" fill="url(#nkBody)"/>
          <path d="M29 32 L14 9  L43 24 Z" fill="url(#nkEar)"/>
          <path d="M30 30 L18 13 L41 25 Z" fill="#7c3aed" opacity=".55"/>
          <path d="M71 32 L86 9  L57 24 Z" fill="url(#nkEar)"/>
          <path d="M70 30 L82 13 L59 25 Z" fill="#7c3aed" opacity=".55"/>
          <circle cx="50" cy="48" r="29" fill="url(#nkHead)"/>
          <ellipse cx="32" cy="56" rx="6.5" ry="4" fill="#f472b6" opacity=".22"/>
          <ellipse cx="68" cy="56" rx="6.5" ry="4" fill="#f472b6" opacity=".22"/>
          {state === "idle" ? (
            <g>
              <path d="M34 48 Q40 54 46 48" stroke="#a78bfa" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
              <path d="M54 48 Q60 54 66 48" stroke="#a78bfa" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
              <line x1="34" y1="48" x2="31" y2="45" stroke="#a78bfa" strokeWidth="1.2" opacity=".55"/>
              <line x1="46" y1="48" x2="48" y2="45" stroke="#a78bfa" strokeWidth="1.2" opacity=".55"/>
              <line x1="54" y1="48" x2="52" y2="45" stroke="#a78bfa" strokeWidth="1.2" opacity=".55"/>
              <line x1="66" y1="48" x2="69" y2="45" stroke="#a78bfa" strokeWidth="1.2" opacity=".55"/>
            </g>
          ) : (
            <g className="nk-blink">
              <ellipse cx="40" cy="48" rx="7.5" ry="7.2" fill="white"/>
              <ellipse cx="60" cy="48" rx="7.5" ry="7.2" fill="white"/>
              <circle cx="40" cy="48" r="5" fill="#1a1744"/>
              <circle cx="60" cy="48" r="5" fill="#1a1744"/>
              <circle className="nk-pupil" cx={watch?41:40} cy={watch?49:48} r="3" fill="#5eead4"/>
              <circle className="nk-pupil" cx={watch?61:60} cy={watch?49:48} r="3" fill="#5eead4"/>
              <circle cx="37.5" cy="45"   r="1.5" fill="white" opacity=".85"/>
              <circle cx="57.5" cy="45"   r="1.5" fill="white" opacity=".85"/>
            </g>
          )}
          <path d="M47 55 L53 55 L50 59 Z" fill="#f472b6"/>
          <path d="M47 59 Q50 62 53 59" stroke="#f472b6" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".65"/>
          <line x1="18" y1="56" x2="43" y2="56" stroke="#a78bfa" strokeWidth=".9" opacity=".4"/>
          <line x1="18" y1="59" x2="43" y2="60" stroke="#a78bfa" strokeWidth=".9" opacity=".4"/>
          <line x1="57" y1="56" x2="82" y2="56" stroke="#a78bfa" strokeWidth=".9" opacity=".4"/>
          <line x1="57" y1="60" x2="82" y2="59" stroke="#a78bfa" strokeWidth=".9" opacity=".4"/>
          <path d="M30 67 Q50 73 70 67" stroke="#5eead4" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".55"/>
          <circle cx="50" cy="70" r="2.8" fill="#5eead4" opacity=".85"/>
          <g className="nk-paws" style={{ transform:`translateY(${pawY}px)` }}>
            <ellipse cx="34" cy="87" rx="11" ry="8" fill="url(#nkEar)"/>
            <ellipse cx="29" cy="84" rx="2.2" ry="1.6" fill="#f472b6" opacity=".45"/>
            <ellipse cx="34" cy="82" rx="2.2" ry="1.6" fill="#f472b6" opacity=".45"/>
            <ellipse cx="39" cy="84" rx="2.2" ry="1.6" fill="#f472b6" opacity=".45"/>
            <ellipse cx="66" cy="87" rx="11" ry="8" fill="url(#nkEar)"/>
            <ellipse cx="61" cy="84" rx="2.2" ry="1.6" fill="#f472b6" opacity=".45"/>
            <ellipse cx="66" cy="82" rx="2.2" ry="1.6" fill="#f472b6" opacity=".45"/>
            <ellipse cx="71" cy="84" rx="2.2" ry="1.6" fill="#f472b6" opacity=".45"/>
          </g>
        </g>
        {dark && state === "idle" && (
          <g className="nk-zzz" filter="url(#nkGlow)">
            <text x="76" y="26" fontSize="14" fill="#a78bfa" fontWeight="800" fontFamily="Georgia,serif">Z</text>
            <text x="87" y="16" fontSize="10" fill="#7c3aed" fontWeight="800" fontFamily="Georgia,serif">z</text>
            <text x="94" y="9"  fontSize="7"  fill="#4c1d95" fontWeight="800" fontFamily="Georgia,serif">z</text>
          </g>
        )}
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────────── */
const LoginPage = ({ onLogin, dark, toggleDark }) => {
  const T = mkTheme(dark);
  const bp = useBreakpoint();
  const { sm, md } = bp;
  const [catState, setCat] = useState("idle");
  const [email,  setEmail] = useState("");
  const [pw,     setPw]    = useState("");
  const [err,    setErr]   = useState("");
  const [busy,   setBusy]  = useState(false);

  const doLogin = useCallback(() => {
    if (!email.trim()) { setErr("Please enter your email."); return; }
    if (!pw.trim())    { setErr("Please enter your password."); return; }
    setErr(""); setBusy(true);
    setTimeout(() => { setBusy(false); onLogin(); }, 1000);
  }, [email, pw, onLogin]);

  const onKey = useCallback(e => { if (e.key === "Enter") doLogin(); }, [doLogin]);

  const inp = {
    width:"100%", padding:"0.88rem 1rem", borderRadius:12,
    border:`1.5px solid ${T.inputBorder}`, background:T.inputBg, color:T.text,
    fontSize:"0.94rem", fontFamily:"'DM Sans',sans-serif",
    outline:"none", boxSizing:"border-box", transition:"border-color .2s,box-shadow .2s",
  };

  const isRow = !sm;

  return (
    <div style={{
      minHeight:"100vh", width:"100vw",
      display:"flex", flexDirection: isRow ? "row" : "column",
      fontFamily:"'DM Sans',sans-serif",
      background: dark
        ? "radial-gradient(ellipse at 20% 50%,#1e1b4b,#07061a)"
        : "radial-gradient(ellipse at 20% 50%,#dde8ff,#f4f6fb)",
      transition:"background .4s",
      position:"relative", overflowX:"hidden",
      boxSizing:"border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        html, body, #root { margin:0; padding:0; width:100%; min-height:100vh; }
        * { box-sizing:border-box; }
        @keyframes gridPulse  { 0%,100%{opacity:.03} 50%{opacity:.07} }
        @keyframes floatOrb   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .l-inp:focus { border-color:#5eead4 !important; box-shadow:0 0 0 3px rgba(94,234,212,.15) !important; }
        .l-btn { transition:all .2s; cursor:pointer; border:none; }
        .l-btn:hover  { filter:brightness(1.08); transform:translateY(-1px); }
        .l-btn:active { transform:scale(.97); }
        .tog-btn { transition:all .2s; cursor:pointer; }
        .tog-btn:hover { transform:rotate(20deg) scale(1.15); }
        .sso-btn { transition:all .18s; cursor:pointer; }
        .sso-btn:hover { border-color:rgba(94,234,212,.5) !important; transform:translateY(-1px); }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.12); border-radius:4px; }
      `}</style>

      {/* Grid bg */}
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,
        backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
        backgroundSize:"48px 48px", animation:"gridPulse 6s ease-in-out infinite" }}/>

      {/* Orbs */}
      {dark && !md && [
        ["-8%","28%","#312e81","380px",7],
        ["63%","-5%","#1e1b4b","280px",9],
        ["78%","53%","#4c1d95","200px",5],
      ].map(([l,t,c,s,d],i)=>(
        <div key={i} style={{ position:"fixed",left:l,top:t,width:s,height:s,borderRadius:"50%",
          background:`radial-gradient(circle,${c},transparent 70%)`,opacity:.5,pointerEvents:"none",zIndex:0,
          animation:`floatOrb ${d}s ease-in-out infinite`,animationDelay:`${i*1.8}s` }}/>
      ))}

      {/* BRANDING PANEL */}
      <div style={{
        position:"relative", zIndex:1,
        flex: isRow ? (md ? "0 0 38%" : "0 0 42%") : "0 0 auto",
        display:"flex", flexDirection:"column",
        justifyContent:"center", alignItems:"center",
        padding: sm ? "2rem 1.5rem 1.25rem" : md ? "2rem 1.5rem" : "3rem",
        borderRight: isRow ? `1px solid ${T.border}` : "none",
        borderBottom: !isRow ? `1px solid ${T.border}` : "none",
        background: dark ? "rgba(13,11,40,0.65)" : "rgba(255,255,255,0.55)",
        backdropFilter:"blur(10px)",
        animation:"fadeUp .6s ease",
      }}>
        <NekoMascot state={catState} dark={dark}/>
        <h1 style={{
          fontFamily:"'Syne',sans-serif",
          fontSize: sm ? "1.4rem" : md ? "1.7rem" : "2.1rem",
          fontWeight:800, color:T.text,
          margin:"0 0 0.2rem", textAlign:"center",
          letterSpacing:"-0.04em", lineHeight:1.15,
        }}>
          {sm ? "Neko University" : <><br/>Neko<br/>University</>}
        </h1>
        <p style={{ color:T.textSub, fontSize:"0.72rem", letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:600, textAlign:"center", margin: (sm||md) ? 0 : "0 0 2rem" }}>
          Enrollment System
        </p>
        {!md && (
          <div style={{ display:"flex",flexDirection:"column",gap:"0.85rem",width:"100%",maxWidth:270,marginTop:"1.5rem" }}>
            {[["📊","Real-time enrollment tracking"],["📚","Course management & scheduling"],["📋","Automated grade & GPA reports"],["🤖","AI-powered enrollment assistant"]]
              .map(([ic,lb],i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:"0.75rem" }}>
                  <div style={{ width:32,height:32,borderRadius:9,background:T.navActive,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.92rem",flexShrink:0 }}>{ic}</div>
                  <span style={{ color:T.textSub,fontSize:"0.81rem" }}>{lb}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* FORM PANEL */}
      <div style={{
        position:"relative", zIndex:1,
        flex:1, display:"flex", flexDirection:"column",
        justifyContent: sm ? "flex-start" : "center",
        alignItems:"center",
        padding: sm ? "1.5rem 1.25rem 2.5rem" : md ? "2rem 2rem" : "3rem 2.5rem",
        overflowY:"auto",
        animation:"fadeUp .55s ease",
      }}>
        <button className="tog-btn" onClick={toggleDark} style={{
          position:"absolute", top:"1rem", right:"1rem",
          background:T.surface, border:`1px solid ${T.border}`,
          borderRadius:11, padding:"0.45rem 0.65rem", fontSize:"1.05rem", lineHeight:1,
        }}>{dark?"☀️":"🌙"}</button>

        <div style={{ width:"100%", maxWidth:390, paddingTop: sm ? "1rem" : 0 }}>
          <div style={{ marginBottom:"1.6rem" }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:sm?"1.35rem":"1.7rem",fontWeight:800,color:T.text,margin:"0 0 0.28rem",letterSpacing:"-0.03em" }}>
              Welcome back 👋
            </h2>
            <p style={{ color:T.textSub,fontSize:"0.86rem",margin:0 }}>Sign in to continue to your portal</p>
          </div>

          <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
            <div>
              <label style={{ display:"block",fontSize:"0.72rem",fontWeight:700,color:T.textSub,marginBottom:"0.4rem",textTransform:"uppercase",letterSpacing:"0.06em" }}>
                Student / Staff Email
              </label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                onFocus={()=>{ setCat("email"); setErr(""); }}
                onBlur={()=>setCat("idle")} onKeyDown={onKey}
                placeholder="you@neko.edu.ph" className="l-inp" style={inp}/>
            </div>

            <div>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.4rem" }}>
                <label style={{ fontSize:"0.72rem",fontWeight:700,color:T.textSub,textTransform:"uppercase",letterSpacing:"0.06em" }}>Password</label>
                <span style={{ fontSize:"0.77rem",color:"#5eead4",cursor:"pointer",fontWeight:600 }}>Forgot?</span>
              </div>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
                onFocus={()=>{ setCat("pw"); setErr(""); }}
                onBlur={()=>setCat("idle")} onKeyDown={onKey}
                placeholder="••••••••" className="l-inp" style={inp}/>
            </div>

            {err && (
              <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.65rem 0.9rem",borderRadius:10,background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)" }}>
                <span>⚠️</span>
                <span style={{ color:"#fca5a5",fontSize:"0.82rem",fontWeight:500 }}>{err}</span>
              </div>
            )}

            <button className="l-btn" onClick={doLogin} disabled={busy} style={{
              width:"100%", padding:"0.92rem", borderRadius:12,
              background:"linear-gradient(135deg,#5eead4,#3b82f6)",
              color:"#07061a", fontWeight:700, fontSize:"0.95rem", fontFamily:"'DM Sans',sans-serif",
              marginTop:"0.2rem", opacity:busy?.7:1,
            }}>{busy?"Signing in…":"Sign In →"}</button>

            <div style={{ display:"flex",alignItems:"center",gap:"0.7rem" }}>
              <div style={{ flex:1,height:1,background:T.border }}/>
              <span style={{ color:T.textMuted,fontSize:"0.73rem",fontWeight:500 }}>or continue with</span>
              <div style={{ flex:1,height:1,background:T.border }}/>
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem" }}>
              {[["🏫","School SSO"],["🪪","ID Login"]].map(([ic,lb])=>(
                <button key={lb} className="sso-btn" style={{
                  padding:"0.72rem", borderRadius:10, border:`1.5px solid ${T.border}`,
                  background:T.surface, color:T.textSub, fontSize:"0.82rem", fontWeight:600,
                  fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
                }}>{ic} {lb}</button>
              ))}
            </div>

            <p style={{ textAlign:"center",fontSize:"0.74rem",color:T.textMuted,margin:"0.2rem 0 0" }}>
              Demo: any email + password → Sign In
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
const Sidebar = ({ active, setActive, collapsed, setCollapsed, onLogout, T }) => {
  const [confirm, setConfirm] = useState(false);
  return (
  <>
  <aside style={{
    width:collapsed?68:224, height:"100vh", flexShrink:0,
    background:T.sidebarBg,
    display:"flex", flexDirection:"column",
    transition:"width .28s cubic-bezier(.4,0,.2,1)",
    borderRight:"1px solid rgba(255,255,255,0.06)",
    position:"sticky", top:0,
    zIndex:20, overflow:"hidden",
  }}>
    <div style={{ padding:"1.3rem 1rem",display:"flex",alignItems:"center",gap:"0.7rem",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0 }}>
      <div style={{ width:36,height:36,borderRadius:10,flexShrink:0,background:"linear-gradient(135deg,#5eead4,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",boxShadow:"0 4px 12px rgba(94,234,212,0.3)" }}>🐱</div>
      {!collapsed && (
        <div style={{ overflow:"hidden" }}>
          <div style={{ color:"#f0f4ff",fontWeight:700,fontSize:"0.9rem",whiteSpace:"nowrap",fontFamily:"'Syne',sans-serif" }}>Neko Univ.</div>
          <div style={{ color:"#4b5563",fontSize:"0.65rem",whiteSpace:"nowrap" }}>Enrollment System</div>
        </div>
      )}
    </div>
    <nav style={{ flex:1,padding:"0.8rem 0.6rem",display:"flex",flexDirection:"column",gap:"0.18rem",overflowY:"auto" }}>
      {!collapsed && <div style={{ fontSize:"0.61rem",color:"#374151",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"0 0.6rem",marginBottom:"0.35rem" }}>Main Menu</div>}
      {NAV.map(n=>(
        <button key={n.id} onClick={()=>setActive(n.id)} title={collapsed?n.label:""} style={{
          display:"flex",alignItems:"center",gap:"0.7rem",
          padding:"0.7rem 0.82rem",borderRadius:10,border:"none",cursor:"pointer",
          background:active===n.id?"rgba(94,234,212,0.12)":"transparent",
          color:active===n.id?"#5eead4":"#6b7280",
          fontWeight:active===n.id?700:500,fontSize:"0.86rem",
          width:"100%",textAlign:"left",transition:"all .16s",
          borderLeft:active===n.id?"3px solid #5eead4":"3px solid transparent",
          fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",
        }}>
          <span style={{ fontSize:"1.05rem",flexShrink:0 }}>{n.icon}</span>
          {!collapsed && n.label}
        </button>
      ))}
    </nav>
    <div style={{ padding:"0.75rem 0.6rem",borderTop:"1px solid rgba(255,255,255,0.07)",flexShrink:0 }}>
      {!collapsed && (
        <div style={{ display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.55rem 0.82rem",marginBottom:"0.4rem" }}>
          <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#5eead4,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#07061a",fontWeight:800,fontSize:"0.7rem",flexShrink:0 }}>SA</div>
          <div>
            <div style={{ color:"#e2e8f0",fontSize:"0.78rem",fontWeight:600 }}>System Admin</div>
            <div style={{ color:"#4b5563",fontSize:"0.64rem" }}>Registrar</div>
          </div>
        </div>
      )}
      <button onClick={()=>setCollapsed(!collapsed)} style={{ display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.5rem 0.82rem",borderRadius:8,border:"none",cursor:"pointer",background:"transparent",color:"#4b5563",fontSize:"0.8rem",width:"100%",fontFamily:"'DM Sans',sans-serif" }}>
        <span>{collapsed?"⇥":"⇤"}</span>{!collapsed&&"Collapse"}
      </button>
      <button onClick={()=>setConfirm(true)} style={{ display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.5rem 0.82rem",borderRadius:8,border:"none",cursor:"pointer",background:"rgba(248,113,113,0.08)",color:"#f87171",fontSize:"0.8rem",width:"100%",fontFamily:"'DM Sans',sans-serif",marginTop:"0.2rem" }}>
        🚪{!collapsed&&" Sign Out"}
      </button>
    </div>
  </aside>

  {confirm && (
    <LogoutConfirmModal
      T={T}
      onConfirm={onLogout}
      onCancel={()=>setConfirm(false)}
    />
  )}
  </>
  );
};

/* ─────────────────────────────────────────────
   MOBILE BOTTOM NAV
───────────────────────────────────────────── */
const BottomNav = ({ active, setActive, T }) => (
  <nav style={{
    position:"fixed", bottom:0, left:0, right:0, zIndex:30,
    background:T.sidebarBg,
    borderTop:"1px solid rgba(255,255,255,0.08)",
    display:"flex", alignItems:"stretch",
    paddingBottom:"env(safe-area-inset-bottom, 0px)",
  }}>
    {NAV.map(n=>(
      <button key={n.id} onClick={()=>setActive(n.id)} style={{
        flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        gap:"0.18rem", padding:"0.5rem 0.25rem 0.6rem",
        border:"none", background:"transparent", cursor:"pointer",
        color:active===n.id?"#5eead4":"#6b7280",
        transition:"color .15s",
        borderTop: active===n.id ? "2px solid #5eead4" : "2px solid transparent",
        fontFamily:"'DM Sans',sans-serif",
      }}>
        <span style={{ fontSize:"1.15rem", lineHeight:1 }}>{n.icon}</span>
        <span style={{ fontSize:"0.52rem", fontWeight:active===n.id?700:500, letterSpacing:"0.02em", whiteSpace:"nowrap" }}>
          {n.label}
        </span>
      </button>
    ))}
  </nav>
);

/* ─────────────────────────────────────────────  PRIMITIVES  ── */
const Card = ({ T, children, style={}, ...rest }) => (
  <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,boxShadow:T.shadow,...style }} {...rest}>
    {children}
  </div>
);
const Ttl = ({ T, children, sm }) => (
  <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:sm?"0.82rem":"0.9rem",fontWeight:700,color:T.text,margin:"0 0 0.85rem",letterSpacing:"-0.01em" }}>
    {children}
  </h3>
);
const tipCfg = T => ({
  contentStyle:{ background:T.tooltipBg,border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#f0f4ff",fontSize:11,padding:"7px 11px" },
  labelStyle:{ color:"#94a3b8" },
  cursor:{ stroke:T.dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)",strokeWidth:16 },
});
const Stat = ({ T, icon, label, value, sub, color, trend, sm }) => (
  <Card T={T} style={{ padding:sm?"1rem":"1.2rem 1.3rem",cursor:"default",transition:"all .2s" }}
    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=T.dark?"0 12px 32px rgba(0,0,0,.4)":"0 8px 24px rgba(0,0,0,.1)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=T.shadow; }}
  >
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.7rem" }}>
      <div style={{ width:sm?36:40,height:sm?36:40,borderRadius:10,background:`${color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:sm?"1.1rem":"1.25rem" }}>{icon}</div>
      {trend!=null&&<span style={{ fontSize:"0.67rem",fontWeight:700,padding:"0.18rem 0.5rem",borderRadius:20,color:trend>0?"#34d399":"#f87171",background:trend>0?"rgba(52,211,153,0.12)":"rgba(248,113,113,0.12)" }}>{trend>0?"+":""}{trend}%</span>}
    </div>
    <div style={{ fontSize:sm?"1.55rem":"1.9rem",fontWeight:800,color:T.text,letterSpacing:"-0.04em",fontFamily:"'Syne',sans-serif",lineHeight:1 }}>{value}</div>
    <div style={{ fontSize:"0.78rem",color:T.textSub,marginTop:"0.2rem" }}>{label}</div>
    {sub&&<div style={{ fontSize:"0.68rem",color,marginTop:"0.18rem",fontWeight:600 }}>{sub}</div>}
  </Card>
);

/* ─────────────────────────────────────────────  WEATHER  ── */
const WeatherWidget = ({ T, sm }) => (
  <Card T={T} style={{
    padding:sm?"1rem":"1.3rem",
    background:T.dark?"linear-gradient(135deg,rgba(59,130,246,.12),rgba(14,165,233,.08))":"linear-gradient(135deg,rgba(59,130,246,.07),rgba(14,165,233,.04))",
    border:`1px solid ${T.dark?"rgba(59,130,246,.2)":"rgba(59,130,246,.15)"}`,
  }}>
    <Ttl T={T} sm={sm}>🌤️ Local Weather</Ttl>
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.9rem" }}>
      <div>
        <div style={{ fontSize:"0.68rem",color:T.textMuted,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase" }}>{WEATHER.loc}</div>
        <div style={{ fontSize:sm?"2.2rem":"2.8rem",fontWeight:800,color:T.text,fontFamily:"'Syne',sans-serif",letterSpacing:"-0.05em",lineHeight:1.1 }}>{WEATHER.temp}°<span style={{ fontSize:sm?"1.1rem":"1.5rem" }}>F</span></div>
        <div style={{ color:T.textSub,fontSize:"0.84rem",marginTop:"0.15rem" }}>{WEATHER.cond}</div>
      </div>
      <div style={{ fontSize:sm?"2.8rem":"3.6rem" }}>{WEATHER.icon}</div>
    </div>
    <div style={{ display:"flex",gap:"0.4rem" }}>
      {WEATHER.daily.map((d,i)=>(
        <div key={i} style={{ flex:1,textAlign:"center",padding:"0.5rem 0.2rem",background:T.dark?"rgba(255,255,255,0.05)":"rgba(59,130,246,0.06)",borderRadius:10 }}>
          <div style={{ fontSize:"0.62rem",color:T.textMuted,fontWeight:700 }}>{d.day}</div>
          <div style={{ fontSize:"1.1rem",margin:"0.25rem 0",lineHeight:1 }}>{d.icon}</div>
          <div style={{ fontSize:"0.76rem",color:T.text,fontWeight:700 }}>{d.hi}°</div>
          <div style={{ fontSize:"0.6rem",color:"#60a5fa" }}>{d.pct}%</div>
        </div>
      ))}
    </div>
  </Card>
);

/* ─────────────────────────────────────────────  CHATBOT  ── */
const Chatbot = ({ T, sm }) => {
  const [msgs,   setMsgs]  = useState([{ from:"bot", text:"Hi! I'm NekoBot 🐱 Ask about enrollment, schedules, GPA, or tuition!" }]);
  const [inp,    setInp]   = useState("");
  const [typing, setTyping]= useState(false);
  const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:"smooth" }); },[msgs]);

  const send = useCallback(()=>{
    if (!inp.trim()) return;
    const lower = inp.toLowerCase();
    const key   = Object.keys(BOT_KB).find(k=>lower.includes(k))||"default";
    setMsgs(p=>[...p,{ from:"user",text:inp }]);
    setInp(""); setTyping(true);
    setTimeout(()=>{ setTyping(false); setMsgs(p=>[...p,{ from:"bot",text:BOT_KB[key] }]); },700);
  },[inp]);

  return (
    <Card T={T} style={{ padding:sm?"1rem":"1.2rem",display:"flex",flexDirection:"column",height:sm?260:310 }}>
      <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.7rem" }}>
        <span style={{ fontFamily:"'Syne',sans-serif",fontSize:"0.88rem",fontWeight:700,color:T.text }}>🐱 NekoBot</span>
        <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:"0.35rem" }}>
          <div style={{ width:6,height:6,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 5px #34d399" }}/>
          <span style={{ fontSize:"0.63rem",color:"#34d399",fontWeight:700 }}>ONLINE</span>
        </div>
      </div>
      <div style={{ flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"0.7rem" }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:"0.35rem" }}>
            {m.from==="bot"&&<div style={{ width:20,height:20,borderRadius:"50%",background:"linear-gradient(135deg,#5eead4,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",flexShrink:0 }}>🐱</div>}
            <div style={{ maxWidth:"78%",padding:"0.55rem 0.8rem",borderRadius:m.from==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",background:m.from==="user"?"linear-gradient(135deg,#5eead4,#3b82f6)":T.dark?"rgba(255,255,255,0.07)":"#f1f5f9",color:m.from==="user"?"#07061a":T.text,fontSize:"0.79rem",lineHeight:1.5,fontWeight:m.from==="user"?600:400 }}>
              {m.text}
            </div>
          </div>
        ))}
        {typing&&(
          <div style={{ display:"flex",alignItems:"center",gap:"0.35rem" }}>
            <div style={{ width:20,height:20,borderRadius:"50%",background:"linear-gradient(135deg,#5eead4,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem" }}>🐱</div>
            <div style={{ padding:"0.5rem 0.8rem",borderRadius:"12px 12px 12px 4px",background:T.dark?"rgba(255,255,255,0.07)":"#f1f5f9" }}>
              <div style={{ display:"flex",gap:3,alignItems:"center" }}>
                {[0,1,2].map(i=><div key={i} style={{ width:5,height:5,borderRadius:"50%",background:T.textMuted,animation:"nekoBob 1.2s ease-in-out infinite",animationDelay:`${i*.2}s` }}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div style={{ display:"flex",gap:"0.45rem" }}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask about enrollment…"
          style={{ flex:1,padding:"0.6rem 0.85rem",borderRadius:9,border:`1.5px solid ${T.inputBorder}`,background:T.inputBg,color:T.text,fontSize:"0.8rem",fontFamily:"'DM Sans',sans-serif",outline:"none" }}
        />
        <button onClick={send} style={{ padding:"0.6rem 0.9rem",borderRadius:9,border:"none",background:"linear-gradient(135deg,#5eead4,#3b82f6)",color:"#07061a",fontWeight:700,cursor:"pointer",fontSize:"0.9rem" }}>↑</button>
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────  DASHBOARD  ── */
const DashboardPage = ({ T, bp }) => {
  const { sm, md } = bp;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:sm?"1rem":"1.4rem" }}>
      <div>
        <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:sm?"1.3rem":"1.6rem",fontWeight:800,color:T.text,margin:"0 0 0.25rem",letterSpacing:"-0.03em" }}>
          Good morning, Admin 👋
        </h2>
        <p style={{ color:T.textMuted,fontSize:"0.8rem",margin:0 }}>
          Thu Feb 19 2026 · AY 2025–26 2nd Sem · Enrollment <span style={{ color:T.accent,fontWeight:700 }}>OPEN</span>
        </p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:sm?"1fr 1fr":"repeat(4,1fr)",gap:sm?"0.65rem":"0.9rem" }}>
        <Stat T={T} sm={sm} icon="👥" label="Total Students"  value="1,178" sub="Active"       color={T.accent}    trend={2.8}  />
        <Stat T={T} sm={sm} icon="📚" label="Courses"         value="42"    sub="2nd Sem"      color={T.accentPurp} trend={5}   />
        <Stat T={T} sm={sm} icon="🏛️" label="Departments"      value="6"     sub="Academic"     color={T.accentPink}             />
        <Stat T={T} sm={sm} icon="🎓" label="Graduates 2025"  value="312"   sub="Batch 2025"   color={T.accentAmb} trend={-1.2} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns: (sm||md) ? "1fr" : "3fr 2fr", gap:sm?"0.65rem":"0.9rem" }}>
        <Card T={T} style={{ padding:sm?"1rem":"1.3rem" }}>
          <Ttl T={T} sm={sm}>📈 Enrollment Trend</Ttl>
          <ResponsiveContainer width="100%" height={sm?160:195}>
            <AreaChart data={TREND} margin={{ top:4,right:4,bottom:0,left:-20 }}>
              <defs>
                <linearGradient id="tg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#5eead4" stopOpacity={T.dark?.25:.18}/>
                  <stop offset="95%" stopColor="#5eead4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} vertical={false}/>
              <XAxis dataKey="mo" tick={{ fill:T.textMuted,fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:T.textMuted,fontSize:10 }} axisLine={false} tickLine={false}/>
              <Tooltip {...tipCfg(T)}/>
              <Area type="monotone" dataKey="enrolled" name="Enrolled" stroke="#5eead4" strokeWidth={2.5} fill="url(#tg1)"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card T={T} style={{ padding:sm?"1rem":"1.3rem" }}>
          <Ttl T={T} sm={sm}>🎓 Programs</Ttl>
          <ResponsiveContainer width="100%" height={sm?160:195}>
            <PieChart>
              <Pie data={PROG_DIST} cx="50%" cy="46%" innerRadius={sm?42:52} outerRadius={sm?65:80} dataKey="value" paddingAngle={4} strokeWidth={0}>
                {PROG_DIST.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip {...tipCfg(T)}/>
              <Legend iconType="circle" iconSize={7} formatter={v=><span style={{ color:T.textSub,fontSize:10 }}>{v}</span>}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div style={{ display:"grid", gridTemplateColumns: (sm||md) ? "1fr" : "1fr 1fr", gap:sm?"0.65rem":"0.9rem" }}>
        <WeatherWidget T={T} sm={sm}/>
        <Chatbot T={T} sm={sm}/>
      </div>
      <Card T={T} style={{ padding:sm?"1rem":"1.3rem" }}>
        <Ttl T={T} sm={sm}>🔔 Recent Activity</Ttl>
        {[
          { icon:"📝", text:"Aaliyah Reyes enrolled in CS301", time:"2m ago",  color:T.accent       },
          { icon:"✅", text:"IT201 grade submission approved",  time:"15m ago", color:T.accentPurp   },
          { icon:"⚠️", text:"CS201 OOP is now full (50/50)",   time:"1h ago",  color:T.accentAmb    },
          { icon:"📋", text:"5 enrollment requests pending",    time:"2h ago",  color:T.accentPink   },
          { icon:"🎓", text:"Batch 2025 clearance started",    time:"3h ago",  color:T.accentBlue   },
        ].map((a,i,arr)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.65rem 0",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
            <div style={{ width:sm?30:34,height:sm?30:34,borderRadius:9,background:`${a.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:sm?"0.85rem":"1rem",flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1,color:T.text,fontSize:sm?"0.78rem":"0.83rem",fontWeight:500,minWidth:0 }}>
              <span style={{ display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:sm?"nowrap":"normal" }}>{a.text}</span>
            </div>
            <span style={{ fontSize:"0.67rem",color:T.textMuted,whiteSpace:"nowrap",flexShrink:0 }}>{a.time}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────  STUDENTS  ── */
const sCol = { enrolled:"#34d399", irregular:"#fbbf24", LOA:"#f87171" };

const StudentsPage = ({ T, bp }) => {
  const { sm } = bp;
  const [q, setQ] = useState("");
  const list = STUDENTS.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.course.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:sm?"0.8rem":"1.1rem" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.5rem" }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:sm?"1.2rem":"1.45rem",fontWeight:800,color:T.text,margin:0 }}>👥 Students</h2>
        <button style={{ padding:sm?"0.5rem 0.9rem":"0.6rem 1.1rem",borderRadius:9,border:"none",background:"linear-gradient(135deg,#5eead4,#3b82f6)",color:"#07061a",fontWeight:700,cursor:"pointer",fontSize:sm?"0.75rem":"0.82rem",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap" }}>+ Add</button>
      </div>
      <div style={{ display:"flex",gap:"0.6rem",flexWrap:"wrap" }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Search students…"
          style={{ flex:1,minWidth:140,padding:"0.72rem 0.9rem",borderRadius:10,border:`1.5px solid ${T.inputBorder}`,background:T.inputBg,color:T.text,fontSize:"0.85rem",fontFamily:"'DM Sans',sans-serif",outline:"none" }}
        />
        {!sm&&<button style={{ padding:"0.72rem 0.9rem",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.surface,color:T.textSub,fontSize:"0.83rem",cursor:"pointer" }}>⬇ Export</button>}
      </div>
      {sm ? (
        <div style={{ display:"flex",flexDirection:"column",gap:"0.55rem" }}>
          {list.map((s,i)=>(
            <Card key={s.id} T={T} style={{ padding:"0.9rem" }}>
              <div style={{ display:"flex",alignItems:"center",gap:"0.7rem" }}>
                <div style={{ width:36,height:36,borderRadius:"50%",background:`hsl(${(i*53)%360},55%,40%)`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:"0.72rem",fontWeight:800,flexShrink:0 }}>{s.av}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ color:T.text,fontWeight:700,fontSize:"0.87rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.name}</div>
                  <div style={{ color:T.textMuted,fontSize:"0.72rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.course}</div>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <div style={{ fontSize:"0.82rem",fontWeight:700,color:T.text }}>GPA {s.gpa.toFixed(2)}</div>
                  <span style={{ fontSize:"0.65rem",fontWeight:700,padding:"0.15rem 0.5rem",borderRadius:20,background:`${sCol[s.status]}18`,color:sCol[s.status] }}>{s.status}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card T={T} style={{ overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",minWidth:600 }}>
              <thead>
                <tr style={{ background:T.dark?"rgba(255,255,255,0.03)":T.bgDeep }}>
                  {["ID","Name","Program","Yr","GPA","Status",""].map(h=>(
                    <th key={h} style={{ padding:"0.85rem 1rem",textAlign:"left",fontSize:"0.67rem",fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((s,i)=>(
                  <tr key={s.id} style={{ borderTop:`1px solid ${T.border}`,transition:"background .13s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=T.surfaceHov}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <td style={{ padding:"0.85rem 1rem",color:T.textMuted,fontSize:"0.74rem",fontFamily:"monospace",whiteSpace:"nowrap" }}>{s.id}</td>
                    <td style={{ padding:"0.85rem 1rem" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:"0.6rem" }}>
                        <div style={{ width:30,height:30,borderRadius:"50%",background:`hsl(${(i*53)%360},55%,${T.dark?38:50}%)`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:"0.68rem",fontWeight:800,flexShrink:0 }}>{s.av}</div>
                        <span style={{ color:T.text,fontWeight:600,fontSize:"0.84rem",whiteSpace:"nowrap" }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding:"0.85rem 1rem",color:T.textSub,fontSize:"0.79rem" }}>{s.course}</td>
                    <td style={{ padding:"0.85rem 1rem",color:T.textSub,fontSize:"0.8rem",textAlign:"center" }}>{s.yr}</td>
                    <td style={{ padding:"0.85rem 1rem",color:T.text,fontWeight:700,fontSize:"0.82rem" }}>{s.gpa.toFixed(2)}</td>
                    <td style={{ padding:"0.85rem 1rem" }}>
                      <span style={{ fontSize:"0.68rem",fontWeight:700,padding:"0.22rem 0.6rem",borderRadius:20,background:`${sCol[s.status]}18`,color:sCol[s.status] }}>{s.status}</span>
                    </td>
                    <td style={{ padding:"0.85rem 1rem" }}>
                      <button style={{ padding:"0.28rem 0.65rem",borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",color:T.textSub,fontSize:"0.73rem",cursor:"pointer" }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:"0.7rem 1rem",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.5rem" }}>
            <span style={{ fontSize:"0.75rem",color:T.textMuted }}>Showing {list.length} of {STUDENTS.length}</span>
            <div style={{ display:"flex",gap:"0.35rem" }}>
              {["‹","1","2","3","›"].map((p,i)=>(
                <button key={i} style={{ width:28,height:28,borderRadius:6,border:`1px solid ${i===1?T.accent:T.border}`,background:i===1?"rgba(94,234,212,0.12)":"transparent",color:i===1?T.accent:T.textSub,fontSize:"0.8rem",cursor:"pointer" }}>{p}</button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────  COURSES  ── */
const CoursesPage = ({ T, bp }) => {
  const { sm, md } = bp;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:sm?"0.8rem":"1.1rem" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:sm?"1.2rem":"1.45rem",fontWeight:800,color:T.text,margin:0 }}>📚 Courses</h2>
        <button style={{ padding:sm?"0.5rem 0.9rem":"0.6rem 1.1rem",borderRadius:9,border:"none",background:"linear-gradient(135deg,#a78bfa,#6366f1)",color:"white",fontWeight:700,cursor:"pointer",fontSize:sm?"0.75rem":"0.82rem",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap" }}>+ Add</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:sm?"1fr 1fr":md?"1fr 1fr":"repeat(3,1fr)",gap:sm?"0.6rem":"0.85rem" }}>
        {COURSES.map(c=>{
          const pct=Math.round((c.enrolled/c.cap)*100);
          const col=pct>=100?"#f87171":pct>=80?"#fbbf24":"#34d399";
          return (
            <Card key={c.code} T={T} style={{ padding:sm?"0.85rem":"1.2rem",cursor:"default",transition:"all .2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform=""; }}
            >
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.6rem" }}>
                <span style={{ fontFamily:"monospace",fontSize:"0.68rem",color:"#6366f1",fontWeight:700,background:"rgba(99,102,241,0.1)",padding:"0.18rem 0.45rem",borderRadius:5 }}>{c.code}</span>
                <span style={{ fontSize:"0.67rem",color:T.textMuted }}>{c.units}u</span>
              </div>
              <div style={{ fontWeight:700,color:T.text,fontSize:sm?"0.8rem":"0.88rem",marginBottom:"0.2rem",lineHeight:1.3 }}>{c.name}</div>
              <div style={{ color:T.textMuted,fontSize:"0.72rem",marginBottom:"0.75rem" }}>👤 {c.inst}</div>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:"0.7rem",color:T.textSub,marginBottom:"0.3rem" }}>
                <span>Capacity</span><span style={{ color:col,fontWeight:700 }}>{c.enrolled}/{c.cap}</span>
              </div>
              <div style={{ height:4,background:T.dark?"rgba(255,255,255,0.07)":T.bgDeep,borderRadius:2,overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${pct}%`,background:col,borderRadius:2,transition:"width .5s" }}/>
              </div>
            </Card>
          );
        })}
      </div>
      <Card T={T} style={{ padding:sm?"1rem":"1.3rem" }}>
        <Ttl T={T} sm={sm}>📊 GPA Distribution</Ttl>
        <ResponsiveContainer width="100%" height={sm?150:190}>
          <BarChart data={GPA_DIST} margin={{ top:4,right:4,bottom:0,left:-20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} vertical={false}/>
            <XAxis dataKey="range" tick={{ fill:T.textMuted,fontSize:10 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:T.textMuted,fontSize:10 }} axisLine={false} tickLine={false}/>
            <Tooltip {...tipCfg(T)}/>
            <Bar dataKey="count" radius={[5,5,0,0]}>
              {GPA_DIST.map((_,i)=><Cell key={i} fill={["#5eead4","#a78bfa","#f472b6","#fbbf24","#f87171"][i]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────  ENROLLMENT  ── */
const EnrollmentPage = ({ T, bp }) => {
  const { sm } = bp;
  const [step, setStep] = useState(1);
  const [sel,  setSel]  = useState([]);
  const [done, setDone] = useState(false);
  const steps = ["Student","Subjects","Confirm"];

  if (done) return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"3rem 1rem",gap:"1rem",textAlign:"center" }}>
      <div style={{ fontSize:"3.5rem" }}>✅</div>
      <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:sm?"1.3rem":"1.7rem",fontWeight:800,color:T.text,margin:0 }}>Enrollment Submitted!</h2>
      <p style={{ color:T.textSub,fontSize:"0.86rem",maxWidth:340 }}>Your request has been submitted for approval. Check your email for confirmation.</p>
      <button onClick={()=>{ setDone(false);setStep(1);setSel([]); }} style={{ padding:"0.8rem 1.8rem",borderRadius:11,border:"none",background:"linear-gradient(135deg,#5eead4,#3b82f6)",color:"#07061a",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
        Start New Enrollment
      </button>
    </div>
  );

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:sm?"0.9rem":"1.3rem" }}>
      <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:sm?"1.2rem":"1.45rem",fontWeight:800,color:T.text,margin:0 }}>📋 Enrollment Wizard</h2>
      <div style={{ display:"flex",alignItems:"center" }}>
        {steps.map((s,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",flex:i<steps.length-1?1:"initial" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"0.45rem",cursor:"pointer" }} onClick={()=>step>i+1&&setStep(i+1)}>
              <div style={{ width:sm?28:32,height:sm?28:32,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:sm?"0.75rem":"0.83rem",transition:"all .2s",
                background:step>i+1?"#34d399":step===i+1?"linear-gradient(135deg,#5eead4,#3b82f6)":T.dark?"rgba(255,255,255,0.08)":"#e5e7eb",
                color:step>=i+1?"#07061a":T.textMuted,boxShadow:step===i+1?"0 4px 14px rgba(94,234,212,.35)":"none" }}>
                {step>i+1?"✓":i+1}
              </div>
              {!sm&&<span style={{ fontSize:"0.83rem",fontWeight:step===i+1?700:500,color:step>=i+1?T.text:T.textMuted,whiteSpace:"nowrap" }}>{s}</span>}
            </div>
            {i<steps.length-1&&<div style={{ flex:1,height:2,borderRadius:2,margin:sm?"0 0.4rem":"0 0.8rem",background:step>i+1?"#34d399":T.border,transition:"background .3s" }}/>}
          </div>
        ))}
      </div>
      <Card T={T} style={{ padding:sm?"1rem":"1.6rem" }}>
        {step===1&&(
          <div>
            <p style={{ color:T.textSub,marginBottom:"1rem",fontSize:"0.86rem" }}>Select a student to enroll:</p>
            <div style={{ display:"flex",flexDirection:"column",gap:"0.5rem" }}>
              {STUDENTS.slice(0,5).map((s,i)=>(
                <div key={s.id} onClick={()=>setStep(2)}
                  style={{ display:"flex",alignItems:"center",gap:"0.8rem",padding:"0.8rem 0.9rem",borderRadius:11,border:`1.5px solid ${T.border}`,background:T.dark?"rgba(255,255,255,0.02)":"#fafbff",cursor:"pointer",transition:"all .17s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor="#5eead4";e.currentTarget.style.background="rgba(94,234,212,0.05)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.dark?"rgba(255,255,255,0.02)":"#fafbff"; }}
                >
                  <div style={{ width:34,height:34,borderRadius:"50%",background:`hsl(${(i*53)%360},55%,${T.dark?38:50}%)`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:"0.72rem",flexShrink:0 }}>{s.av}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ color:T.text,fontWeight:600,fontSize:"0.86rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.name}</div>
                    <div style={{ color:T.textMuted,fontSize:"0.72rem" }}>{s.id} · Yr {s.yr}</div>
                  </div>
                  <span style={{ color:T.accent,flexShrink:0 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {step===2&&(
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",flexWrap:"wrap",gap:"0.4rem" }}>
              <p style={{ color:T.textSub,fontSize:"0.86rem",margin:0 }}>Select subjects:</p>
              <span style={{ fontSize:"0.76rem",color:T.accent,fontWeight:700 }}>{sel.length} selected · {sel.reduce((a,c)=>a+(COURSES.find(x=>x.code===c)?.units||0),0)} units</span>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1.2rem" }}>
              {COURSES.map(c=>{
                const isSel=sel.includes(c.code), full=c.enrolled>=c.cap;
                return (
                  <div key={c.code} onClick={()=>!full&&setSel(isSel?sel.filter(x=>x!==c.code):[...sel,c.code])}
                    style={{ display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.8rem 0.9rem",borderRadius:11,border:`1.5px solid ${isSel?"rgba(94,234,212,0.5)":T.border}`,background:isSel?"rgba(94,234,212,0.06)":T.dark?"rgba(255,255,255,0.02)":"#fafbff",cursor:full?"not-allowed":"pointer",transition:"all .17s",opacity:full?.55:1 }}
                  >
                    <div style={{ width:20,height:20,borderRadius:5,border:`2px solid ${isSel?"#5eead4":T.inputBorder}`,background:isSel?"#5eead4":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#07061a",fontSize:"0.75rem",flexShrink:0 }}>{isSel?"✓":""}</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ color:T.text,fontWeight:600,fontSize:"0.84rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{c.name}</div>
                      <div style={{ color:T.textMuted,fontSize:"0.71rem" }}>{c.code} · {c.units}u · {c.inst}</div>
                    </div>
                    <span style={{ fontSize:"0.69rem",color:full?"#f87171":"#34d399",fontWeight:700,flexShrink:0 }}>{full?"FULL":`${c.cap-c.enrolled} left`}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex",gap:"0.7rem",flexWrap:"wrap" }}>
              <button onClick={()=>setStep(1)} style={{ padding:"0.75rem 1.3rem",borderRadius:10,border:`1.5px solid ${T.border}`,background:"transparent",color:T.textSub,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>← Back</button>
              <button onClick={()=>sel.length>0&&setStep(3)} style={{ padding:"0.75rem 1.3rem",borderRadius:10,border:"none",background:sel.length>0?"linear-gradient(135deg,#5eead4,#3b82f6)":"rgba(255,255,255,0.08)",color:sel.length>0?"#07061a":T.textMuted,fontWeight:700,cursor:sel.length>0?"pointer":"not-allowed",fontFamily:"'DM Sans',sans-serif" }}>
                Review →
              </button>
            </div>
          </div>
        )}
        {step===3&&(
          <div>
            <p style={{ color:T.textSub,marginBottom:"1rem",fontSize:"0.86rem" }}>Review before submitting:</p>
            <div style={{ background:T.dark?"rgba(255,255,255,0.03)":T.bgDeep,borderRadius:11,padding:"1rem",marginBottom:"1.2rem" }}>
              {sel.map(code=>{ const c=COURSES.find(x=>x.code===code); return c?(
                <div key={code} style={{ display:"flex",justifyContent:"space-between",padding:"0.55rem 0",borderBottom:`1px solid ${T.border}`,fontSize:"0.82rem" }}>
                  <div><span style={{ color:T.text,fontWeight:600 }}>{c.name}</span><span style={{ color:T.textMuted,marginLeft:"0.5rem",fontSize:"0.75rem" }}>({c.code})</span></div>
                  <span style={{ color:T.accent,fontWeight:700 }}>{c.units}u</span>
                </div>
              ):null; })}
              <div style={{ display:"flex",justifyContent:"space-between",marginTop:"0.7rem",fontWeight:800,color:T.text }}>
                <span>Total</span>
                <span style={{ color:T.accent }}>{sel.reduce((a,c)=>a+(COURSES.find(x=>x.code===c)?.units||0),0)} units</span>
              </div>
            </div>
            <div style={{ display:"flex",gap:"0.7rem",flexWrap:"wrap" }}>
              <button onClick={()=>setStep(2)} style={{ padding:"0.75rem 1.3rem",borderRadius:10,border:`1.5px solid ${T.border}`,background:"transparent",color:T.textSub,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>← Back</button>
              <button onClick={()=>setDone(true)} style={{ padding:"0.75rem 1.5rem",borderRadius:10,border:"none",background:"linear-gradient(135deg,#5eead4,#3b82f6)",color:"#07061a",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>✓ Confirm & Submit</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────  REPORTS  ── */
const ReportsPage = ({ T, bp }) => {
  const { sm, md } = bp;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:sm?"0.8rem":"1.1rem" }}>
      <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:sm?"1.2rem":"1.45rem",fontWeight:800,color:T.text,margin:0 }}>📊 Reports</h2>
      <div style={{ display:"grid", gridTemplateColumns:(sm||md)?"1fr":"1fr 1fr", gap:sm?"0.7rem":"0.9rem" }}>
        <Card T={T} style={{ padding:sm?"1rem":"1.3rem" }}>
          <Ttl T={T} sm={sm}>📈 Enrollment vs Dropouts</Ttl>
          <ResponsiveContainer width="100%" height={sm?160:210}>
            <BarChart data={TREND} margin={{ top:4,right:4,bottom:0,left:-20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} vertical={false}/>
              <XAxis dataKey="mo" tick={{ fill:T.textMuted,fontSize:10 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:T.textMuted,fontSize:10 }} axisLine={false} tickLine={false}/>
              <Tooltip {...tipCfg(T)}/>
              <Legend formatter={v=><span style={{ color:T.textSub,fontSize:10 }}>{v}</span>}/>
              <Bar dataKey="enrolled" fill="#5eead4" radius={[4,4,0,0]} name="Enrolled"/>
              <Bar dataKey="dropped"  fill="#f87171" radius={[4,4,0,0]} name="Dropped"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card T={T} style={{ padding:sm?"1rem":"1.3rem" }}>
          <Ttl T={T} sm={sm}>🎓 Program Distribution</Ttl>
          <ResponsiveContainer width="100%" height={sm?160:210}>
            <PieChart>
              <Pie data={PROG_DIST} cx="50%" cy="50%" outerRadius={sm?70:85} dataKey="value" strokeWidth={0}
                label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}
                labelLine={{ stroke:T.textMuted,strokeWidth:1 }}>
                {PROG_DIST.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip {...tipCfg(T)}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card T={T} style={{ padding:sm?"1rem":"1.3rem" }}>
        <Ttl T={T} sm={sm}>📥 Export Reports</Ttl>
        <div style={{ display:"grid",gridTemplateColumns:sm?"1fr 1fr":"repeat(auto-fill,minmax(180px,1fr))",gap:sm?"0.55rem":"0.7rem" }}>
          {[["📝","Enrollment List","CSV"],["🪪","Class Cards","PDF"],["✅","Clearance Forms","PDF"],["📊","Grade Report","XLSX"],["📒","Student Ledger","PDF"],["📈","Analytics","PDF"]]
            .map(([ic,lb,fmt])=>(
              <button key={lb} style={{ padding:sm?"0.7rem 0.8rem":"0.8rem 0.9rem",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.surface,color:T.textSub,fontWeight:600,cursor:"pointer",fontSize:sm?"0.76rem":"0.8rem",fontFamily:"'DM Sans',sans-serif",textAlign:"left",display:"flex",alignItems:"center",gap:"0.6rem",transition:"all .17s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.accent;e.currentTarget.style.background=T.navActive; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textSub;e.currentTarget.style.background=T.surface; }}
              >
                <span style={{ fontSize:"1rem" }}>{ic}</span>
                <div><div>{lb}</div><div style={{ fontSize:"0.63rem",opacity:.6 }}>Export as {fmt}</div></div>
              </button>
            ))}
        </div>
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────  SETTINGS  ── */
const SettingsPage = ({ T, dark, toggleDark, bp }) => {
  const { sm } = bp;
  const [notif, setNotif] = useState(true);
  const [compact,setCompact] = useState(false);
  const [twofa, setTwofa] = useState(false);

  const Toggle = ({ val, onChange }) => (
    <div onClick={()=>onChange(!val)} style={{ width:42,height:24,borderRadius:12,cursor:"pointer",background:val?"linear-gradient(135deg,#5eead4,#3b82f6)":T.dark?"rgba(255,255,255,0.1)":"#d1d5db",position:"relative",transition:"background .3s",flexShrink:0 }}>
      <div style={{ width:18,height:18,borderRadius:"50%",background:"white",position:"absolute",top:3,left:val?21:3,transition:"left .3s",boxShadow:"0 2px 5px rgba(0,0,0,0.25)" }}/>
    </div>
  );
  const fld = { width:"100%",padding:"0.65rem 0.85rem",borderRadius:9,border:`1.5px solid ${T.inputBorder}`,background:T.inputBg,color:T.text,fontSize:"0.84rem",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box" };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:sm?"0.8rem":"1.1rem" }}>
      <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:sm?"1.2rem":"1.45rem",fontWeight:800,color:T.text,margin:0 }}>⚙️ Settings</h2>
      <div style={{ display:"grid",gridTemplateColumns:sm?"1fr":"1fr 1fr",gap:sm?"0.7rem":"0.9rem",alignItems:"start" }}>
        <Card T={T} style={{ padding:sm?"1rem":"1.3rem" }}>
          <Ttl T={T} sm={sm}>👤 Profile</Ttl>
          {[["Full Name","System Administrator"],["Email","admin@neko.edu.ph"],["Role","Registrar"],["Department","College of Computing"]].map(([l,v])=>(
            <div key={l} style={{ marginBottom:"0.85rem" }}>
              <label style={{ display:"block",fontSize:"0.68rem",color:T.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.32rem" }}>{l}</label>
              <input defaultValue={v} style={fld}/>
            </div>
          ))}
          <button style={{ padding:"0.68rem 1.3rem",borderRadius:9,border:"none",background:"linear-gradient(135deg,#5eead4,#3b82f6)",color:"#07061a",fontWeight:700,cursor:"pointer",fontSize:"0.82rem",fontFamily:"'DM Sans',sans-serif" }}>Save Profile</button>
        </Card>
        <div style={{ display:"flex",flexDirection:"column",gap:sm?"0.7rem":"0.9rem" }}>
          <Card T={T} style={{ padding:sm?"1rem":"1.3rem" }}>
            <Ttl T={T} sm={sm}>🎨 Appearance</Ttl>
            {[["Dark Mode",dark,toggleDark],["Notifications",notif,setNotif],["Compact View",compact,setCompact],["Two-Factor Auth",twofa,setTwofa]].map(([l,v,s])=>(
              <div key={l} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.65rem 0",borderBottom:`1px solid ${T.border}` }}>
                <span style={{ color:T.text,fontSize:"0.84rem" }}>{l}</span>
                <Toggle val={v} onChange={s}/>
              </div>
            ))}
          </Card>
          <Card T={T} style={{ padding:sm?"1rem":"1.3rem" }}>
            <Ttl T={T} sm={sm}>🔌 Laravel API</Ttl>
            <div style={{ marginBottom:"0.85rem" }}>
              <label style={{ display:"block",fontSize:"0.68rem",color:T.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.32rem" }}>Base URL</label>
              <input defaultValue="https://api.neko.edu.ph/v1" style={{ ...fld,color:T.accent,fontFamily:"'Courier New',monospace",fontSize:"0.78rem" }}/>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap" }}>
              <span style={{ fontSize:"0.69rem",background:"rgba(52,211,153,0.12)",color:"#34d399",padding:"0.25rem 0.6rem",borderRadius:20,fontWeight:700,display:"flex",alignItems:"center",gap:"0.35rem" }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:"#34d399" }}/> Connected
              </span>
              <span style={{ fontSize:"0.69rem",color:T.textMuted }}>Laravel v11 · Sanctum</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   LOGOUT CONFIRM MODAL
───────────────────────────────────────────── */
const LogoutConfirmModal = ({ onConfirm, onCancel, T }) => (
  <div style={{
    position:"fixed", inset:0, zIndex:200,
    display:"flex", alignItems:"center", justifyContent:"center",
    background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)",
    animation:"fadeUp .18s ease",
  }}
    onClick={onCancel}
  >
    <div style={{
      background: T.dark ? "#1a1744" : "#ffffff",
      border:`1px solid ${T.border}`,
      borderRadius:18, padding:"1.8rem 1.6rem",
      width:"100%", maxWidth:340, margin:"0 1rem",
      boxShadow:"0 24px 64px rgba(0,0,0,0.45)",
      animation:"fadeUp .2s ease",
    }}
      onClick={e=>e.stopPropagation()}
    >
      {/* Icon */}
      <div style={{ width:56,height:56,borderRadius:16,background:"rgba(248,113,113,0.12)",border:"1px solid rgba(248,113,113,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",margin:"0 auto 1.1rem" }}>🚪</div>

      {/* Text */}
      <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:"1.1rem",fontWeight:800,color:T.text,margin:"0 0 0.4rem",textAlign:"center",letterSpacing:"-0.02em" }}>
        Sign out?
      </h3>
      <p style={{ color:T.textSub,fontSize:"0.83rem",textAlign:"center",margin:"0 0 1.5rem",lineHeight:1.55 }}>
        You'll need to sign in again to access your portal.
      </p>

      {/* Buttons */}
      <div style={{ display:"flex",gap:"0.65rem" }}>
        <button onClick={onCancel} style={{
          flex:1, padding:"0.78rem", borderRadius:11,
          border:`1.5px solid ${T.border}`, background:"transparent",
          color:T.textSub, fontWeight:600, fontSize:"0.88rem",
          cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
          transition:"all .15s",
        }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.accent; e.currentTarget.style.color=T.accent; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.textSub; }}
        >Cancel</button>
        <button onClick={onConfirm} style={{
          flex:1, padding:"0.78rem", borderRadius:11,
          border:"none", background:"linear-gradient(135deg,#f87171,#ef4444)",
          color:"white", fontWeight:700, fontSize:"0.88rem",
          cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
          transition:"all .15s",
        }}
          onMouseEnter={e=>{ e.currentTarget.style.filter="brightness(1.1)"; e.currentTarget.style.transform="translateY(-1px)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.filter=""; e.currentTarget.style.transform=""; }}
        >Yes, Sign Out</button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MOBILE AVATAR MENU  (tap avatar → dropdown with logout)
───────────────────────────────────────────── */
const MobileAvatarMenu = ({ onLogout, setActive, T }) => {
  const [open,    setOpen]    = useState(false);
  const [confirm, setConfirm] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("touchstart", handler); };
  }, []);

  return (
    <>
      <div ref={ref} style={{ position:"relative", flexShrink:0 }}>
        <div onClick={()=>setOpen(o=>!o)} style={{
          width:30, height:30, borderRadius:"50%",
          background:"linear-gradient(135deg,#5eead4,#3b82f6)",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#07061a", fontWeight:800, fontSize:"0.75rem", cursor:"pointer",
          outline: open ? "2px solid #5eead4" : "none",
          transition:"outline .15s",
        }}>SA</div>

        {open && (
          <div style={{
            position:"absolute", top:"calc(100% + 8px)", right:0,
            minWidth:180, borderRadius:12,
            background: T.dark ? "#1e1b4b" : "#ffffff",
            border:`1px solid ${T.border}`,
            boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
            zIndex:50, overflow:"hidden",
            animation:"fadeUp .15s ease",
          }}>
            <div style={{ padding:"0.85rem 1rem", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#5eead4,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#07061a",fontWeight:800,fontSize:"0.72rem",flexShrink:0 }}>SA</div>
                <div>
                  <div style={{ color:T.text, fontSize:"0.82rem", fontWeight:700 }}>System Admin</div>
                  <div style={{ color:T.textMuted, fontSize:"0.68rem" }}>Registrar</div>
                </div>
              </div>
            </div>
            <div style={{ padding:"0.4rem" }}>
              <button onClick={()=>{ setOpen(false); setActive("settings"); }} style={{
                width:"100%", display:"flex", alignItems:"center", gap:"0.6rem",
                padding:"0.6rem 0.75rem", borderRadius:8, border:"none",
                background:"transparent", color:T.textSub,
                fontSize:"0.82rem", fontWeight:500, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", textAlign:"left", transition:"background .14s",
              }}
                onMouseEnter={e=>e.currentTarget.style.background=T.surfaceHov}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >⚙️ Settings</button>

              <div style={{ height:1, background:T.border, margin:"0.3rem 0.4rem" }}/>

              <button onClick={()=>{ setOpen(false); setConfirm(true); }} style={{
                width:"100%", display:"flex", alignItems:"center", gap:"0.6rem",
                padding:"0.6rem 0.75rem", borderRadius:8, border:"none",
                background:"rgba(248,113,113,0.08)", color:"#f87171",
                fontSize:"0.82rem", fontWeight:700, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", textAlign:"left", transition:"background .14s",
              }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(248,113,113,0.16)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(248,113,113,0.08)"}
              >🚪 Sign Out</button>
            </div>
          </div>
        )}
      </div>

      {confirm && (
        <LogoutConfirmModal
          T={T}
          onConfirm={onLogout}
          onCancel={()=>setConfirm(false)}
        />
      )}
    </>
  );
};

/* ─────────────────────────────────────────────
   DASHBOARD LAYOUT  — KEY FIXES:
   1. Root div: width:100vw, height:100vh, overflow:hidden
   2. Global CSS resets html/body/root to 100% width & height
   3. Sidebar is sticky; main area is flex:1 with min-width:0
───────────────────────────────────────────── */
const DashboardLayout = ({ onLogout, dark, toggleDark }) => {
  const bp = useBreakpoint();
  const { sm, md } = bp;
  const [active,    setActive]    = useState("dashboard");
  const [collapsed, setCollapsed] = useState(md);
  const T = mkTheme(dark);

  useEffect(()=>{ if (md) setCollapsed(true); else setCollapsed(false); },[md]);

  const pages = {
    dashboard:  <DashboardPage  T={T} bp={bp}/>,
    students:   <StudentsPage   T={T} bp={bp}/>,
    courses:    <CoursesPage    T={T} bp={bp}/>,
    enrollment: <EnrollmentPage T={T} bp={bp}/>,
    reports:    <ReportsPage    T={T} bp={bp}/>,
    settings:   <SettingsPage   T={T} bp={bp} dark={dark} toggleDark={toggleDark}/>,
  };

  return (
    <div style={{
      display:"flex",
      width:"100vw",
      height:"100vh",
      background:T.bg,
      fontFamily:"'DM Sans','Segoe UI',sans-serif",
      color:T.text,
      transition:"background .3s",
      overflow:"hidden",
      position:"fixed",
      top:0, left:0,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        html, body { margin:0; padding:0; width:100%; height:100%; overflow:hidden; }
        #root { width:100%; height:100%; }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${T.scrollThumb}; border-radius:4px; }
      `}</style>

      {/* Sidebar — only on tablet+ */}
      {!sm && (
        <Sidebar active={active} setActive={setActive}
          collapsed={collapsed} setCollapsed={setCollapsed}
          onLogout={onLogout} T={T}/>
      )}

      {/* Right column: header + scrollable main */}
      <div style={{
        flex:1,
        display:"flex",
        flexDirection:"column",
        minWidth:0,
        height:"100vh",
        overflow:"hidden",
      }}>
        {/* Sticky header */}
        <header style={{
          padding:sm?"0.7rem 1rem":"0.85rem 1.5rem",
          display:"flex", alignItems:"center", gap:sm?"0.6rem":"0.9rem",
          borderBottom:`1px solid ${T.border}`,
          background:T.headerBg, backdropFilter:"blur(12px)",
          flexShrink:0, zIndex:9,
          width:"100%",
          position:"relative",
        }}>
          {sm && (
            <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",marginRight:"auto" }}>
              <div style={{ width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#5eead4,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem" }}>🐱</div>
              <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,color:T.text,fontSize:"0.9rem" }}>Neko Univ.</span>
            </div>
          )}
          {!sm && (
            <div style={{ flex:1 }}>
              <span style={{ fontSize:"0.8rem",color:T.textMuted }}>
                {NAV.find(n=>n.id===active)?.icon} {NAV.find(n=>n.id===active)?.label}
              </span>
            </div>
          )}
          {!sm && (
            <div style={{ display:"flex",alignItems:"center",gap:"0.55rem",padding:"0.38rem 0.85rem",borderRadius:9,background:T.surface,border:`1px solid ${T.border}`,fontSize:"0.78rem",color:T.textMuted }}>
              🟢<span>Enrollment Open</span>
            </div>
          )}
          <button onClick={toggleDark} style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"0.42rem 0.65rem",fontSize:"1rem",lineHeight:1,cursor:"pointer",transition:"all .2s" }}
            onMouseEnter={e=>e.currentTarget.style.transform="rotate(20deg) scale(1.1)"}
            onMouseLeave={e=>e.currentTarget.style.transform=""}
          >{dark?"☀️":"🌙"}</button>

          {/* Avatar — desktop: just avatar; mobile: avatar + logout dropdown */}
          {sm ? (
            <MobileAvatarMenu onLogout={onLogout} setActive={setActive} T={T}/>
          ) : (
            <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#5eead4,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#07061a",fontWeight:800,fontSize:"0.75rem",cursor:"pointer",flexShrink:0 }}>SA</div>
          )}
        </header>

        {/* Main scrollable content */}
        <main style={{
          flex:1,
          overflowY:"auto",
          overflowX:"hidden",
          padding: sm ? "1rem" : "1.5rem 1.8rem",
          paddingBottom: sm ? "calc(4.5rem + env(safe-area-inset-bottom, 0px))" : "1.5rem",
          width:"100%",
        }}>
          <div style={{ maxWidth:1240, margin:"0 auto", width:"100%" }}>
            {pages[active]}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      {sm && <BottomNav active={active} setActive={setActive} T={T}/>}
    </div>
  );
};

/* ─────────────────────────────────────────────  ROOT  ── */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [dark,     setDark]     = useState(true);
  return loggedIn
    ? <DashboardLayout onLogout={()=>setLoggedIn(false)} dark={dark} toggleDark={()=>setDark(d=>!d)}/>
    : <LoginPage       onLogin={()=>setLoggedIn(true)}   dark={dark} toggleDark={()=>setDark(d=>!d)}/>;
}