/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Crypto/Blockchain Web3 Theme - Dark Mode with Neon Accents
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#c0ddfd',
          300: '#a1cbfc',
          400: '#81b9fb',
          500: '#6fa3ff', // Ethereum purple-blue
          600: '#5a8ee8',
          700: '#4579d1',
          800: '#3064ba',
          900: '#1b4fa3',
        },
        crypto: {
          50: '#fef3f2',
          100: '#fce8e6',
          200: '#fad2cc',
          300: '#f7b4a3',
          400: '#f59279',
          500: '#f1865d', // Bitcoin orange
          600: '#d97854',
          700: '#b5563f',
          800: '#88402a',
          900: '#5a2817',
        },
        neon: {
          purple: '#b855ff',    // Neon purple
          cyan: '#00f0ff',       // Neon cyan
          green: '#00ff88',      // Neon green
          pink: '#ff006e',       // Neon pink
          yellow: '#ffff00',     // Neon yellow
          blue: '#0080ff',       // Neon blue
        },
        blockchain: {
          dark: '#0a0e27',       // Deep dark blue (main background)
          darker: '#05070f',     // Even darker
          card: '#0f1d3d',       // Card background with slight blue tint
          border: '#1a2e4d',     // Border/divider color
          hover: '#1a3a5f',      // Hover state
        },
        eth: '#627eea',          // Ethereum purple
        btc: '#f7931a',          // Bitcoin orange
        ada: '#000e59',          // Cardano blue
        sol: '#9945ff',          // Solana purple
        success: '#00ff88',
        warning: '#ffff00',
        danger: '#ff006e',
        dark: '#0a0e27',
        light: '#f8f9fa',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        crypto: ['Space Mono', 'monospace'],
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '40px'],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'neon-purple': '0 0 20px rgba(184, 85, 255, 0.5), 0 0 40px rgba(184, 85, 255, 0.3)',
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.3)',
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)',
        'neon-pink': '0 0 20px rgba(255, 0, 110, 0.5), 0 0 40px rgba(255, 0, 110, 0.3)',
        'glow-primary': '0 0 20px rgba(111, 163, 255, 0.5)',
        'glow-accent': '0 0 30px rgba(0, 240, 255, 0.6)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6fa3ff 0%, #5a8ee8 100%)',
        'gradient-neon': 'linear-gradient(135deg, #b855ff 0%, #00f0ff 50%, #00ff88 100%)',
        'gradient-crypto': 'linear-gradient(135deg, #0a0e27 0%, #0f1d3d 50%, #1a3a5f 100%)',
        'gradient-eth': 'linear-gradient(135deg, #627eea 0%, #b855ff 100%)',
        'gradient-btc': 'linear-gradient(135deg, #f7931a 0%, #ffff00 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(111, 163, 255, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(111, 163, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
