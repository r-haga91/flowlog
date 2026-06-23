import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        success: "hsl(var(--success))",
        destructive: "hsl(var(--destructive))"
      },
      borderRadius: { xl: "1rem", "2xl": "1.5rem", "3xl": "2rem" },
      boxShadow: { glow: "0 24px 80px -36px rgba(50, 101, 160, 0.55)" },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } }
      },
      animation: { "fade-up": "fade-up 500ms ease-out both" }
    },
  },
  plugins: [],
};

export default config;
