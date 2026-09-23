import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, ShoppingBag, Menu, X } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const { count, setIsOpen } = useCart()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() { setMenuOpen(false) }

  return (
    <header className="navbar glass">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>Russo Indumentaria</Link>

        {/* Links desktop */}
        <nav className="navbar-links">
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Inicio</NavLink>
          <NavLink to="/tienda" className={({isActive}) => isActive ? 'active' : ''}>Tienda</NavLink>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>          <button className="navbar-btn navbar-cart" onClick={() => setIsOpen(true)} aria-label="Abrir carrito">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && <span className="navbar-cart-count">{count}</span>}
          </button>

          {/* Botón hamburguesa — solo móvil */}
          <button
            className="navbar-btn navbar-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="navbar-mobile-menu glass"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <NavLink to="/" end onClick={closeMenu} className={({isActive}) => isActive ? 'active' : ''}>
              Inicio
            </NavLink>
            <NavLink to="/tienda" onClick={closeMenu} className={({isActive}) => isActive ? 'active' : ''}>
              Tienda
            </NavLink>
            <div className="navbar-mobile-divider" />
            <NavLink to="/terminos" onClick={closeMenu}>Términos y condiciones</NavLink>
            <NavLink to="/envios" onClick={closeMenu}>Política de envíos</NavLink>
            <NavLink to="/devoluciones" onClick={closeMenu}>Cambios y devoluciones</NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

