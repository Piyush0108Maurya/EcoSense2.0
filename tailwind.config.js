/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ── Techno-Oceanic: Surface Hierarchy ── */
        "surface":                  "#070D1F",
        "background":               "#070D1F",
        "surface-container-low":    "#0E1428",
        "surface-container":        "#191F31",
        "surface-container-high":   "#232A3E",
        "surface-container-highest":"#2E3447",
        "surface-variant":          "#2E3447",
        "surface-bright":           "#3A4260",
        /* ── Text ── */
        "on-surface":               "#E8F4FD",
        "on-surface-variant":       "#8FA8BF",
        "on-background":            "#E8F4FD",
        /* ── Primary: Oxygen Cyan ── */
        "primary":                  "#8AEBFF",
        "on-primary":               "#070D1F",
        "primary-fixed":            "#8AEBFF",
        "primary-dim":              "#22D3EE",
        /* ── Secondary: Bioluminescent Lime ── */
        "secondary":                "#A4D64C",
        "secondary-container":      "#2A3A1A",
        "on-secondary-container":   "#BEF264",
        /* ── Tertiary: Depth Amber ── */
        "tertiary":                 "#F59E0B",
        "tertiary-dim":             "#D97706",
        "tertiary-container":       "#FDE68A",
        /* ── Outlines & Errors ── */
        "outline":                  "#2E3447",
        "outline-variant":          "#1D2438",
        "error":                    "#FF5252",
        "inverse-primary":          "#0EA5E9",
        "surface-tint":             "#8AEBFF"
      },
      fontFamily: { "headline": ["Space Grotesk"], "body": ["Inter"], "label": ["Space Grotesk"] },
      /* Military-tech sharpness: max 0.5rem roundness */
      borderRadius: { "sm": "0.125rem", "DEFAULT": "0.375rem", "md": "0.5rem", "lg": "0.75rem", "xl": "0.75rem", "full": "9999px" },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      }
    },
  },
  plugins: [],
}
