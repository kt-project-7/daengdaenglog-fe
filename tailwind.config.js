/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['Pretendard', 'sans-serif'],
        body: ['Pretendard', 'sans-serif'],
      },
      colors: {
        primary: '#CCB392',
        _black: '#313131',
        _red: '#EA4141',
        '_gray-100': '#F4F4F4',
        '_gray-200': '#D2D2D2',
        '_gray-300': '#929292',
        '_gray-400': '#626262',
        '_gray-500': '#6B7280',
        '_gray-600': '#4B5563',
        '_gray-700': '#374151',
        '_gray-800': '#1F2937',
        '_blue-50': '#EFF6FF',
        '_blue-100': '#DBEAFE',
        '_blue-400': '#60A5FA',
        '_blue-500': '#3B82F6',
        '_blue-600': '#2563EB',
        '_blue-700': '#1D4ED8',
        '_green-50': '#ECFDF5',
        '_green-100': '#D1FAE5',
        '_green-500': '#10B981',
        '_green-600': '#059669',
        '_green-700': '#047857',
        // 댕머니차트 색상
        dang: {
          primary: '#f59e0b',
          secondary: '#d97706',
          light: '#fff9e9',
          background: '#fffdf7',
          pending: '#fef3c7',
          'pending-text': '#92400e',
          approved: '#d1fae5',
          'approved-text': '#065f46',
          rejected: '#fee2e2',
          'rejected-text': '#b91c1c',
          'claim-background': '#f59e0b',
        },
        chart: {
          category1: '#f59e0b',
          category2: '#fbbf24',
          category3: '#fcd34d',
          category4: '#fde68a',
          category5: '#fef3c7',
        },
      },
      boxShadow: {
        'dang-sm': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'dang-md': '0 4px 10px rgba(0, 0, 0, 0.1)',
        'dang-lg': '0 10px 15px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'bounce-custom': 'bounce 1s ease infinite',
        'bounce-delay-1': 'bounce 1s ease 0.2s infinite',
        'bounce-delay-2': 'bounce 1s ease 0.4s infinite',
        'bounce-delay-3': 'bounce 1s ease 0.6s infinite',
        'bounce-delay-4': 'bounce 1s ease 0.8s infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
    },
  },
  plugins: [],
}
