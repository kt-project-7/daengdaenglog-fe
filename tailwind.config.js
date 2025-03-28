/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        title: ['Pretendard', 'sans-serif'],
        body: ['Pretendard', 'sans-serif'],
      },
      colors: {
        primary: '#0046FF',
        _black: '#313131',
        _red: '#EA4141',
        '_gray-100': '#F4F4F4',
        '_gray-200': '#D2D2D2',
        '_gray-300': '#929292',
        '_gray-400': '#626262',
      },
    },
  },
  plugins: [],
}
