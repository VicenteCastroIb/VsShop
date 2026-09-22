import Layout from '../components/Layout';

export default function PagoPendiente() {
  return (
    <Layout showBottomBar={false}>
      <section className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <h1 className="headline text-4xl">Tu pago está pendiente</h1>
        <p className="mt-4 text-ink/70">
          Mercado Pago está procesando tu pago (por ejemplo, si elegiste transferencia). Te
          avisaremos apenas se confirme.
        </p>
        <a href="/" className="btn-primary mt-8">
          Volver al inicio
        </a>
      </section>
    </Layout>
  );
}
