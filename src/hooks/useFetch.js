// src/hooks/useFetch.js
// ─────────────────────────────────────────────
// Generic data-fetching hook with Sanctum token support.
// Reads auth_token directly from localStorage so it always
// has the latest value at call time (no stale closure issues).
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from "react";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

/**
 * useFetch(path, options)
 *
 * @param {string} path    — e.g. "/students/stats"
 * @param {object} options
 *   params   {object}  — query string key/value pairs
 *   skip     {boolean} — if true, don't auto-fetch on mount
 *
 * @returns {{ data, loading, error, refetch }}
 */
export function useFetch(path, { params = {}, skip = false } = {}) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error,   setError]   = useState(null);

  const abortRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      // Read token fresh from localStorage every call — avoids stale closures
      const token = localStorage.getItem("auth_token");

      const qs  = new URLSearchParams(params).toString();
      const url = `${BASE_URL}${path}${qs ? `?${qs}` : ""}`;

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "Content-Type":  "application/json",
          "Accept":        "application/json",
          // Sanctum token-based auth requires "Bearer <token>"
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? `HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  // Stringify params so the effect re-runs when params change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, JSON.stringify(params)]);

  useEffect(() => {
    if (!skip) fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData, skip]);

  return { data, loading, error, refetch: fetchData };
}