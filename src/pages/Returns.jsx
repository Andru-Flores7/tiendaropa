import { motion } from 'framer-motion'
import './LegalPage.css'

export default function Returns() {
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
        <h1>Cambios y Devoluciones</h1>
        <p className="legal-updated">Última actualización: septiembre 2026</p>

        <section>
          <h2>1. Plazo para cambios</h2>
          <p>Aceptamos cambios dentro de los <strong>30 días corridos</strong> desde la recepción del pedido. Pasado este plazo no podremos procesar cambios ni devoluciones salvo defectos de fabricación.</p>
        </section>

        <section>
          <h2>2. Condiciones de la prenda</h2>
          <p>Para que el cambio o devolución sea aceptado, la prenda debe:</p>
          <ul>
            <li>Estar sin uso, sin lavar y sin alterar</li>
            <li>Conservar todas las etiquetas originales</li>
            <li>Estar en su embalaje original o en condiciones similares</li>
          </ul>
          <p>No aceptamos devoluciones de artículos de temporada pasada, prendas en liquidación o productos que presenten signos de uso.</p>
        </section>

        <section>
          <h2>3. Proceso de cambio</h2>
          <p>Para iniciar un cambio, escribinos por Instagram o al correo de contacto indicando tu número de pedido, el artículo que querés cambiar y el motivo. Te daremos las instrucciones para el envío de devolución.</p>
        </section>

        <section>
          <h2>4. Costos del cambio</h2>
          <p>Los gastos de envío para la devolución corren por cuenta del comprador, salvo que la causa del cambio sea un error nuestro (prenda equivocada, defecto de fabricación, etc.), en cuyo caso nos hacemos cargo del costo.</p>
        </section>

        <section>
          <h2>5. Defectos de fabricación</h2>
          <p>Si la prenda presenta un defecto de fabricación, contactanos dentro de los <strong>60 días</strong> de recibida con fotos del desperfecto. Evaluaremos cada caso y ofreceremos reposición, cambio o nota de crédito según corresponda.</p>
        </section>

        <section>
          <h2>6. Reembolsos</h2>
          <p>Una vez recibida y aprobada la devolución, procesaremos el reembolso en un plazo de 5 a 10 días hábiles a través del mismo medio de pago utilizado en la compra original. Para compras en efectivo o transferencia, coordinaremos el método más conveniente.</p>
        </section>

        <section>
          <h2>7. Contacto</h2>
          <p>Para cualquier consulta sobre cambios y devoluciones podés contactarnos a través de nuestras redes sociales. Respondemos en horario comercial (lunes a viernes, 10:00 a 18:00 hs).</p>
        </section>
      </div>
    </motion.div>
  )
}
