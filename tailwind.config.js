/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0a0a0a",
          light: "#1a1a1a",
        },
        accent: {
          DEFAULT: "#D4AF37",
          light: "#F5C842",
          dark: "#B8962E",
        },
        bg: "#FAFAFA",
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#F5F5F5",
        },
        text: {
          DEFAULT: "#0a0a0a",
          muted: "#6B7280",
        },
        border: "#E5E7EB",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [],
};
