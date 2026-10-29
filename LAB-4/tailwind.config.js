export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { page: '#F3F4F6', ink: '#0F172A', navy: '#1E293B', brand: '#2563EB' },
    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    boxShadow: { card: '0 1px 3px rgba(15,23,42,.06)' }
  } },
  plugins: []
}
