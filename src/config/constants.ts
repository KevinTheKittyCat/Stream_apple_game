// Replace last slash with empty string
export const basePath = (import.meta.env.VITE_PUBLIC_BASE ?? "/").replace(/\/$/, "");
