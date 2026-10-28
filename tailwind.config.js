/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
        heading: ['Space Grotesk', 'Outfit', 'sans-serif'],
        body: ['Manrope', 'Space Grotesk', 'sans-serif'],
        sans: ['Space Grotesk', 'Manrope', 'sans-serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        paper: "#FAF7F2",
        ink: "#0B0B0B",
        "saturn-orange": "#FF5A1F",
        lemon: "#FFE14D",
        periwinkle: "#8EA2FF",
        mint: "#7CF2C1",
        "wa-green": "#25D366",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          blue: '#1e3c8d',
          'blue-light': '#2b4cb8',
          orange: '#FF5A1F',
          dark: '#0B0B0B',
          light: '#FAF7F2',
          gray: '#6b7280',
        },
        saturn: {
          orange: '#FF5A1F',
          'orange-dark': '#E04810',
          'orange-light': '#FF7C4D',
          studio: '#FAF7F2',
          light: '#FDFBF7',
          surface: '#FFFFFF',
        },
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'brutal-sm': '2px 2px 0px #0B0B0B',
        'brutal': '3px 3px 0px #0B0B0B',
        'brutal-lg': '4px 4px 0px #0B0B0B',
        'brutal-xl': '5px 5px 0px #0B0B0B',
        'brutal-orange': '3px 3px 0px #FF5A1F',
        'brutal-lemon': '3px 3px 0px #FFE14D',
        'subtle': '0 2px 8px rgba(11, 11, 11, 0.04)',
        'clean': '0 4px 12px -2px rgba(11, 11, 11, 0.05), 2px 2px 0px #0B0B0B',
        'glow': '0 0 30px rgba(255, 90, 31, 0.15)',
        'glow-orange': '0 0 30px rgba(255, 90, 31, 0.25)',
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(30, 60, 141, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(30, 60, 141, 0.5)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "float": "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.6s ease-out",
        "scale-in": "scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
