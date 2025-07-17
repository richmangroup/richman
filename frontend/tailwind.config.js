/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        slideFadeLoop: {
          '0%': { transform: 'translateX(0)', opacity: '0' },
          '20%': { transform: 'translateX(400px)', opacity: '1' },
          '80%': { transform: 'translateX(400px)', opacity: '1' },
          '100%': { transform: 'translateX(400px)', opacity: '0' },
        },
        scrollUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-300%)' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        slideFadeLoop: 'slideFadeLoop 8s ease-in-out infinite',
        scrollUp: 'scrollUp 120s linear infinite', // ✅ Add scrollUp here
      },
    },
  },
  plugins: [],
}

