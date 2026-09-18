import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        "bg-3": "var(--bg-3)",
        card: "var(--card)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        line: "var(--line)",
        violet: "var(--violet)",
        "violet-2": "var(--violet-2)",
        "violet-ink": "var(--violet-ink)",
        coral: "var(--coral)",
        mint: "var(--mint)",
        amber: "var(--amber)",
      },
      fontFamily: {
        assistant: ["var(--font-assistant)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 4px rgba(45,20,70,.05), 0 12px 28px rgba(45,20,70,.07)",
      },
    },
  },
  plugins: [],
};

export default config;
