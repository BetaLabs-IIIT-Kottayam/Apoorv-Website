module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        shippori: ["Shippori Mincho", "serif"],
        noto: ["Noto Sans JP", "sans-serif"],
      },
      colors: {
        primary: "#B22222", // Red
        secondary: "#000000", // Black
        accent: "#FFFFFF", // White
      },
    },
  },
  plugins: [],
};