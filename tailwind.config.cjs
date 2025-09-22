/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          25: "#f6fefc",
          50: "#ecfdf9",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
        },
        error: {
          25: "#fef6f6",
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        warning: {
          25: "#fffbeb",
          50: "#fef3c7",
          100: "#fde68a",
          200: "#fcd34d",
          300: "#fbbf24",
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
          700: "#92400e",
          800: "#78350f",
          900: "#571c0c",
        },
        success: {
          25: "#f6ffed",
          50: "#ecfccb",
          100: "#d9f99d",
          200: "#bef264",
          300: "#a3e635",
          400: "#84cc16",
          500: "#65a30d",
          600: "#4d7c0f",
          700: "#3f6212",
          800: "#365314",
          900: "#1d2d0d",
        },
      },
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};









// @type {import('tailwindcss').Config}

// const config = {
//     theme: {
//         extend: {
//             colors: {
//                 primary: {
//                     25 : "#f6fefc",
//                     50 : "#ecfdf9",
//                     100: "#d1fae5",
//                     200: "#a7f3d0",
//                     300: "#6ee7b7",
//                     400: "#34d399",
//                     500: "#10b981",
//                     600: "#059669",
//                     700: "#047857",
//                     800: "#065f46",
//                 },
//                 error: {
//                     25 : "#fef6f6",
//                     50 : "#fef2f2",
//                     100: "#fee2e2",
//                     200: "#fecaca",
//                     300: "#fca5a5",
//                     400: "#f87171",
//                     500: "#ef4444",
//                     600: "#dc2626",
//                     700: "#b91c1c",
//                     800: "#991b1b",
//                     900: "#7f1d1d",
//                 },
//                 warning: {
//                     25 : "#fffbeb",
//                     50 : "#fef3c7",
//                     100: "#fde68a",
//                     200: "#fcd34d",
//                     300: "#fbbf24",
//                     400: "#f59e0b",
//                     500: "#d97706",
//                     600: "#b45309",
//                     700: "#92400e",
//                     800: "#78350f",
//                     900: "#571c0c",
//                 },
//                 success: {
//                     25 : "#f6ffed",
//                     50 : "#ecfccb",
//                     100: "#d9f99d",
//                     200: "#bef264",
//                     300: "#a3e635",
//                     400: "#84cc16",
//                     500: "#65a30d",
//                     600: "#4d7c0f",
//                     700: "#3f6212",
//                     800: "#365314",
//                     900: "#1d2d0d",
//                 },
//                 fontFamily: { inter : "Inter"},
//             },
//         },
//     },
//     plugins: [require("@tailwindcss/forms")],
// }
// module.exports = config;

