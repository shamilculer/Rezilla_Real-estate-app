/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-colour": "#3A0CA3",
        "color1": "#4361EE",
        "color2": "#4CC9F0",
        "color3": "#7209B7",
        "color4": "#F72585",
        "text-color-1": "#0B090A",
        "text-color-2": "#2B2B2B",
        "text-color-3": "#808080",
        "text-color-4": "#AAA",
        "text-color-5": "#D4D4D4",
        "lightestBlue": "rgba(67, 97, 238, 0.30);"
      },
      boxShadow: {
        'custom-shadow': '1px 1px 30px 8px rgba(0,0,0,0.25)',
      },
      keyframes: {
        'opacity': {

          'from': {
            opacity: '0'
          },
          'to': {
            opacity: '1'
          }
        },
        'contentShow': {
          'from': {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)'
          },
          'to': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)'
          }
        },
        'toTop': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        "slideRight" : {
          '0%': {transform: 'translateX(-100%)' },
          '100%': {transform: 'translateX(0%)' }
        }
      },
      animation: {
        'spin-slow': 'spin 7s linear infinite',
        'opacity': 'opacity 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'contentShow': 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);',
        'toTop': 'toTop 350ms ease-in-out',
        'slideRight': 'slideRight 250ms cubic-bezier(0.16, 1, 0.3, 1);',
      },
      gridTemplateColumns: {
        'auto-fit-card': 'repeat(auto-fit, minmax(500px, 1fr))',
      },
    },
  },
  plugins: [

  ],
}

