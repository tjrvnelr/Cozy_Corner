import { useEffect, useState } from "react";

export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const saved = window.localStorage.getItem(key);
      if (!saved) return initialValue;
      const parsed = JSON.parse(saved);
      return Array.isArray(initialValue) && !Array.isArray(parsed)
        ? initialValue
        : parsed;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep the menu usable when storage is blocked or full.
    }
  }, [key, value]);

  return [value, setValue];
}
