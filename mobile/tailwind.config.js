/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        moveRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100px)" }, // Adjust the distance as needed
        },
        moveLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100px)" },
        },
      },
      animation: {
        moveRight: "moveRight 1s ease-in-out infinite", // Customize duration and timing function
        moveLeft: "moveLeft 1s ease-in-out infinite", // Customize duration and timing function
      },
      colors:{
        status_reject_text: "#991b1b",
        status_reject_bg: "#fee2e2",
        status_reject_border: "#dc2626",
        
        status_aprv_text: "#166534",
        status_aprv_bg: "#dcfce7",
        status_aprv_border: "#16a34a",
      }
    },
  },
  plugins: [],
};
