/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter Tight', 'Space Grotesk', '-apple-system', 'sans-serif'],
        heading: ['Inter Tight', 'Space Grotesk', '-apple-system', 'sans-serif'],
        body: ['Inter', 'Manrope', '-apple-system', 'sans-serif'],
        sans: ['Inter', 'Space Grotesk', '-apple-system', 'sans-serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Precision Studio Core Palette
        graphite: "#0B0D10",
        "surface-dark": "#12151A",
        "surface-card": "#181C22",
        "studio-light": "#F5F6F8",
        "studio-card": "#FFFFFF",
        "saturn-orange": "#FF5A1F",
        "saturn-orange-hover": "#E04810",
        "wa-green": "#25D366",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          dark: "#A3A9B3",
          light: "#5B616B",
        },
        primary: {
          DEFAULT: "#FF5A1F",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "#FF5A1F",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        '2xl': '18px',
        xl: '16px',
        lg: '14px',
        md: '12px',
        sm: '10px',
        xs: '6px',
      },
      boxShadow: {
        'precision-xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'precision-sm': '0 2px 6px rgba(0, 0, 0, 0.04)',
        'precision-md': '0 6px 18px rgba(0, 0, 0, 0.05)',
        'precision-lg': '0 12px 32px rgba(0, 0, 0, 0.06)',
        'precision-xl': '0 20px 48px rgba(0, 0, 0, 0.08)',
        'glow-orange': '0 0 32px rgba(255, 90, 31, 0.12)',
        'glow-orange-soft': '0 0 60px rgba(255, 90, 31, 0.08)',
      },
      maxWidth: {
        'container': '1280px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.08)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "accordion-up": "accordion-up 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-subtle": "pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
