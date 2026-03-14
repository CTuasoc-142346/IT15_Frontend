// src/components/PostsPage.jsx
// ─────────────────────────────────────────────
// Posts feed — fetched from /api/posts
//   - Category sidebar filter (all + per-category with counts)
//   - Post cards: title, body, author full name, date posted, category badge
//   - Search bar
//   - Loading skeletons + error handling
//   - Responsive: sidebar on desktop, horizontal chips on mobile
// ─────────────────────────────────────────────

import { useState, useMemo } from "react";
import { Card, SectionTitle } from "./UI";
import { useFetch } from "../hooks/useFetch";

// ── Category colour map ───────────────────────────────────────
const CAT_COLORS = {
  "General":          { color: "#94a3b8", bg: "rgba(148,163,184,0.12)", icon: "💬" },
  "Announcements":    { color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  icon: "📢" },
  "Questions / Help": { color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  icon: "❓" },
  "Discussion":       { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", icon: "🗣️" },
  "News & Updates":   { color: "#34d399", bg: "rgba(52,211,153,0.12)",  icon: "📰" },
  "Events":           { color: "#f472b6", bg: "rgba(244,114,182,0.12)", icon: "🎉" },
};

const catStyle = (name) =>
  CAT_COLORS[name] ?? { color: "#5eead4", bg: "rgba(94,234,212,0.12)", icon: "📌" };

// ── Relative / formatted date ─────────────────────────────────
function timeAgo(dateStr) {
  const date  = new Date(dateStr);
  const now   = new Date();
  const diff  = Math.floor((now - date) / 1000); // seconds

  if (diff < 60)           return "just now";
  if (diff < 3600)         return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)        return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7)    return `${Math.floor(diff / 86400)}d ago`;

  return date.toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function fullDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Shimmer skeleton ──────────────────────────────────────────
const Shimmer = ({ T, height = 16, width = "100%", r = 6, style = {} }) => (
  <div style={{
    height, width, borderRadius: r,
    background: T.dark
      ? "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)"
      : "linear-gradient(90deg,#f0f4ff 25%,#e2e8f0 50%,#f0f4ff 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease-in-out infinite",
    flexShrink: 0,
    ...style,
  }} />
);

const PostCardSkeleton = ({ T }) => (
  <Card T={T} style={{ padding: "1.25rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Shimmer T={T} height={12} width="30%" r={20} />
      <Shimmer T={T} height={11} width="18%" r={20} />
    </div>
    <Shimmer T={T} height={18} width="75%" />
    <Shimmer T={T} height={12} width="100%" />
    <Shimmer T={T} height={12} width="85%" />
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.25rem" }}>
      <Shimmer T={T} height={24} width={24} r="50%" />
      <Shimmer T={T} height={11} width="25%" />
    </div>
  </Card>
);

// ── Category badge ────────────────────────────────────────────
const CatBadge = ({ name, sm }) => {
  const s = catStyle(name);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.28rem",
      fontSize: sm ? "0.64rem" : "0.68rem", fontWeight: 700,
      padding: "0.2rem 0.6rem", borderRadius: 20,
      background: s.bg, color: s.color, whiteSpace: "nowrap",
    }}>
      {s.icon} {name}
    </span>
  );
};

// ── Single post card ──────────────────────────────────────────
function PostCard({ T, post, sm }) {
  const [expanded, setExpanded] = useState(false);
  const catName = post.category?.category_name ?? "General";
  const s       = catStyle(catName);
  const initials = post.author_name
    ? post.author_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const isLong = post.text?.length > 220;
  const displayText = isLong && !expanded
    ? post.text.slice(0, 220) + "…"
    : post.text;

  return (
    <Card T={T} style={{
      padding: sm ? "1rem 1.1rem" : "1.25rem 1.4rem",
      display: "flex", flexDirection: "column", gap: "0.7rem",
      animation: "fadeInUp .4s ease both",
      borderLeft: `3px solid ${s.color}`,
    }}>
      {/* ── Top row: category + date ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
        <CatBadge name={catName} sm={sm} />
        <span
          title={fullDate(post.created_at)}
          style={{ color: T.textMuted, fontSize: "0.68rem", whiteSpace: "nowrap", cursor: "default" }}
        >
          🕐 {timeAgo(post.created_at)}
        </span>
      </div>

      {/* ── Title ── */}
      <h3 style={{
        fontFamily: "'Syne',sans-serif",
        fontSize: sm ? "0.95rem" : "1.05rem",
        fontWeight: 800, color: T.text,
        margin: 0, letterSpacing: "-0.02em", lineHeight: 1.3,
      }}>
        {post.title}
      </h3>

      {/* ── Body ── */}
      <p style={{
        color: T.textSub, fontSize: sm ? "0.8rem" : "0.84rem",
        lineHeight: 1.65, margin: 0,
      }}>
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded((e) => !e)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#5eead4", fontWeight: 700, fontSize: "0.8rem",
              padding: "0 0.25rem", fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {expanded ? " Show less" : " Read more"}
          </button>
        )}
      </p>

      {/* ── Author row ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.6rem",
        paddingTop: "0.45rem",
        borderTop: `1px solid ${T.border}`,
      }}>
        {/* Avatar */}
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${s.color}, #3b82f6)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#07061a", fontWeight: 800, fontSize: "0.65rem",
        }}>
          {initials}
        </div>
        <div>
          <div style={{ color: T.text, fontWeight: 600, fontSize: "0.78rem" }}>
            {post.author_name}
          </div>
          <div style={{ color: T.textMuted, fontSize: "0.65rem" }}>
            {fullDate(post.created_at)}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Category sidebar / chip list ──────────────────────────────
