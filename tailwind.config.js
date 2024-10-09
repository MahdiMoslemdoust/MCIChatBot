/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/*.{js,ts,jsx,tsx,mdx}",
    "./src/**",
  ],
  theme: {
    extend: {
      backgroundImage: {},
      boxShadow: {
        custom: "2px 4px 16px 0 rgba(56, 86, 122, 0.1)",
      },
    },
  },
  plugins: [],
};
