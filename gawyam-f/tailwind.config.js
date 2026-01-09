/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './public/index.html'
  ],
  theme: {
    extend: {
      keyframes: {
        popup: {
          '0%': { transform: 'translate(-50%, 150%) scale(0.9)', opacity: '0' },
          '70%': { transform: 'translate(-50%, -10px) scale(1.05)', opacity: '1' },
          '100%': { transform: 'translate(-50%, 0) scale(1)', opacity: '1' },
        },
        popdown: {
          '0%': { transform: 'translate(-50%, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, 150%) scale(0.9)', opacity: '0' },
        }
      },
      animation: {
        'cart-pop': 'popup 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'cart-exit': 'popdown 0.4s ease-in forwards',
      }
    }
  },
  plugins: [],
}
