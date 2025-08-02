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
    // Ensure spacing utilities are never purged
    'gap-4',
    'gap-6',
    'sm:gap-6',
    'space-x-6',
    'space-y-4',
    'sm:space-y-0',
    'sm:space-x-6',
    'mb-4',
    'sm:mb-0',
    'sm:ml-6',
    'mt-4',
    'mt-6',
    'flex-shrink-0',
    'mx-auto',
    'sm:mx-0'
  ]
}

export default config;
