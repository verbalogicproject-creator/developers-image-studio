import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        studio: {
          950: "#09090b",
          900: "#121215",
          850: "#18181c",
          800: "#222228",
          700: "#32323d",
          600: "#52525f",
          500: "#71717e",
          400: "#a1a1aa",
          300: "#d4d4d8",
          200: "#e4e4e7",
          100: "#f4f4f5",
          50: "#fafafa",
        },
        luxury: {
          gold: "#d4af37",
          amber: "#f59e0b",
          bronze: "#c5a880",
          champagne: "#f5ebe0",
          cream: "#faf6f0",
          cashmere: "#e8dfd8",
          sand: "#d5bdaf",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(245, 158, 11, 0.25)",
        "subtle-card": "0 8px 30px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gold-shimmer": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
