// src/api/api.js
import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8000"; // use localhost, not 127.0.0.1

export const apis = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // harmless for Bearer; needed only if you rely on cookies
});

export const setAuthHeader = (token, type = "Bearer") => {
  apis.defaults.headers.common.Authorization = `${type} ${token}`;
};

export const clearAuthHeader = () => {
  delete apis.defaults.headers.common.Authorization;
};

// Backstop: if defaults were lost (e.g., after refresh), attach from localStorage
apis.interceptors.request.use((config) => {
  const saved = JSON.parse(localStorage.getItem("auth") || "null");
  if (saved?.token && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `${saved.tokenType || "Bearer"} ${
      saved.token
    }`;
  }
  return config;
});

export async function askTutor(message, max_output_tokens = 300) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, max_output_tokens }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}
