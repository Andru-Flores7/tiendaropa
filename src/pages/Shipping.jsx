import { motion } from 'framer-motion'
import './LegalPage.css'

export default function Shipping() {
  return (
    <motion.div
      className="legal-wrap container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="legal-inner">
        <p className="legal-eyebrow">Legal</p>
        <h1>Política de Envíos</h1>
        <p className="legal-updated">Última actualización: septiembre 2026</p>

        <section>
          <h2>1. Zonas de envío</h2>
          <p>Enviamos a todo el territorio de la República Argentina. Para envíos al exterior, contactanos antes de realizar tu pedido para coordinar las condiciones y costos correspondientes.</p>
        </section>

        <section>
          <h2>2. Tiempos de entrega</h2>
          <p>Los pedidos se procesan dentro de las <strong>24 a 48 horas hábiles</strong> posteriores a la confirmación del pago. Una vez despachado, el tiempo estimado de entrega es:</p>
          <ul>
            <li><strong>CABA y GBA:</strong> 2 a 4 días hábiles</li>
            <li><strong>Interior del país:</strong> 5 a 10 días hábiles</li>
          </ul>
          <p>Estos plazos son estimativos y pueden variar por factores ajenos a nuestra empresa (condiciones climáticas, huelgas, alta demanda estacional, etc.).</p>
        </section>

        <section>
          <h2>3. Costos de envío</h2>
          <p>El costo de envío se calcula en función del destino y el peso del paquete. El valor exacto se informará antes de confirmar el pedido. En determinadas épocas del año podemos ofrecer envío gratuito a partir de cierto monto de compra; consultá nuestras redes sociales para las promociones vigentes.</p>
        </section>

        <section>
          <h2>4. Seguimiento del envío</h2>
          <p>Una vez que tu pedido sea despachado, recibirás un número de seguimiento por correo electrónico para que puedas rastrear tu paquete en tiempo real a través del sitio del transportista.</p>
        </section>

        <section>
          <h2>5. Entrega fallida</h2>
          <p>Si el transportista no puede completar la entrega por ausencia del destinatario, dejará un aviso para coordinar una segunda entrega o el retiro en una sucursal. Russo Indumentaria no se responsabiliza por los gastos adicionales generados por entregas fallidas imputables al comprador.</p>
        </section>

        <section>
          <h2>6. Paquetes dañados o extraviados</h2>
          <p>Si tu pedido llega dañado o no llega dentro del plazo estimado, contactanos de inmediato. Gestionaremos el reclamo ante el servicio de envíos para encontrar la mejor solución posible.</p>
        </section>
      </div>
    </motion.div>
  )
}
