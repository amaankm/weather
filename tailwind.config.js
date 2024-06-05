/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "wind-gradient":
          "linear-gradient(to right, rgba(255,255,255, 0) 1%, rgba(238,206,206, 0.4) 16.6%, rgba(179,100,188, 0.7) 33.3%, rgba(63,33,59, 0.8) 50%, rgba(116,76,172, 0.9) 66.6%, rgba(70,0,175,1) 83.3%, rgba(13,17,38,1) 100%)",
      },
      animation: {
        "spin-slow": "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
};
