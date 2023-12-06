/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-green': 'linear-gradient(to bottom, #51B400, #000000)',
      },
    },
  },
  plugins: [],
};
