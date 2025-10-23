/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#1e293b',
      },
      backgroundImage: {
        'auth-bg': "linear-gradient(to right, #2563eb, #1e3a8a)",
      },
    },
  },
  plugins: [],
};
