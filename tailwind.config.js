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
        // El color de acento se controla con la variable CSS --accent
        // (styles/globals.css). Cámbialo una sola vez ahí para re-tematizar
        // toda la tienda por temporada.
        accent: 'var(--accent)',
        ink: '#1b1816',
        paper: '#efe9e3',
      },
      fontFamily: {
        // Titulares condensados y pesados (estilo streetwear).
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        // Texto e interfaz.
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
