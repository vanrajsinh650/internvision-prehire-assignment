/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      ink: {
        50:  '#f6f5f1',
        100: '#e6e4df',
        200: '#ccc9c2',
        300: '#b0ada4',
        400: '#8c887d',
        500: '#3d3a32',
        600: '#33312a',
        700: '#26241f',
        800: '#1a1915',
        900: '#1a1814',
      },
      ember: {
        50:  '#fdf4f1',
        100: '#fae4de',
        400: '#e8775a',
        500: '#d86142',
        600: '#c45530',
        900: '#7a3118',
      },
      red: {
        500: '#ef4444',
      },
      green: {
        500: '#22c55e',
      }
    },
    fontFamily: {
      display: ['var(--font-fraunces)', 'serif'],
      sans: ['var(--font-ibm-plex)', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
};
