/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'obsidian-bg': '#0d1117',
        'obsidian-surface': '#161b22',
        'obsidian-border': '#30363d',
        'obsidian-text': '#e6edf3',
        'obsidian-accent': '#58a6ff',
      },
    },
  },
  plugins: [],
}