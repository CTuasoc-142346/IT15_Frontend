// src/components/WeatherWidget.jsx
// ─────────────────────────────────────────────
// Two parts:
//   1. <WeatherSummary>  — compact strip shown in sidebar above username
//                          clicking it opens the modal
//   2. <WeatherModal>    — full overlay with:
//        · Current conditions (temp, humidity, wind, feels-like, visibility, pressure)
//        · 5-day forecast with icons
//        · City search + geolocation button
//        · Visual weather representations (animated bg, icon, condition badge)
//        · Rate-limit / error handling
// ─────────────────────────────────────────────

import { useState } from "react";
import { useWeather } from "../hooks/useWeather";

// ── OWM icon URL helper ───────────────────────────────────────
const owmIcon = (code, size = "@2x") =>
  `https://openweathermap.org/img/wn/${code}${size}.png`;

// ── Map OWM condition codes → visual theme ────────────────────
function conditionTheme(weatherId, isDay) {
  if (!weatherId) return { gradient: "linear-gradient(135deg,#1e3a5f,#0f2744)", emoji: "🌡️", label: "Unknown" };
  const id = Number(weatherId);
  if (id >= 200 && id < 300) return { gradient: "linear-gradient(135deg,#1a1a2e,#16213e)", emoji: "⛈️",  label: "Thunderstorm" };
  if (id >= 300 && id < 400) return { gradient: "linear-gradient(135deg,#2c3e50,#3498db)", emoji: "🌦️",  label: "Drizzle"      };
  if (id >= 500 && id < 600) return { gradient: "linear-gradient(135deg,#1a1a2e,#2980b9)", emoji: "🌧️",  label: "Rain"         };
  if (id >= 600 && id < 700) return { gradient: "linear-gradient(135deg,#e8f4f8,#b0c4de)", emoji: "❄️",  label: "Snow"         };
  if (id >= 700 && id < 800) return { gradient: "linear-gradient(135deg,#8e9eab,#606c76)", emoji: "🌫️",  label: "Fog"          };
  if (id === 800) return isDay
    ? { gradient: "linear-gradient(135deg,#2980b9,#f39c12)", emoji: "☀️",  label: "Clear"   }
    : { gradient: "linear-gradient(135deg,#0f2744,#1a1a2e)", emoji: "🌙",  label: "Clear"   };
  if (id >= 801 && id <= 802) return { gradient: "linear-gradient(135deg,#3a7bd5,#667eea)", emoji: "⛅",  label: "Partly Cloudy" };
  return { gradient: "linear-gradient(135deg,#485563,#29323c)", emoji: "☁️",  label: "Cloudy" };
}

// ── Format date string → "Mon, Aug 4" ────────────────────────
const fmtDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" });

// ── Wind direction from degrees ───────────────────────────────
const windDir = (deg) => {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
};

// ── Shimmer loader ────────────────────────────────────────────
const Shimmer = ({ w = "100%", h = 16, r = 6, style = {} }) => (
  <div style={{
    width: w, height: h, borderRadius: r,
    background: "linear-gradient(90deg,rgba(255,255,255,0.06) 25%,rgba(255,255,255,0.13) 50%,rgba(255,255,255,0.06) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease-in-out infinite",
    ...style,
  }} />
);

