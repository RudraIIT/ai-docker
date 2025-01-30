module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
        // Cyberpunk-inspired color palette
        neon: {
          pink: "#FF2E63",
          blue: "#00FFF5",
          purple: "#A34FDE",
          yellow: "#FFD300",
          green: "#39FF14",
        },
        cyber: {
          black: "#0A0A0F",
          darker: "#151517",
          dark: "#1A1A1F",
          light: "#252529",
          accent: "#2A2A35",
        },
      },
      backgroundImage: {
        "cyber-grid":
          "linear-gradient(90deg, rgba(255,46,99,0.05) 1px, transparent 1px), linear-gradient(0deg, rgba(255,46,99,0.05) 1px, transparent 1px)",
        "glow-conic": "conic-gradient(from 180deg at 50% 50%, #FF2E63 0deg, #00FFF5 180deg, #A34FDE 360deg)",
      },
      boxShadow: {
        "neon-pink": '0 0 5px theme("colors.neon.pink"), 0 0 20px theme("colors.neon.pink")',
        "neon-blue": '0 0 5px theme("colors.neon.blue), 0 0 20px theme("colors.neon.blue")',
        "neon-glow": "0 0 10px rgba(255, 46, 99, 0.3), 0 0 40px rgba(0, 255, 245, 0.1)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

