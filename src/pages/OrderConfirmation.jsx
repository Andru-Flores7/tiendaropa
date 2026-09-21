import { Link, useLocation } from 'react-router-dom'
import './OrderConfirmation.css'

export default function OrderConfirmation() {
  const { state } = useLocation()

  return (
    <div className="confirmation">
      <div className="confirmation-check">✓</div>
      <h1>Pedido recibido</h1>
      <p>Gracias por tu compra. Te contactaremos por correo para confirmar el envío.</p>
      {state?.orderId && (
        <p className="confirmation-id">Referencia: {state.orderId.slice(0, 8)}</p>
      )}
      <Link to="/tienda" className="btn btn-primary">Seguir comprando</Link>
    </div>
  )
}
