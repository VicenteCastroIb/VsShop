import Layout from '../components/Layout';
import StatusBlock from '../components/StatusBlock';

export default function PagoFallido() {
  return (
    <Layout>
      <StatusBlock
        title="No pudimos procesar tu pago"
        text="Intenta nuevamente o prueba con otro medio de pago."
      />
    </Layout>
  );
}
