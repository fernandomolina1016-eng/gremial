import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ferro: {
          navy:    '#1a3a5c',
          blue:    '#2563EB',
          red:     '#c0392b',
          light:   '#DBEAFE',
          gray:    '#f8fafc',
          dark:    '#1e293b',
          muted:   '#64748b',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'fade-in':     'fadeIn 0.4s ease-out forwards',
        'slide-up':    'slideUp 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0' },                    to: { opacity: '1' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideRight: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
export default config
