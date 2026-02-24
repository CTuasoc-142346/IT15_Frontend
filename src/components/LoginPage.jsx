// src/pages/LoginPage.jsx
// ─────────────────────────────────────────────
// Login page — matches existing App.jsx aesthetic exactly:
//   - Same NekoMascot SVG cat
//   - Same dark indigo gradient + teal accents
//   - Same DM Sans + Syne fonts
//   - Interactive: cat covers eyes on password, watches on email
//   - Credential: any username + any password → login
// ─────────────────────────────────────────────

import { useState, useCallback } from "react";

/* ── Neko Mascot (copied from existing App.jsx) ────────────── */
const NekoMascot = ({ state, dark }) => {
  const peek  = state === "pw";
  const watch = state === "email";
  const pawY  = peek ? -28 : 0;
  return (
    <div style={{ width: 130, height: 128, margin: "0 auto 0.9rem" }}>
      <style>{`
        @keyframes nekoBob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes nekoZzz   { 0%{opacity:0;transform:translate(0,0) scale(.7)} 20%{opacity:1} 80%{opacity:1} 100%{opacity:0;transform:translate(12px,-20px) scale(1.2)} }
        @keyframes nekoBlink { 0%,92%,100%{transform:scaleY(1)} 96%{transform:scaleY(.08)} }
        .nk-float  { animation: nekoBob   3.2s ease-in-out infinite; }
        .nk-zzz    { animation: nekoZzz   2.6s ease-in-out infinite; }
        .nk-blink  { animation: nekoBlink 4.5s ease-in-out infinite; transform-origin:50% 46px; }
        .nk-pupil  { transition: cx .18s ease, cy .18s ease; }
        .nk-paws   { transition: transform .42s cubic-bezier(.34,1.56,.64,1); will-change:transform; }
      `}</style>
      <svg viewBox="0 0 100 105" width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="nkHead2" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#3730a3"/>
            <stop offset="100%" stopColor="#0f0c29"/>
          </radialGradient>
          <radialGradient id="nkEar2" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#1e1b4b"/>
            <stop offset="100%" stopColor="#07061a"/>
          </radialGradient>
          <radialGradient id="nkBody2" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#312e81"/>
            <stop offset="100%" stopColor="#0f0c29"/>
          </radialGradient>
          <filter id="nkGlow2"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="nkShad2"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity=".35"/></filter>
        </defs>
        <ellipse cx="50" cy="100" rx="24" ry="4" fill="rgba(0,0,0,0.2)"/>
        <g className="nk-float" filter="url(#nkShad2)">
          <path d="M24 82 Q10 80 11 65 Q12 54 20 57" stroke="#4c1d95" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <ellipse cx="50" cy="80" rx="21" ry="16" fill="url(#nkBody2)"/>
          <path d="M29 32 L14 9  L43 24 Z" fill="url(#nkEar2)"/>
          <path d="M30 30 L18 13 L41 25 Z" fill="#7c3aed" opacity=".55"/>
          <path d="M71 32 L86 9  L57 24 Z" fill="url(#nkEar2)"/>
          <path d="M70 30 L82 13 L59 25 Z" fill="#7c3aed" opacity=".55"/>
          <circle cx="50" cy="48" r="29" fill="url(#nkHead2)"/>
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
              <circle className="nk-pupil" cx={watch ? 41 : 40} cy={watch ? 49 : 48} r="3" fill="#5eead4"/>
              <circle className="nk-pupil" cx={watch ? 61 : 60} cy={watch ? 49 : 48} r="3" fill="#5eead4"/>
              <circle cx="37.5" cy="45" r="1.5" fill="white" opacity=".85"/>
              <circle cx="57.5" cy="45" r="1.5" fill="white" opacity=".85"/>
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
          <g className="nk-paws" style={{ transform: `translateY(${pawY}px)` }}>
            <ellipse cx="34" cy="87" rx="11" ry="8" fill="url(#nkEar2)"/>
            <ellipse cx="29" cy="84" rx="2.2" ry="1.6" fill="#f472b6" opacity=".45"/>
            <ellipse cx="34" cy="82" rx="2.2" ry="1.6" fill="#f472b6" opacity=".45"/>
            <ellipse cx="39" cy="84" rx="2.2" ry="1.6" fill="#f472b6" opacity=".45"/>
            <ellipse cx="66" cy="87" rx="11" ry="8" fill="url(#nkEar2)"/>
            <ellipse cx="61" cy="84" rx="2.2" ry="1.6" fill="#f472b6" opacity=".45"/>
            <ellipse cx="66" cy="82" rx="2.2" ry="1.6" fill="#f472b6" opacity=".45"/>
            <ellipse cx="71" cy="84" rx="2.2" ry="1.6" fill="#f472b6" opacity=".45"/>
          </g>
        </g>
        {dark && state === "idle" && (
          <g className="nk-zzz" filter="url(#nkGlow2)">
            <text x="76" y="26" fontSize="14" fill="#a78bfa" fontWeight="800" fontFamily="Georgia,serif">Z</text>
            <text x="87" y="16" fontSize="10" fill="#7c3aed" fontWeight="800" fontFamily="Georgia,serif">z</text>
            <text x="94" y="9"  fontSize="7"  fill="#4c1d95" fontWeight="800" fontFamily="Georgia,serif">z</text>
          </g>
        )}
      </svg>
    </div>
  );
};

