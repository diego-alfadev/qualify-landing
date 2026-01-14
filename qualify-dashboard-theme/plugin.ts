// plugin.ts - HeroUI plugin export for Tailwind v4
import { heroui } from "@heroui/react";

export default heroui({
  defaultTheme: "qualify-dark",
  themes: {
    "qualify-dark": {
      extend: "dark", // Inherit from default dark theme
      colors: {
        background: "#020403", // Abyssal Green
        foreground: "#f0fdf4", // Pale Green Text

        primary: {
          DEFAULT: "#00E599", // Cyber Matrix Green
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#2E5CFF", // Electric Blue
          foreground: "#FFFFFF",
        },

        // Surface / Content layers
        content1: "#080C0A", // Deep Dark Card
        content2: "#0D1612",
        content3: "#141F1A",
        content4: "#1A2623",

        // Status
        success: {
            DEFAULT: "#00E599",
            foreground: "#000000"
        },
        warning: "#fbbf24",
        danger: "#ff4d4d",
        info: "#60a5fa",

        // UI Elements
        divider: "#141F1A", // Subtle dark green border
        focus: "#00E599",
      },
    },
  },
});
