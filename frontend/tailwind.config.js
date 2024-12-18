/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "inter": ["Inter", "sans-serif"]
      },
      colors: {
        'custom-blue': '#100A55',
        'hover-color': '#1A0C63',
        'custom-white':'#FFFFFF',
        'custom-backGround':'#ffffff',
        'custom-backGround-content':'#F2EFFF',
        'custom-text-color':'#334155',
        'custom-number-color':'#000929',
        'custom-shadow':'#1E1E1E',
        'custom-white-background':'#FFFFFF',
        'text-field': '#F2F2F2',
        // dropdown: '#EFECFF',
        // selected: '#E4DFFF',
        // sidebar: '#FFFFFF',
        // searchBar: '#F8FAFC',
        // tableHeading: '#000929',
        // tableData: '#475569',

      },
    },
  },
  plugins: [],
}