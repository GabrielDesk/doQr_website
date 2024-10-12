import type { Config } from "tailwindcss";
import { animationDelay, animations, keyframes } from "./src/animations/theme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "var(--foreground)",
        primary: "#7741FB",
        text: "#0B0B0C",
        background: "#FDFCFF",
      },
      keyframes,

      animation: {
        ...animations,
      },

      transitionDelay: animationDelay,
    },
  },
  plugins: [],
};
export default config;
