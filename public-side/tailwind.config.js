/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          50: '#F8F6F4',
          100: '#ECE8E4',
          200: '#D8CDC4',
          300: '#B8A496',
          400: '#7A6251',
          500: '#4D382A',
          600: '#3B2A20', // Main espresso
          700: '#2F2119',
          800: '#241811',
          900: '#180F0A',
        },
        cream: {
          50: '#FDFAF6',
          100: '#F6EFE6', // Main cream
          200: '#EDE2D4',
          300: '#DECDB9',
          400: '#CBB399',
          500: '#B59B7E',
        },
        terracotta: {
          50: '#FAF1ED',
          100: '#F4DFD7',
          200: '#E9BCAC',
          300: '#DC957F',
          400: '#D07656',
          500: '#C8643B', // Main terracotta
          600: '#AF512B',
          700: '#903E1C',
          800: '#722F15',
        },
        sage: {
          50: '#F4F6F3',
          100: '#E7ECE5',
          200: '#CFDBCB',
          300: '#B6C9B0',
          400: '#A8B5A0', // Main soft sage
          500: '#84967A',
          600: '#5A6F50',
          700: '#41523B',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(59, 42, 32, 0.06)',
        'warm-md': '0 4px 14px -2px rgba(59, 42, 32, 0.08), 0 2px 6px -1px rgba(59, 42, 32, 0.04)',
        'warm-lg': '0 12px 28px -4px rgba(59, 42, 32, 0.12), 0 4px 10px -2px rgba(59, 42, 32, 0.06)',
      },
      maxWidth: {
        'content': '1200px',
      }
    },
  },
  plugins: [],
}
