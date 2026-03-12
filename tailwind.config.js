// tailwind.config.js
// Tailwind configuration with custom soothing color palette for Guest app

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // Primary calm blues
        calm: {
          50:  "#f0f7ff",
          100: "#e0efff",
          200: "#b9dcff",
          300: "#7cc0ff",
          400: "#36a0fc",
          500: "#0c82ed",
          600: "#0063cb",
          700: "#004fa5",
          800: "#064488",
          900: "#0b3a71",
        },
        // Soft greens for hope/growth
        sage: {
          50:  "#f3faf4",
          100: "#e4f4e7",
          200: "#cae8d0",
          300: "#9dd4a9",
          400: "#68b87a",
          500: "#449b58",
          600: "#327d44",
          700: "#2a6438",
          800: "#255030",
          900: "#1f4229",
        },
        // Warm neutrals
        warm: {
          50:  "#fafaf8",
          100: "#f4f4ef",
          200: "#e8e8e0",
          300: "#d4d4c8",
          400: "#b0b09f",
          500: "#8f8f7d",
          600: "#737363",
          700: "#5e5e51",
          800: "#4e4e44",
          900: "#43433b",
        },
      },
      fontFamily: {
        display: ["'Lora'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 20px rgba(12, 130, 237, 0.08)",
        card: "0 4px 24px rgba(0,0,0,0.07)",
        glow: "0 0 30px rgba(12, 130, 237, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-soft": "pulseSoft 2s infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(16px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        pulseSoft: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.7 } },
      },
    },
  },
  plugins: [],
};
