// src/components/Sidebar.jsx
// ─────────────────────────────────────────────
// Collapsible sidebar — same style as existing App.jsx Sidebar
// Includes logout button that triggers confirmation modal
// ─────────────────────────────────────────────

import { useState } from "react";
import LogoutConfirm from "./LogoutConfirm";

const NAV = [
  { id: "dashboard", label: "Dashboard",         icon: "⊞" },
  { id: "programs",  label: "Program Offerings", icon: "🎓" },
  { id: "subjects",  label: "Subject Offerings", icon: "📚" },
];

export default function Sidebar({ active, setActive, collapsed, setCollapsed, onLogout, T, isOpen, onClose }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 19,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            display: "none",
          }}
          className="sidebar-overlay"
        />
      )}

      <aside style={{
        width: collapsed ? 68 : 224,
        height: "100vh",
        flexShrink: 0,
        background: T.sidebarBg,
        display: "flex",
        flexDirection: "column",
        transition: "width .28s cubic-bezier(.4,0,.2,1)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0,
        zIndex: 20,
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: "1.3rem 1rem",
          display: "flex", alignItems: "center", gap: "0.7rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg,#5eead4,#3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem",
            boxShadow: "0 4px 12px rgba(94,234,212,0.3)",
          }}>🎓</div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "#f0f4ff", fontWeight: 700, fontSize: "0.9rem", whiteSpace: "nowrap", fontFamily: "'Syne',sans-serif" }}>
                AMS Portal
              </div>
              <div style={{ color: "#4b5563", fontSize: "0.62rem", whiteSpace: "nowrap" }}>
                IT15 — Frontend
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{
          flex: 1, padding: "0.8rem 0.6rem",
          display: "flex", flexDirection: "column", gap: "0.18rem",
          overflowY: "auto",
        }}>
          {!collapsed && (
            <div style={{
              fontSize: "0.61rem", color: "#374151", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "0 0.6rem", marginBottom: "0.35rem",
            }}>Main Menu</div>
          )}

          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => { setActive(n.id); onClose && onClose(); }}
              title={collapsed ? n.label : ""}
              style={{
                display: "flex", alignItems: "center", gap: "0.7rem",
                padding: "0.7rem 0.82rem", borderRadius: 10,
                border: "none", cursor: "pointer",
                background: active === n.id ? "rgba(94,234,212,0.12)" : "transparent",
                color: active === n.id ? "#5eead4" : "#6b7280",
                fontWeight: active === n.id ? 700 : 500,
                fontSize: "0.86rem", width: "100%", textAlign: "left",
                transition: "all .16s",
                borderLeft: active === n.id ? "3px solid #5eead4" : "3px solid transparent",
                fontFamily: "'DM Sans',sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: "1.05rem", flexShrink: 0 }}>{n.icon}</span>
              {!collapsed && n.label}
              {!collapsed && active === n.id && (
                <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#5eead4", flexShrink: 0 }} />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "0.75rem 0.6rem", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          {!collapsed && (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.65rem",
              padding: "0.55rem 0.82rem", marginBottom: "0.4rem",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg,#5eead4,#3b82f6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#07061a", fontWeight: 800, fontSize: "0.7rem", flexShrink: 0,
              }}>AD</div>
              <div>
                <div style={{ color: "#e2e8f0", fontSize: "0.78rem", fontWeight: 600 }}>Admin User</div>
                <div style={{ color: "#4b5563", fontSize: "0.64rem" }}>Registrar</div>
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: "flex", alignItems: "center", gap: "0.65rem",
              padding: "0.5rem 0.82rem", borderRadius: 8,
              border: "none", cursor: "pointer",
              background: "transparent", color: "#4b5563",
              fontSize: "0.8rem", width: "100%",
              fontFamily: "'DM Sans',sans-serif",
              transition: "color .15s",
            }}
          >
            <span>{collapsed ? "⇥" : "⇤"}</span>
            {!collapsed && "Collapse"}
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            style={{
              display: "flex", alignItems: "center", gap: "0.65rem",
              padding: "0.5rem 0.82rem", borderRadius: 8,
              border: "none", cursor: "pointer",
              background: "rgba(248,113,113,0.08)", color: "#f87171",
              fontSize: "0.8rem", width: "100%", marginTop: "0.25rem",
              fontFamily: "'DM Sans',sans-serif",
              transition: "background .15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
          >
            🚪{!collapsed && " Sign Out"}
          </button>
        </div>
      </aside>

      {/* Logout confirm */}
      {showConfirm && (
        <LogoutConfirm
          T={T}
          onConfirm={onLogout}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}