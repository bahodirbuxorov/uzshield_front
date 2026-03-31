/** @type {import('tailwindcss').Config} */
// Note: Tailwind v4 primarily uses CSS-first configuration via @theme in globals.css.
// This file is kept for IDE tooling compatibility only.
const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
}

export default config
