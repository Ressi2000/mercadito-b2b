/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Paleta corporativa GesRutas Auto / Sindoni — azul profundo,
          // dorado y un acento rojo italiano (bandera), extraída del
          // empaque real de producto (fondo navy, cinta dorada, ribete negro).
          neutral: {
            50: '#f3f5f9',
            100: '#e8ecf5',
            200: '#e3e7f0',
            300: '#c7cee0',
            400: '#9aa6c2',
            500: '#6b7690',
            600: '#4d5876',
            700: '#334066',
            800: '#123059',
            900: '#0a1a35',
          },
          primary: {
            50: '#fdf8ec',
            100: '#faedc7',
            200: '#f4d78e',
            300: '#eabf56',
            400: '#deab3c',
            500: '#d4a72c',
            600: '#ba8c22',
            700: '#a5791a',
            800: '#7d5c15',
            900: '#5c4310',
          },
          accent: {
            50: '#fdecee',
            100: '#fad0d4',
            200: '#f2a3ab',
            300: '#e8747f',
            400: '#dc4a56',
            500: '#ce2b37',
            600: '#b32029',
            700: '#8f1922',
            800: '#6e141b',
            900: '#521015',
          },
        },
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'Inter Variable', 'system-ui', 'sans-serif'],
        body: ['Inter Variable', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};