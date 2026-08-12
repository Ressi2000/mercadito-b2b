/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Paleta corporativa GesRutas iClient / Sindoni — azul profundo,
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
            // Dorado brillante — evita el tono oliva/opaco de la v1.
            50: '#fffbea',
            100: '#fff3c4',
            200: '#ffe588',
            300: '#ffd24d',
            400: '#ffbe0b',
            500: '#f2a900',
            600: '#d99500',
            700: '#b37a00',
            800: '#8a5f00',
            900: '#614300',
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
        'split-word': 'splitWord 0.7s cubic-bezier(0.22,1,0.36,1) both',
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
        splitWord: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};