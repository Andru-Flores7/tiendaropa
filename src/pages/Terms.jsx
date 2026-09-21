import { motion } from 'framer-motion'
import './LegalPage.css'

export default function Terms() {
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
        <h1>Términos y Condiciones</h1>
        <p className="legal-updated">Última actualización: septiembre 2026</p>

        <section>
          <h2>1. Aceptación de los términos</h2>
          <p>Al acceder y realizar una compra en Russo Indumentaria, aceptás los presentes términos y condiciones. Si no estás de acuerdo con alguna de estas condiciones, te pedimos que no utilices nuestro sitio.</p>
        </section>

        <section>
          <h2>2. Productos y precios</h2>
          <p>Nos esforzamos por mostrar los colores y materiales de nuestras prendas con la mayor fidelidad posible. Sin embargo, los colores que ves en tu pantalla pueden variar ligeramente respecto al producto real.</p>
          <p>Los precios están expresados en pesos argentinos (ARS) e incluyen IVA. Russo Indumentaria se reserva el derecho de modificar los precios en cualquier momento sin previo aviso.</p>
        </section>

        <section>
          <h2>3. Proceso de compra</h2>
          <p>Al confirmar un pedido, estás realizando una oferta de compra. El contrato de compraventa se perfecciona cuando recibís la confirmación de tu pedido por correo electrónico. El stock se descuenta en el momento de la confirmación.</p>
        </section>

        <section>
          <h2>4. Disponibilidad de stock</h2>
          <p>Todos los artículos están sujetos a disponibilidad. En caso de que un producto no esté disponible después de haberse realizado el pedido, te contactaremos a la brevedad para ofrecerte una alternativa o proceder con el reembolso correspondiente.</p>
        </section>

        <section>
          <h2>5. Propiedad intelectual</h2>
          <p>Todo el contenido de este sitio (imágenes, textos, logotipos, diseños) es propiedad exclusiva de Russo Indumentaria y está protegido por las leyes de propiedad intelectual vigentes en la República Argentina. Queda prohibida su reproducción sin autorización expresa.</p>
        </section>

        <section>
          <h2>6. Limitación de responsabilidad</h2>
          <p>Russo Indumentaria no se responsabiliza por daños indirectos, incidentales o consecuentes derivados del uso del sitio web o de los productos adquiridos, en la máxima medida permitida por la ley aplicable.</p>
        </section>

        <section>
          <h2>7. Ley aplicable</h2>
          <p>Estos términos se rigen por la legislación vigente en la República Argentina. Cualquier controversia será sometida a los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.</p>
        </section>

        <section>
          <h2>8. Contacto</h2>
          <p>Para consultas sobre estos términos podés escribirnos a través de nuestras redes sociales o al correo electrónico de contacto disponible en el pie de página.</p>
        </section>
      </div>
    </motion.div>
  )
}