// ════════════════════════════════════════════════════════════
// 1. SIDEBAR SUMMARY STRIP
// ════════════════════════════════════════════════════════════
export function WeatherSummary({ T, collapsed, onOpen }) {
  const { current, loading, error } = useWeather("Tagum City");

  const temp    = current ? Math.round(current.main.temp) : null;
  const icon    = current?.weather?.[0]?.icon;
  const desc    = current?.weather?.[0]?.main ?? "";
  const city    = current?.name ?? "Tagum City";
  const weatherId = current?.weather?.[0]?.id;
  const isDay   = icon ? icon.endsWith("d") : true;
  const theme   = conditionTheme(weatherId, isDay);

  return (
    <button
      onClick={onOpen}
      title="View weather details"
      style={{
        display: "flex",
        alignItems: "center",
        gap: collapsed ? 0 : "0.6rem",
        justifyContent: collapsed ? "center" : "flex-start",
        width: "100%",
        padding: collapsed ? "0.55rem" : "0.55rem 0.82rem",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.04)",
        cursor: "pointer",
        marginBottom: "0.4rem",
        transition: "all .18s",
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(94,234,212,0.25)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
    >
      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>

      {/* Subtle gradient accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: theme.gradient, borderRadius: "10px 0 0 10px",
      }} />

      {loading ? (
        <Shimmer w={28} h={28} r={8} />
      ) : error ? (
        <span style={{ fontSize: "1.2rem" }} title={error}>⚠️</span>
      ) : (
        <img
          src={owmIcon(icon)}
          alt={desc}
          width={28} height={28}
          style={{ flexShrink: 0, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}
        />
      )}

      {!collapsed && (
        <div style={{ minWidth: 0, flex: 1 }}>
          {loading ? (
            <>
              <Shimmer w="60%" h={11} r={4} style={{ marginBottom: 4 }} />
              <Shimmer w="40%" h={9}  r={4} />
            </>
          ) : error ? (
            <div style={{ color: "#f87171", fontSize: "0.7rem", fontWeight: 600 }}>Weather unavailable</div>
          ) : (
            <>
              <div style={{
                color: "#f0f4ff", fontWeight: 700, fontSize: "0.82rem",
                display: "flex", alignItems: "center", gap: "0.3rem",
              }}>
                <span>{temp}°C</span>
                <span style={{ color: "#4b5563", fontWeight: 400 }}>·</span>
                <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.74rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{desc}</span>
              </div>
              <div style={{ color: "#4b5563", fontSize: "0.64rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                📍 {city}
              </div>
            </>
          )}
        </div>
      )}
    </button>
  );
}

// ════════════════════════════════════════════════════════════
// 2. FULL WEATHER MODAL
// ════════════════════════════════════════════════════════════
export function WeatherModal({ T, onClose }) {
  const {
    city, search, setSearch,
    current, forecast,
    loading, error,
    submitSearch, fetchByGeo, refetch,
  } = useWeather("Tagum City");

  const weatherId = current?.weather?.[0]?.id;
  const icon      = current?.weather?.[0]?.icon;
  const isDay     = icon ? icon.endsWith("d") : true;
  const theme     = conditionTheme(weatherId, isDay);
  const temp      = current ? Math.round(current.main.temp)      : null;
  const feels     = current ? Math.round(current.main.feels_like) : null;
  const humidity  = current?.main.humidity;
  const wind      = current?.wind?.speed;
  const windDeg   = current?.wind?.deg;
  const pressure  = current?.main.pressure;
  const visibility = current?.visibility ? (current.visibility / 1000).toFixed(1) : null;
  const desc      = current?.weather?.[0]?.description ?? "";
  const cityName  = current?.name ?? city;
  const country   = current?.sys?.country ?? "";
  const sunrise   = current?.sys?.sunrise ? new Date(current.sys.sunrise * 1000).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }) : null;
  const sunset    = current?.sys?.sunset  ? new Date(current.sys.sunset  * 1000).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }) : null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
          animation: "fadeIn .2s ease",
        }}
      />

      {/* Modal panel */}
      <div style={{
        position: "fixed", zIndex: 51,
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "min(560px, calc(100vw - 2rem))",
        maxHeight: "calc(100vh - 3rem)",
        overflowY: "auto",
        borderRadius: 20,
        background: T.dark ? "#0d0b28" : "#f4f6fb",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        animation: "scaleIn .22s ease",
        fontFamily: "'DM Sans',sans-serif",
      }}>
        <style>{`
          @keyframes fadeIn  { from{opacity:0}                  to{opacity:1} }
          @keyframes scaleIn { from{opacity:0;transform:translate(-50%,-50%) scale(.93)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
          @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
          @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          .wx-day:hover { background: rgba(255,255,255,0.07) !important; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        `}</style>

        {/* ── Hero banner ── */}
        <div style={{
          background: theme.gradient,
          padding: "1.8rem 1.5rem 1.4rem",
          borderRadius: "20px 20px 0 0",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative orb */}
          <div style={{
            position: "absolute", right: -40, top: -40,
            width: 180, height: 180, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }} />

          {/* Close button */}
          <button onClick={onClose} style={{
            position: "absolute", top: "1rem", right: "1rem",
            width: 30, height: 30, borderRadius: "50%",
            border: "none", background: "rgba(0,0,0,0.3)",
            color: "rgba(255,255,255,0.8)", fontSize: "0.9rem",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background .15s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.55)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.3)"}
          >✕</button>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Shimmer w="50%" h={14} r={6} />
              <Shimmer w="30%" h={48} r={8} />
              <Shimmer w="60%" h={12} r={6} />
            </div>
          ) : error ? (
            <div style={{ color: "#fca5a5", fontSize: "0.9rem" }}>⚠️ {error}</div>
          ) : (
            <>
              {/* City + country */}
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem", marginBottom: "0.3rem", letterSpacing: "0.04em" }}>
                📍 {cityName}{country ? `, ${country}` : ""}
              </div>

              {/* Temp + icon */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ fontSize: "4rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, fontFamily: "'Syne',sans-serif" }}>
                  {temp}°
                </div>
                <div>
                  <img src={owmIcon(icon, "@2x")} alt={desc} width={64} height={64}
                    style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }} />
                </div>
              </div>

              {/* Description + feels like */}
              <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "1rem", fontWeight: 600, textTransform: "capitalize", marginTop: "0.15rem" }}>
                {desc}
              </div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", marginTop: "0.18rem" }}>
                Feels like {feels}°C · {theme.label}
              </div>

              {/* Sunrise / Sunset */}
              {sunrise && sunset && (
                <div style={{ display: "flex", gap: "1.2rem", marginTop: "0.7rem" }}>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75rem" }}>🌅 {sunrise}</span>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75rem" }}>🌇 {sunset}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>

          {/* Search bar */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Search city…"
              style={{
                flex: 1, padding: "0.65rem 0.9rem", borderRadius: 10,
                border: `1.5px solid ${T.dark ? "rgba(255,255,255,0.1)" : "#d1d5db"}`,
                background: T.dark ? "rgba(255,255,255,0.06)" : "#fff",
                color: T.text, fontSize: "0.85rem",
                fontFamily: "'DM Sans',sans-serif", outline: "none",
                transition: "border-color .2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#5eead4"; }}
              onBlur={(e)  => { e.target.style.borderColor = T.dark ? "rgba(255,255,255,0.1)" : "#d1d5db"; }}
            />
            <button onClick={submitSearch} style={{
              padding: "0.65rem 1rem", borderRadius: 10,
              background: "linear-gradient(135deg,#5eead4,#3b82f6)",
              border: "none", color: "#07061a", fontWeight: 700,
              fontSize: "0.83rem", cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", transition: "filter .15s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.filter = ""}
            >🔍</button>
            <button onClick={fetchByGeo} title="Use my location" style={{
              padding: "0.65rem 0.75rem", borderRadius: 10,
              background: T.dark ? "rgba(255,255,255,0.06)" : "#fff",
              border: `1.5px solid ${T.dark ? "rgba(255,255,255,0.1)" : "#d1d5db"}`,
              color: T.textSub, fontSize: "0.9rem", cursor: "pointer",
              transition: "all .15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5eead4"; e.currentTarget.style.color = "#5eead4"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.dark ? "rgba(255,255,255,0.1)" : "#d1d5db"; e.currentTarget.style.color = T.textSub; }}
            >📍</button>
          </div>

          {/* Error message */}
          {error && !loading && (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              padding: "0.7rem 1rem", borderRadius: 10,
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)",
            }}>
              <span>⚠️</span>
              <span style={{ color: "#fca5a5", fontSize: "0.82rem", flex: 1 }}>{error}</span>
              <button onClick={refetch} style={{
                background: "none", border: "none", color: "#5eead4",
                cursor: "pointer", fontSize: "0.78rem", fontWeight: 700,
                fontFamily: "'DM Sans',sans-serif",
              }}>↻ Retry</button>
            </div>
          )}

          {/* Loading spinner */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "1rem 0" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "3px solid rgba(94,234,212,0.2)",
                borderTopColor: "#5eead4",
                animation: "spin 0.8s linear infinite",
              }} />
            </div>
          )}

          {/* ── Current condition details ── */}
          {!loading && current && (
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0.6rem",
            }}>
              {[
                { icon: "💧", label: "Humidity",    value: `${humidity}%`                             },
                { icon: "💨", label: "Wind",         value: `${wind} m/s ${windDir(windDeg)}`          },
                { icon: "🌡️", label: "Pressure",    value: `${pressure} hPa`                          },
                { icon: "👁️", label: "Visibility",  value: visibility ? `${visibility} km` : "N/A"   },
                { icon: "⬆️", label: "Temp Max",    value: `${Math.round(current.main.temp_max)}°C`   },
                { icon: "⬇️", label: "Temp Min",    value: `${Math.round(current.main.temp_min)}°C`   },
              ].map(({ icon: ic, label, value }) => (
                <div key={label} style={{
                  padding: "0.75rem 0.85rem", borderRadius: 12,
                  background: T.dark ? "rgba(255,255,255,0.04)" : "#fff",
                  border: `1px solid ${T.border}`,
                  display: "flex", flexDirection: "column", gap: "0.18rem",
                }}>
                  <div style={{ fontSize: "1.1rem" }}>{ic}</div>
                  <div style={{ color: T.textMuted, fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                  <div style={{ color: T.text, fontSize: "0.83rem", fontWeight: 700 }}>{value}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── 5-day forecast ── */}
          {!loading && forecast.length > 0 && (
            <div>
              <div style={{ color: T.textSub, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
                5-Day Forecast
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {forecast.map((day, i) => {
                  const dayTheme = conditionTheme(null, true); // use icon only
                  return (
                    <div key={day.date} className="wx-day" style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.6rem 0.85rem", borderRadius: 12,
                      background: i === 0
                        ? (T.dark ? "rgba(94,234,212,0.07)" : "rgba(20,184,166,0.06)")
                        : "transparent",
                      border: i === 0
                        ? `1px solid rgba(94,234,212,0.15)`
                        : "1px solid transparent",
                      transition: "background .15s",
                      cursor: "default",
                    }}>
                      {/* Day label */}
                      <div style={{ width: 72, color: T.textSub, fontSize: "0.78rem", fontWeight: i === 0 ? 700 : 500, flexShrink: 0 }}>
                        {i === 0 ? "Today" : fmtDate(day.date)}
                      </div>

                      {/* Icon */}
                      <img src={owmIcon(day.icon)} alt={day.desc} width={36} height={36}
                        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))", flexShrink: 0 }} />

                      {/* Description */}
                      <div style={{ flex: 1, color: T.textSub, fontSize: "0.75rem", textTransform: "capitalize", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {day.desc}
                      </div>

                      {/* Rain probability */}
                      {day.pop > 0 && (
                        <div style={{ color: "#60a5fa", fontSize: "0.72rem", fontWeight: 600, flexShrink: 0 }}>
                          🌂 {day.pop}%
                        </div>
                      )}

                      {/* Temp range */}
                      <div style={{ flexShrink: 0, textAlign: "right", minWidth: 64 }}>
                        <span style={{ color: T.text, fontWeight: 700, fontSize: "0.85rem" }}>{day.tempMax}°</span>
                        <span style={{ color: T.textMuted, fontSize: "0.78rem", marginLeft: "0.3rem" }}>{day.tempMin}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Footer note ── */}
          <div style={{ color: T.textMuted, fontSize: "0.65rem", textAlign: "center", paddingBottom: "0.25rem" }}>
            Data from OpenWeatherMap · Updates every 5 minutes · {new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
    </>
  );
}