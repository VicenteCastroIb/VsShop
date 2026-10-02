import Layout from '../components/Layout';
import StatusBlock from '../components/StatusBlock';

export default function PagoPendiente() {
  return (
    <Layout>
      <StatusBlock
        title="Tu pago está pendiente"
        text="Mercado Pago está procesando tu pago (por ejemplo, si elegiste transferencia). Te avisaremos apenas se confirme."
      />
    </Layout>
  );
}
