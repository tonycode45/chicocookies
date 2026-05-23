/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0600',
        'bg-alt': '#0d0904',
        surface: '#120c02',
        card: '#120e08',
        gold: {
          DEFAULT: '#dc8c28',
          warm: '#ffcf7a',
          hover: '#c47d22',
        },
        text: {
          primary: '#fdf6ec',
          muted: '#7a6a55',
          dim: '#5a5040',
          faint: '#3a2a14',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
      },
    },
  },
  plugins: [],
}
