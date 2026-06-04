import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      boxShadow: {
        dashboard: '0 1px 2px rgba(15, 23, 42, 0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config;