function CategoryFilter({ T, sm, categories, selected, onSelect, catLoading }) {
  if (sm) {
    // Mobile: horizontal scrollable chips
    return (
      <div style={{
        display: "flex", gap: "0.45rem",
        overflowX: "auto", paddingBottom: "0.25rem",
        scrollbarWidth: "none",
      }}>
        <style>{`.chip-scroll::-webkit-scrollbar{display:none}`}</style>
        {[{ id: null, category_name: "All", posts_count: null }, ...categories].map((cat) => {
          const active = selected === cat.id;
          const s      = catStyle(cat.category_name);
          return (
            <button key={cat.id ?? "all"} onClick={() => onSelect(cat.id)} style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              padding: "0.38rem 0.8rem", borderRadius: 20, flexShrink: 0,
              border: `1.5px solid ${active ? s.color : T.border}`,
              background: active ? s.bg : "transparent",
              color: active ? s.color : T.textSub,
              fontSize: "0.74rem", fontWeight: active ? 700 : 500,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              transition: "all .15s",
            }}>
              {s.icon} {cat.category_name}
              {cat.posts_count != null && (
                <span style={{ fontSize: "0.65rem", opacity: 0.7 }}>({cat.posts_count})</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Desktop: vertical sidebar list
  return (
    <div style={{
      width: 210, flexShrink: 0,
      display: "flex", flexDirection: "column", gap: "0.2rem",
    }}>
      <div style={{
        fontSize: "0.62rem", color: T.textMuted, fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase",
        padding: "0 0.6rem", marginBottom: "0.4rem",
      }}>
        Categories
      </div>

      {catLoading
        ? [1,2,3,4,5,6].map(i => (
            <div key={i} style={{ padding: "0.6rem 0.8rem" }}>
              <Shimmer T={T} height={13} width="80%" />
            </div>
          ))
        : [{ id: null, category_name: "All Posts", posts_count: null }, ...categories].map((cat) => {
            const active = selected === cat.id;
            const s      = catStyle(cat.category_name);
            return (
              <button key={cat.id ?? "all"} onClick={() => onSelect(cat.id)} style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                padding: "0.62rem 0.8rem", borderRadius: 10,
                border: "none", cursor: "pointer", width: "100%", textAlign: "left",
                background: active ? s.bg : "transparent",
                color: active ? s.color : T.textSub,
                fontWeight: active ? 700 : 500,
                fontSize: "0.84rem", fontFamily: "'DM Sans',sans-serif",
                transition: "all .15s",
                borderLeft: active ? `3px solid ${s.color}` : "3px solid transparent",
              }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.surfaceHov; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>{s.icon}</span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {cat.category_name}
                </span>
                {cat.posts_count != null && (
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 700,
                    padding: "0.1rem 0.45rem", borderRadius: 20,
                    background: active ? `${s.color}30` : T.border,
                    color: active ? s.color : T.textMuted,
                    flexShrink: 0,
                  }}>
                    {cat.posts_count}
                  </span>
                )}
              </button>
            );
          })
      }
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function PostsPage({ T, bp }) {
  const { sm, md } = bp;
  const [selectedCat, setSelectedCat] = useState(null);
  const [search,      setSearch]      = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Fetch categories
  const { data: catData, loading: catLoading } = useFetch("/categories");
  const categories = catData ?? [];

  // Fetch posts — re-fetch when category or search changes
  const params = useMemo(() => {
    const p = { per_page: 20 };
    if (selectedCat) p.category_id = selectedCat;
    if (search)      p.search      = search;
    return p;
  }, [selectedCat, search]);

  const { data: postsData, loading: postsLoading, error: postsError, refetch } = useFetch("/posts", { params });
  const posts = postsData?.data ?? [];

  const handleSearch = () => setSearch(searchInput.trim());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: sm ? "1rem" : "1.2rem" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Header ── */}
      <div style={{ animation: "fadeInUp .4s ease" }}>
        <h2 style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: sm ? "1.3rem" : "1.6rem",
          fontWeight: 800, color: T.text,
          margin: "0 0 0.2rem", letterSpacing: "-0.03em",
        }}>
          Posts 📝
        </h2>
        <p style={{ color: T.textMuted, fontSize: "0.8rem", margin: 0 }}>
          Announcements, questions, discussions and updates
        </p>
      </div>

      {/* ── Search bar ── */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search posts…"
          style={{
            flex: 1, padding: "0.68rem 1rem", borderRadius: 10,
            border: `1.5px solid ${T.inputBorder}`,
            background: T.inputBg, color: T.text,
            fontSize: "0.85rem", fontFamily: "'DM Sans',sans-serif",
            outline: "none", transition: "border-color .2s",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#5eead4"; }}
          onBlur={(e)  => { e.target.style.borderColor = T.inputBorder; }}
        />
        <button onClick={handleSearch} style={{
          padding: "0.68rem 1.1rem", borderRadius: 10,
          background: "linear-gradient(135deg,#5eead4,#3b82f6)",
          border: "none", color: "#07061a", fontWeight: 700,
          fontSize: "0.85rem", cursor: "pointer",
          fontFamily: "'DM Sans',sans-serif",
        }}>
          🔍
        </button>
        {search && (
          <button onClick={() => { setSearch(""); setSearchInput(""); }} style={{
            padding: "0.68rem 0.9rem", borderRadius: 10,
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.textSub, fontSize: "0.82rem", cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
          }}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* ── Mobile category chips ── */}
      {sm && (
        <CategoryFilter
          T={T} sm={sm}
          categories={categories}
          selected={selectedCat}
          onSelect={setSelectedCat}
          catLoading={catLoading}
        />
      )}

      {/* ── Main layout: sidebar + posts ── */}
      <div style={{
        display: "flex",
        gap: sm ? 0 : "1.2rem",
        alignItems: "flex-start",
      }}>
        {/* Desktop category sidebar */}
        {!sm && (
          <CategoryFilter
            T={T} sm={sm}
            categories={categories}
            selected={selectedCat}
            onSelect={setSelectedCat}
            catLoading={catLoading}
          />
        )}

        {/* Posts grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Active filter label */}
          {selectedCat && (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              marginBottom: "0.75rem",
            }}>
              <span style={{ color: T.textMuted, fontSize: "0.78rem" }}>
                Showing:
              </span>
              <CatBadge
                name={categories.find((c) => c.id === selectedCat)?.category_name ?? ""}
                sm={sm}
              />
              <button onClick={() => setSelectedCat(null)} style={{
                background: "none", border: "none", color: T.textMuted,
                cursor: "pointer", fontSize: "0.75rem",
                fontFamily: "'DM Sans',sans-serif",
              }}>
                ✕ Clear
              </button>
            </div>
          )}

          {/* Error */}
          {postsError && (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.65rem",
              padding: "0.85rem 1.1rem", borderRadius: 12,
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)",
              marginBottom: "0.75rem",
            }}>
              <span>⚠️</span>
              <span style={{ color: "#fca5a5", fontSize: "0.83rem", flex: 1 }}>{postsError}</span>
              <button onClick={refetch} style={{
                background: "none", border: "none", color: "#5eead4",
                cursor: "pointer", fontWeight: 700, fontSize: "0.78rem",
                fontFamily: "'DM Sans',sans-serif",
              }}>↻ Retry</button>
            </div>
          )}

          {/* Skeleton loading */}
          {postsLoading && (
            <div style={{
              display: "grid",
              gridTemplateColumns: md ? "1fr" : "1fr 1fr",
              gap: sm ? "0.75rem" : "1rem",
            }}>
              {[1,2,3,4,5,6].map(i => <PostCardSkeleton key={i} T={T} />)}
            </div>
          )}

          {/* Empty state */}
          {!postsLoading && !postsError && posts.length === 0 && (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "0.75rem", padding: "3.5rem 1rem", textAlign: "center",
              color: T.textMuted,
            }}>
              <div style={{ fontSize: "2.8rem", opacity: 0.45 }}>📭</div>
              <p style={{ fontSize: "0.85rem", margin: 0 }}>
                {search ? `No posts matching "${search}"` : "No posts in this category yet."}
              </p>
            </div>
          )}

          {/* Post cards */}
          {!postsLoading && posts.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: md ? "1fr" : "1fr 1fr",
              gap: sm ? "0.75rem" : "1rem",
            }}>
              {posts.map((post, i) => (
                <div key={post.id} style={{ animationDelay: `${i * 0.04}s` }}>
                  <PostCard T={T} post={post} sm={sm} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination info */}
          {!postsLoading && postsData?.total > 0 && (
            <div style={{
              textAlign: "center", color: T.textMuted,
              fontSize: "0.74rem", marginTop: "1rem",
            }}>
              Showing {posts.length} of {postsData.total} posts
            </div>
          )}
        </div>
      </div>
    </div>
  );
}