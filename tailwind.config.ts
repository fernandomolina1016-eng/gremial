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
          navy:  '#1a3a5c',
          blue:  '#2563EB',
          red:   '#c0392b',
          light: '#DBEAFE',
          gray:  '#f8fafc',
          dark:  '#1e293b',
        },
      },
    },
  },
  plugins: [],
}
export default config
