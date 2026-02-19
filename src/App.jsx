import React, { useState } from "react";

const NekoMascot = ({ state, darkMode }) => {
  const isPeeking = state === "typingPassword";
  const isWatching = state === "typingEmail";

  const catColor = darkMode ? "#334155" : "#1e293b";
  const earColor = darkMode ? "#475569" : "#334155";
  const strokeColor = darkMode ? "rgba(255,255,255,0.2)" : "none";

  return (
    <div className="cat-container">
      <svg viewBox="0 0 100 100" className="neko-svg" style={{ overflow: 'visible' }}>
        {/* ZZZ Animation - Restored and Improved */}
        {darkMode && state === "idle" && (
          <g className="zzz-animation">
            <text x="80" y="20" fontSize="12" fill="#94a3b8" fontWeight="bold">Z</text>
            <text x="90" y="10" fontSize="8" fill="#64748b" fontWeight="bold">z</text>
          </g>
        )}
        
        <path d="M20 75 Q10 75 10 60" stroke={earColor} strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="75" r="22" fill={catColor} stroke={strokeColor} strokeWidth="1.5" />
        
        {/* Ears */}
        <path d="M30 25 L15 5 L45 20 Z" fill={earColor} stroke={strokeColor} strokeWidth="1.5" />
        <path d="M70 25 L85 5 L55 20 Z" fill={earColor} stroke={strokeColor} strokeWidth="1.5" />
        
        {/* Head */}
        <circle cx="50" cy="45" r="28" fill={catColor} stroke={strokeColor} strokeWidth="1.5" />
        
        {/* Eyes / Sleeping Eyes */}
        {darkMode && state === "idle" ? (
          <g>
            <path d="M35 45 Q40 50 45 45" stroke="#94a3b8" fill="none" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M55 45 Q60 50 65 45" stroke="#94a3b8" fill="none" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <circle cx="40" cy="45" r="7" fill="white" />
            <circle cx="60" cy="45" r="7" fill="white" />
            <circle cx={isWatching ? "42" : "40"} cy={isWatching ? "46" : "45"} r="4" fill="#0f172a" className="transition-pupil" />
            <circle cx={isWatching ? "62" : "60"} cy={isWatching ? "46" : "45"} r="4" fill="#0f172a" className="transition-pupil" />
          </g>
        )}
        
        <path d="M48 52 L52 52 L50 55 Z" fill="#fca5a5" />
        
        <g className="paws" style={{ transform: isPeeking ? "translateY(-25px)" : "translateY(0)" }}>
          <circle cx="35" cy="78" r="8" fill={earColor} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="65" cy="78" r="8" fill={earColor} stroke={strokeColor} strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [catState, setCatState] = useState("idle");

  return (
    <div className={`app-root ${darkMode ? "dark" : "light"}`}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif; }

        .app-root {
          position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: ${darkMode ? "#0f172a" : "#f1f5f9"};
          transition: background 0.4s ease; padding: 20px;
        }

        .login-card {
          width: 100%; max-width: 380px;
          background: ${darkMode ? "#1e293b" : "#ffffff"};
          padding: 2.5rem 2rem; border-radius: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
          display: flex; flex-direction: column; align-items: center;
          position: relative; transition: background 0.4s ease;
        }

        .cat-container { width: 120px; height: 110px; margin-bottom: 1.5rem; position: relative; }
        .neko-svg { width: 100%; height: 100%; }

        /* THE ZZZ ANIMATION */
        .zzz-animation { 
          animation: floatZ 3s infinite ease-in-out; 
          transform-origin: center;
        }

        @keyframes floatZ {
          0% { opacity: 0; transform: translate(0, 0) scale(0.8); }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translate(15px, -25px) scale(1.2); }
        }

        h1 { font-size: 1.6rem; font-weight: 800; margin-bottom: 0.5rem; color: ${darkMode ? "#f8fafc" : "#0f172a"}; }
        p { font-size: 0.95rem; opacity: 0.6; margin-bottom: 2rem; color: ${darkMode ? "#cbd5e1" : "#475569"}; }

        form { width: 100%; display: flex; flex-direction: column; gap: 1rem; }

        input {
          width: 100%; padding: 0.9rem 1.1rem; border-radius: 0.8rem;
          border: 2px solid ${darkMode ? "#334155" : "#e2e8f0"};
          background: ${darkMode ? "#0f172a" : "#fff"};
          color: ${darkMode ? "#fff" : "#1e293b"};
          font-size: 1rem; outline: none; transition: all 0.2s;
        }
        input:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }

        .btn-login {
          width: 100%; padding: 0.9rem; border-radius: 0.8rem; border: none;
          background: #6366f1; color: white; font-weight: 700; font-size: 1rem;
          cursor: pointer; margin-top: 0.5rem; transition: transform 0.2s;
        }
        .btn-login:hover { filter: brightness(1.1); }
        .btn-login:active { transform: scale(0.98); }

        .theme-toggle {
          position: absolute; top: 1.25rem; right: 1.25rem;
          cursor: pointer; font-size: 1.3rem; z-index: 5;
          padding: 5px; border-radius: 50%; transition: background 0.2s;
        }

        .paws { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .transition-pupil { transition: all 0.2s ease; }

        @media (max-width: 400px) {
          .login-card { padding: 2rem 1.5rem; }
          h1 { font-size: 1.4rem; }
        }
      `}</style>

      <div className="login-card">
        <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </div>

        <NekoMascot state={catState} darkMode={darkMode} />

        <h1>Neko University</h1>
        <p>Your journey begins here.</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email Address"
            onFocus={() => setCatState("typingEmail")}
            onBlur={() => setCatState("idle")}
          />
          <input
            type="password"
            placeholder="Password"
            onFocus={() => setCatState("typingPassword")}
            onBlur={() => setCatState("idle")}
          />
          <button type="submit" className="btn-login">Sign In</button>
        </form>
      </div>
    </div>
  );
}