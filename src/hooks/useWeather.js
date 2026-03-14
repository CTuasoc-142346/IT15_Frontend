// src/hooks/useWeather.js
// ─────────────────────────────────────────────
// OpenWeatherMap hook:
//   - Current weather conditions
//   - 5-day / 3-hour forecast (grouped into daily)
//   - City name search OR browser geolocation
//   - Response caching (5 min) to respect API rate limits
//   - Graceful error handling for 401, 404, 429
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from "react";

const API_KEY  = import.meta.env.VITE_OWM_KEY ?? "";
const BASE     = "https://api.openweathermap.org/data/2.5";
const CACHE_MS = 5 * 60 * 1000; // 5 minutes

// ── Simple in-memory cache ────────────────────────────────────
const cache = new Map(); // key → { data, ts }

function fromCache(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > CACHE_MS) { cache.delete(key); return null; }
  return hit.data;
}
function toCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

// ── Human-readable error messages ────────────────────────────
function friendlyError(status, fallback) {
  if (status === 401) return "Invalid API key. Check your VITE_OWM_KEY.";
  if (status === 404) return "City not found. Try a different name.";
  if (status === 429) return "Too many requests. Please wait a moment.";
  return fallback ?? "Could not load weather data.";
}

// ── Group 3-hour forecast slots into daily summaries ──────────
function groupForecast(list) {
  const days = {};
  list.forEach((slot) => {
    const date = slot.dt_txt.split(" ")[0]; // "2025-08-04"
    if (!days[date]) days[date] = [];
    days[date].push(slot);
  });

  return Object.entries(days).map(([date, slots]) => {
    const temps    = slots.map((s) => s.main.temp);
    const midSlot  = slots[Math.floor(slots.length / 2)] ?? slots[0];
    return {
      date,
      tempMin : Math.round(Math.min(...temps)),
      tempMax : Math.round(Math.max(...temps)),
      icon    : midSlot.weather[0].icon,
      desc    : midSlot.weather[0].description,
      humidity: Math.round(slots.reduce((s, x) => s + x.main.humidity, 0) / slots.length),
      wind    : Math.round(slots.reduce((s, x) => s + x.wind.speed,    0) / slots.length * 10) / 10,
      pop     : Math.round(Math.max(...slots.map((s) => s.pop ?? 0)) * 100), // max rain probability %
    };
  }).slice(0, 5); // exactly 5 days
}

// ── Main hook ─────────────────────────────────────────────────
export function useWeather(defaultCity = "Tagum City") {
  const [city,     setCity]     = useState(defaultCity);
  const [search,   setSearch]   = useState(defaultCity); // controlled input value
  const [current,  setCurrent]  = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const abortRef = useRef(null);

  // ── Fetch both endpoints for a city string ─────────────────
  const fetchByCity = useCallback(async (cityName) => {
    if (!cityName.trim()) return;
    if (!API_KEY) { setError("VITE_OWM_KEY is not set in your .env file."); setLoading(false); return; }

    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);

    const cKey = cityName.trim().toLowerCase();
    const cached = fromCache(cKey);
    if (cached) {
      setCurrent(cached.current);
      setForecast(cached.forecast);
      setLoading(false);
      return;
    }

    try {
      const qs = `q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`;

      const [curRes, fcRes] = await Promise.all([
        fetch(`${BASE}/weather?${qs}`,          { signal: ctrl.signal }),
        fetch(`${BASE}/forecast?${qs}&cnt=40`,  { signal: ctrl.signal }),
      ]);

      if (!curRes.ok) throw new Error(friendlyError(curRes.status));
      if (!fcRes.ok)  throw new Error(friendlyError(fcRes.status));

      const [curData, fcData] = await Promise.all([curRes.json(), fcRes.json()]);

      const result = {
        current : curData,
        forecast: groupForecast(fcData.list),
      };

      toCache(cKey, result);
      setCurrent(result.current);
      setForecast(result.forecast);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch by browser geolocation → reverse geocode ────────
  const fetchByGeo = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        if (!API_KEY) { setError("VITE_OWM_KEY is not set."); setLoading(false); return; }
        const qs = `lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${API_KEY}`;
        try {
          const [curRes, fcRes] = await Promise.all([
            fetch(`${BASE}/weather?${qs}`),
            fetch(`${BASE}/forecast?${qs}&cnt=40`),
          ]);
          if (!curRes.ok) throw new Error(friendlyError(curRes.status));
          if (!fcRes.ok)  throw new Error(friendlyError(fcRes.status));
          const [curData, fcData] = await Promise.all([curRes.json(), fcRes.json()]);
          const detectedCity = curData.name;
          setCity(detectedCity);
          setSearch(detectedCity);
          const result = { current: curData, forecast: groupForecast(fcData.list) };
          toCache(detectedCity.toLowerCase(), result);
          setCurrent(result.current);
          setForecast(result.forecast);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => { setError("Location access denied."); setLoading(false); }
    );
  }, []);

  // ── Submit city search ────────────────────────────────────
  const submitSearch = useCallback(() => {
    setCity(search);
    fetchByCity(search);
  }, [search, fetchByCity]);

  // ── Initial load ──────────────────────────────────────────
  useEffect(() => {
    fetchByCity(city);
    return () => abortRef.current?.abort();
  }, []); // only on mount — user-triggered refetches go through submitSearch

  return {
    city, search, setSearch,
    current, forecast,
    loading, error,
    submitSearch, fetchByGeo,
    refetch: () => fetchByCity(city),
  };
}