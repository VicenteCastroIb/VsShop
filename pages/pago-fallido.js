import Layout from '../components/Layout';

export default function PagoFallido() {
  return (
    <Layout showBottomBar={false}>
      <section className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <h1 className="headline text-4xl">No pudimos procesar tu pago</h1>
        <p className="mt-4 text-ink/70">Intenta nuevamente o prueba con otro medio de pago.</p>
        <a href="/" className="btn-primary mt-8">
          Volver al inicio
        </a>
      </section>
    </Layout>
  );
}
