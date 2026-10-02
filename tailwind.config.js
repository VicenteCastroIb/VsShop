/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "negro elegante". Para re-tematizar por temporada cambia
        // estos hex (y los mismos valores en styles/globals.css).
        night: '#0a0a0b', // fondo de la página
        surface: '#141416', // tarjetas y secciones destacadas
        raised: '#1e1e21', // elementos sobre una tarjeta
        ivory: '#f4f1ea', // texto principal
        muted: '#a9a49b', // texto secundario
        gold: '#c9a55c', // acento: precios, botones, detalles
        tile: '#f5f5f5', // fondo de las fotos de producto
      },
      fontFamily: {
        // Logo condensado.
        display: ['Anton', 'Impact', 'sans-serif'],
        // Titulares, texto e interfaz.
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
