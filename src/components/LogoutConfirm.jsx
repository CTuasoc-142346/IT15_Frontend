// src/components/LogoutConfirm.jsx
// ─────────────────────────────────────────────
// Logout confirmation dialog — same style as existing App.jsx modal
// ─────────────────────────────────────────────

export default function LogoutConfirm({ T, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        animation: "fadeInUp .18s ease",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.dark ? "#1a1744" : "#ffffff",
          border: `1px solid ${T.border}`,
          borderRadius: 18,
          padding: "2rem 1.8rem",
          width: "100%", maxWidth: 340,
          margin: "0 1rem",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          animation: "scaleIn .22s ease",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 60, height: 60, borderRadius: 16,
          background: "rgba(248,113,113,0.12)",
          border: "1px solid rgba(248,113,113,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.7rem", margin: "0 auto 1.2rem",
        }}>🚪</div>

        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "1.15rem", fontWeight: 800,
          color: T.text, margin: "0 0 0.45rem",
          letterSpacing: "-0.02em",
        }}>Sign out?</h3>

        <p style={{
          color: T.textSub, fontSize: "0.84rem",
          margin: "0 0 1.6rem", lineHeight: 1.6,
        }}>
          You'll be returned to the login screen.<br />Any unsaved changes will be lost.
        </p>

        <div style={{ display: "flex", gap: "0.7rem" }}>
          {/* Cancel */}
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "0.8rem", borderRadius: 11,
              border: `1.5px solid ${T.border}`,
              background: "transparent", color: T.textSub,
              fontWeight: 600, fontSize: "0.88rem",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5eead4"; e.currentTarget.style.color = "#5eead4"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; }}
          >Cancel</button>

          {/* Confirm */}
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "0.8rem", borderRadius: 11,
              border: "none",
              background: "linear-gradient(135deg,#f87171,#ef4444)",
              color: "white", fontWeight: 700, fontSize: "0.88rem",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
          >Yes, Sign Out</button>
        </div>
      </div>
    </div>
  );
}