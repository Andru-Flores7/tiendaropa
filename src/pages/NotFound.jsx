import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react'
import './NotFound.css'

export default function NotFound() {
  return (
    <motion.div
      className="notfound-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="notfound-inner">
        <div className="notfound-code">404</div>
        <h1>Página no encontrada</h1>
        <p>La dirección que buscás no existe o fue movida.<br />Podés volver al inicio o explorar la tienda.</p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            Ir al inicio
          </Link>
          <Link to="/tienda" className="btn btn-outline">
            <ShoppingBag size={18} />
            Ver la tienda
          </Link>
        </div>
        <Link to={-1} className="notfound-back">
          <ArrowLeft size={14} />
          Volver atrás
        </Link>
      </div>
    </motion.div>
  )
}
