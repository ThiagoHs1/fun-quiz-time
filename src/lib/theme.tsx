import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";
type ColorTheme = "purple" | "blue" | "green" | "amber" | "red" | "cyan" | "pink" | "mono";

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setColorTheme: (c: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark", colorTheme: "purple", toggleTheme: () => {}, setColorTheme: () => {},
});

export const COLOR_THEMES: { value: ColorTheme; label: string; hue: string }[] = [
  { value: "purple", label: "Purple", hue: "262 83%" },
  { value: "blue", label: "Blue", hue: "217 91%" },
  { value: "green", label: "Green", hue: "142 71%" },
  { value: "amber", label: "Amber", hue: "38 92%" },
  { value: "red", label: "Red", hue: "0 72%" },
  { value: "cyan", label: "Cyan", hue: "190 80%" },
  { value: "pink", label: "Pink", hue: "330 80%" },
  { value: "mono", label: "Mono", hue: "0 0%" },
];

// Each theme defines primary HSL values for light and dark
const THEME_VALUES: Record<ColorTheme, { light: string; dark: string }> = {
  purple: { light: "262 83% 58%", dark: "262 83% 62%" },
  blue:   { light: "217 91% 50%", dark: "217 91% 60%" },
  green:  { light: "142 71% 42%", dark: "142 71% 50%" },
  amber:  { light: "38 92% 50%",  dark: "38 92% 55%" },
  red:    { light: "0 72% 51%",   dark: "0 72% 55%" },
  cyan:   { light: "190 80% 42%", dark: "190 80% 50%" },
  pink:   { light: "330 80% 55%", dark: "330 80% 60%" },
  mono:   { light: "0 0% 20%",    dark: "0 0% 80%" },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("quizcraft-theme");
    return (stored as Theme) || "dark";
  });
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem("quizcraft-color-theme");
    return (stored as ColorTheme) || "purple";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("quizcraft-theme", theme);

    // Apply color theme
    const values = THEME_VALUES[colorTheme];
    const primary = theme === "dark" ? values.dark : values.light;
    root.style.setProperty("--primary", primary);
    root.style.setProperty("--ring", primary);
    localStorage.setItem("quizcraft-color-theme", colorTheme);
  }, [theme, colorTheme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const setColorTheme = (c: ColorTheme) => setColorThemeState(c);

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, toggleTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
