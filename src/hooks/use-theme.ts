import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";
type Theme = "light" | "dark";

function resolveInitialTheme(): Theme {
  const persisted = localStorage.getItem(STORAGE_KEY);
  if (persisted === "dark" || persisted === "light") {
    return persisted;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(resolveInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme } as const;
}
