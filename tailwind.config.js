module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        success: "#2ecc71",
        error: "#e74c3c",
        warning: "#f39c12",
        info: "#3498db",
        gray: {
          50: "rgba(249, 250, 251)",
          100: "rgba(243, 244, 246)",
          600: "rgba(75, 85, 99)",
          700: "rgba(55, 65, 81)",
          800: "rgba(31, 41, 55)",
          900: "rgba(17, 24, 39)",
        },
        red: {
          700: "rgba(185, 28, 28)",
        },
        green: {
          700: "rgba(4, 120, 87)",
        },
        blue: {
          400: "rgba(96, 165, 250)",
          500: "rgba(59, 130, 246)",
        },
      },
      textColor: {
        gray: {
          50: "rgba(249, 250, 251)",
          100: "rgba(243, 244, 246)",
          200: "rgba(229, 231, 235)",
          400: "rgba(156, 163, 175)",
          500: "rgba(107, 114, 128)",
          700: "rgba(55, 65, 81)",
        },
        red: {
          100: "rgba(254, 226, 226)",
        },
        green: {
          100: "rgba(209, 250, 229)",
        },
        blue: {
          400: "rgba(96, 165, 250)",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
