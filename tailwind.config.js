/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // يمكنك حذف هذا السطر
    './app/**/*.{js,ts,jsx,tsx,mdx}', // <--- تم إضافة هذا
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};