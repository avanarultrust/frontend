/** Netlify: set VITE_API_URL in Site settings → Environment variables (no trailing slash). */
export const API_URL = (
  import.meta.env.VITE_API_URL || "https://backend-b1pt.onrender.com"
).replace(/\/$/, "");
