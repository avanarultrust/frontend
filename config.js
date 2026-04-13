/** Netlify: set VITE_API_URL in Site settings → Environment variables (no trailing slash). */
// Last Sync: 2026-04-13T20:43:44 (Enforced update)
export const API_URL = (
  import.meta.env.VITE_API_URL || "https://backend-b1pt.onrender.com"
).replace(/\/$/, "");
