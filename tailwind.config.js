/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f4f7f4',
          100: '#e5ece5',
          200: '#cbd8cb',
          300: '#a3beaa',
          400: '#759e80',
          500: '#528260',
          600: '#3f674c',
          700: '#33523e',
          800: '#2c4334',
          900: '#1b2d22',
          950: '#0c1711',
        },
        earth: {
          50: '#faf8f5',
          100: '#f3ede2',
          200: '#e6dac7',
          300: '#d4bf9f',
          400: '#c0a077',
          500: '#b0875b',
          600: '#9b714b',
          700: '#7b573d',
          800: '#644735',
          900: '#533c2e',
        },
        ambermoss: {
          500: '#c88a38',
          600: '#b07328',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 6s ease-in-out infinite',
        'subtle-pulse': 'subtlePulse 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
};
