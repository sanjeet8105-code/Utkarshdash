import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#15132E",
        brand: {
          DEFAULT: "#4F3FF0",
          dark: "#2E2494",
          deep: "#1E1B4B",
          light: "#EFEDFC",
        },
        navy: "#17153A",
        muted: "#6B6785",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
