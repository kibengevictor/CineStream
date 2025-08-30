/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'netflix-red': '#E50914',
        'netflix-black': '#141414',
        'netflix-gray': '#2F2F2F',
        'netflix-light-gray': '#808080',
        'netflix-dark-gray': '#1a1a1a',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-out',
        'slideIn': 'slideIn 0.5s ease-out',
        'pulse-custom': 'pulse 2s infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(229, 9, 20, 0.3)',
        'glow-lg': '0 0 40px rgba(229, 9, 20, 0.4)',
        'netflix': '0 4px 30px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(229, 9, 20, 0.1) 100%)',
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
