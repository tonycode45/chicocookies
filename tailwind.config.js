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
        surface: '#120c02',
        sidebar: '#080400',
        gold: {
          DEFAULT: '#dc8c28',
          warm: '#ffcf7a',
        },
        text: {
          primary: '#fdf6ec',
          muted: '#7a6a55',
          dim: '#5a5040',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
      },
    },
  },
  plugins: [],
}
