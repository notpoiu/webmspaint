const config = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
  safelist: [
    {
      pattern: /sm:/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
  ]
}

export default config;
