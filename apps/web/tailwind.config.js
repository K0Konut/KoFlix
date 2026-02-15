import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Instrument Sans"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(255, 107, 74, 0.25)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        koflix: {
          primary: '#ff6b4a',
          'primary-content': '#0b0d12',
          secondary: '#2dd4bf',
          'secondary-content': '#081118',
          accent: '#fbbf24',
          'accent-content': '#0b0d12',
          neutral: '#1f2937',
          'neutral-content': '#e5e7eb',
          'base-100': '#0b0d12',
          'base-200': '#0f131a',
          'base-300': '#151b24',
          'base-content': '#e5e7eb',
          info: '#38bdf8',
          success: '#22c55e',
          warning: '#f97316',
          error: '#ef4444',
        },
      },
    ],
    darkTheme: 'koflix',
  },
}
