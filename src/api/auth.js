// src/api/auth.js

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

export async function loginRequest(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept':       'application/json',  // tells Laravel to return JSON errors
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Laravel returns { message: '...' } or { errors: { email: [...] } }
    const msg = data?.message
      ?? Object.values(data?.errors ?? {})?.[0]?.[0]
      ?? 'Login failed';
    throw new Error(msg);
  }

  return data; // { user, token }
}

export function saveSession(token, user) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user',  JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export function getToken() {
  return localStorage.getItem('auth_token');
}

export function getUser() {
  const u = localStorage.getItem('auth_user');
  return u ? JSON.parse(u) : null;
}