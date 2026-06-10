/** @type {import('tailwindcss').Config} */
module.exports = {
  // The content array paths point to all components and screens in the src directory
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