/* ── Login Page ────────────────────────────────────────────── */
export default function LoginPage({ onLogin, dark, toggleDark }) {
  const [catState, setCat]  = useState("idle");
  const [email,    setEmail] = useState("");
  const [pw,       setPw]    = useState("");
  const [err,      setErr]   = useState("");
  const [busy,     setBusy]  = useState(false);

  const doLogin = useCallback(() => {
    if (!email.trim()) { setErr("Please enter your username."); return; }
    if (!pw.trim())    { setErr("Please enter your password."); return; }
    setErr(""); setBusy(true);
    setTimeout(() => { setBusy(false); onLogin({ name: "Admin User", role: "Registrar" }); }, 900);
  }, [email, pw, onLogin]);

  const onKey = useCallback((e) => { if (e.key === "Enter") doLogin(); }, [doLogin]);

  const inp = {
    width: "100%", padding: "0.88rem 1rem", borderRadius: 12,
    border: "1.5px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#f0f4ff", fontSize: "0.94rem",
    fontFamily: "'DM Sans',sans-serif", outline: "none",
    boxSizing: "border-box", transition: "border-color .2s, box-shadow .2s",
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100vw",
      display: "flex",
      fontFamily: "'DM Sans',sans-serif",
      background: dark
        ? "radial-gradient(ellipse at 20% 50%,#1e1b4b,#07061a)"
        : "radial-gradient(ellipse at 20% 50%,#dde8ff,#f4f6fb)",
      transition: "background .4s",
      position: "relative", overflowX: "hidden", boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        html,body,#root { margin:0; padding:0; width:100%; min-height:100vh; box-sizing:border-box; }
        * { box-sizing:border-box; }
        @keyframes gridPulse { 0%,100%{opacity:.03} 50%{opacity:.07} }
        @keyframes floatOrb  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes fadeInUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn   { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        .l-inp:focus { border-color:#5eead4 !important; box-shadow:0 0 0 3px rgba(94,234,212,.15) !important; }
        .l-btn { transition:all .2s; cursor:pointer; border:none; }
        .l-btn:hover  { filter:brightness(1.08); transform:translateY(-1px); }
        .l-btn:active { transform:scale(.97); }
        .sso-btn { transition:all .18s; cursor:pointer; }
        .sso-btn:hover { border-color:rgba(94,234,212,.5) !important; transform:translateY(-1px); }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.12); border-radius:4px; }
      `}</style>

      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)`,
        backgroundSize: "48px 48px",
        animation: "gridPulse 6s ease-in-out infinite",
      }}/>

      {/* Orbs */}
      {dark && [
        ["-8%","28%","#312e81","380px",7],
        ["63%","-5%","#1e1b4b","280px",9],
        ["78%","53%","#4c1d95","200px",5],
      ].map(([l,t,c,s,d],i)=>(
        <div key={i} style={{
          position:"fixed",left:l,top:t,width:s,height:s,borderRadius:"50%",
          background:`radial-gradient(circle,${c},transparent 70%)`,
          opacity:.5,pointerEvents:"none",zIndex:0,
          animation:`floatOrb ${d}s ease-in-out infinite`,animationDelay:`${i*1.8}s`,
        }}/>
      ))}

      {/* Dark mode toggle */}
      <button
        onClick={toggleDark}
        style={{
          position:"fixed", top:"1rem", right:"1rem", zIndex:10,
          background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:11, padding:"0.45rem 0.65rem",
          fontSize:"1.05rem", lineHeight:1, cursor:"pointer", transition:"all .2s",
        }}
        onMouseEnter={(e)=>e.currentTarget.style.transform="rotate(20deg) scale(1.15)"}
        onMouseLeave={(e)=>e.currentTarget.style.transform=""}
      >{dark ? "☀️" : "🌙"}</button>

      {/* ── Split layout ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr)",
        width: "100%",
        minHeight: "100vh",
        position: "relative", zIndex: 1,
        // On wide screens: side by side
        "@media (min-width:640px)": { gridTemplateColumns: "1fr 1fr" },
      }}>

        {/* Left Branding Panel — hidden on mobile */}
        <div style={{
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          padding: "3rem 2.5rem",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          background: dark ? "rgba(13,11,40,0.65)" : "rgba(255,255,255,0.55)",
          backdropFilter: "blur(10px)",
          animation: "fadeInUp .6s ease",
          // Hide on mobile via media query applied by wrapper
        }} className="login-left-panel">
          <NekoMascot state={catState} dark={dark}/>
          <h1 style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: "2rem", fontWeight: 800, color: dark ? "#f0f4ff" : "#0f172a",
            margin: "0 0 0.25rem", textAlign: "center",
            letterSpacing: "-0.04em", lineHeight: 1.15,
          }}>Academic<br/>Management</h1>
          <p style={{
            color: dark ? "#94a3b8" : "#4b5563",
            fontSize: "0.72rem", letterSpacing: "0.12em",
            textTransform: "uppercase", fontWeight: 600, textAlign: "center",
            margin: "0 0 2rem",
          }}>IT15 Portal · Frontend</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", width: "100%", maxWidth: 260 }}>
            {[
              ["🎓","Program Offerings"],
              ["📚","Subject Offerings"],
              ["📊","Dashboard Analytics"],
              ["🔒","Secure Login Portal"],
            ].map(([ic,lb])=>(
              <div key={lb} style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
                <div style={{ width:32,height:32,borderRadius:9,background:"rgba(94,234,212,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.92rem",flexShrink:0 }}>{ic}</div>
                <span style={{ color: dark?"#94a3b8":"#4b5563", fontSize:"0.81rem" }}>{lb}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          padding: "2.5rem 2rem",
          minHeight: "100vh",
          animation: "fadeInUp .55s ease",
        }}>
          <div style={{ width: "100%", maxWidth: 390 }}>

            {/* Mobile-only logo */}
            <div className="login-mobile-logo" style={{ textAlign:"center", marginBottom:"1.5rem" }}>
              <div style={{ width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#5eead4,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",margin:"0 auto 0.7rem",boxShadow:"0 8px 24px rgba(94,234,212,0.3)" }}>🎓</div>
              <div style={{ fontFamily:"'Syne',sans-serif",fontSize:"1.1rem",fontWeight:800,color:dark?"#f0f4ff":"#0f172a" }}>AMS Portal</div>
            </div>

            <h2 style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: "1.7rem", fontWeight: 800,
              color: dark ? "#f0f4ff" : "#0f172a",
              margin: "0 0 0.3rem", letterSpacing: "-0.03em",
            }}>Welcome back 👋</h2>
            <p style={{ color: dark?"#94a3b8":"#4b5563", fontSize: "0.86rem", margin: "0 0 1.8rem" }}>
              Sign in to access the academic portal
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Email */}
              <div>
                <label style={{ display:"block",fontSize:"0.72rem",fontWeight:700,color:dark?"#94a3b8":"#4b5563",marginBottom:"0.4rem",textTransform:"uppercase",letterSpacing:"0.06em" }}>
                  Username
                </label>
                <input
                  type="text" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => { setCat("email"); setErr(""); }}
                  onBlur={() => setCat("idle")}
                  onKeyDown={onKey}
                  placeholder="Enter your username"
                  className="l-inp" style={{
                    ...inp,
                    color: dark ? "#f0f4ff" : "#0f172a",
                    background: dark ? "rgba(255,255,255,0.06)" : "#fff",
                    border: `1.5px solid ${dark?"rgba(255,255,255,0.12)":"#d1d5db"}`,
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.4rem" }}>
                  <label style={{ fontSize:"0.72rem",fontWeight:700,color:dark?"#94a3b8":"#4b5563",textTransform:"uppercase",letterSpacing:"0.06em" }}>Password</label>
                  <span style={{ fontSize:"0.77rem",color:"#5eead4",cursor:"pointer",fontWeight:600 }}>Forgot?</span>
                </div>
                <input
                  type="password" value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  onFocus={() => { setCat("pw"); setErr(""); }}
                  onBlur={() => setCat("idle")}
                  onKeyDown={onKey}
                  placeholder="••••••••"
                  className="l-inp" style={{
                    ...inp,
                    color: dark ? "#f0f4ff" : "#0f172a",
                    background: dark ? "rgba(255,255,255,0.06)" : "#fff",
                    border: `1.5px solid ${dark?"rgba(255,255,255,0.12)":"#d1d5db"}`,
                  }}
                />
              </div>

              {/* Error */}
              {err && (
                <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.65rem 0.9rem",borderRadius:10,background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)" }}>
                  <span>⚠️</span>
                  <span style={{ color:"#fca5a5",fontSize:"0.82rem",fontWeight:500 }}>{err}</span>
                </div>
              )}

              {/* Login Button */}
              <button className="l-btn" onClick={doLogin} disabled={busy} style={{
                width:"100%", padding:"0.92rem", borderRadius:12,
                background:"linear-gradient(135deg,#5eead4,#3b82f6)",
                color:"#07061a", fontWeight:700, fontSize:"0.95rem",
                fontFamily:"'DM Sans',sans-serif", marginTop:"0.2rem",
                opacity: busy ? 0.7 : 1,
              }}>{busy ? "Signing in…" : "Sign In →"}</button>

              {/* Divider */}
              <div style={{ display:"flex",alignItems:"center",gap:"0.7rem" }}>
                <div style={{ flex:1,height:1,background:dark?"rgba(255,255,255,0.08)":"#e2e8f0" }}/>
                <span style={{ color:dark?"#4b5563":"#9ca3af",fontSize:"0.73rem",fontWeight:500 }}>or continue with</span>
                <div style={{ flex:1,height:1,background:dark?"rgba(255,255,255,0.08)":"#e2e8f0" }}/>
              </div>

              {/* SSO Buttons */}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem" }}>
                {[["🏫","School SSO"],["🪪","ID Login"]].map(([ic,lb])=>(
                  <button key={lb} className="sso-btn" style={{
                    padding:"0.72rem", borderRadius:10,
                    border:`1.5px solid ${dark?"rgba(255,255,255,0.08)":"#e2e8f0"}`,
                    background:dark?"rgba(255,255,255,0.04)":"#ffffff",
                    color:dark?"#94a3b8":"#4b5563",
                    fontSize:"0.82rem", fontWeight:600,
                    fontFamily:"'DM Sans',sans-serif",
                    display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",
                  }}>{ic} {lb}</button>
                ))}
              </div>

              <p style={{ textAlign:"center",fontSize:"0.74rem",color:dark?"#4b5563":"#9ca3af",margin:0 }}>
                Demo: any username + any password → Sign In
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive: hide left panel on narrow screens */}
      <style>{`
        @media (max-width:768px) {
          .login-left-panel { display:none !important; }
          .login-mobile-logo { display:block !important; }
        }
        @media (min-width:769px) {
          .login-left-panel { display:flex !important; }
          .login-mobile-logo { display:none !important; }
          div[style*="grid-template-columns"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}