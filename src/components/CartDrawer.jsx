import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils'
import './CartDrawer.css'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total } = useCart()

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setIsOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, setIsOpen])

  if (!isOpen) return null

  return (
    <div className="cart-overlay" onClick={() => setIsOpen(false)}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Carrito de compras"
      >
        <div className="cart-drawer-header">
          <h3>Tu carrito</h3>
          <button className="btn-ghost" onClick={() => setIsOpen(false)} aria-label="Cerrar">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="state-block">
            <p>Tu carrito está vacío.</p>
            <button className="btn btn-outline" onClick={() => setIsOpen(false)}>Seguir viendo</button>
          </div>
        ) : (
          <>
            <ul className="cart-drawer-list">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}-${item.color}`} className="cart-drawer-item">
                  <div className="cart-drawer-item-image">
                    {item.image ? <img src={item.image} alt={item.name} /> : null}
                  </div>
                  <div className="cart-drawer-item-info">
                    <span className="cart-drawer-item-name">{item.name}</span>
                    <span className="cart-drawer-item-meta">
                      {[item.size, item.color].filter(Boolean).join(' · ')}
                    </span>
                    <div className="cart-drawer-qty">
                      <button onClick={() => updateQuantity(item, item.quantity - 1)} aria-label="Restar">−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item, item.quantity + 1)} aria-label="Sumar">+</button>
                    </div>
                  </div>
                  <div className="cart-drawer-item-price">
                    <span>{formatPrice(item.price * item.quantity)}</span>
                    <button className="cart-drawer-remove" onClick={() => removeItem(item)}>Quitar</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-drawer-footer">
              <div className="cart-drawer-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link to="/checkout" className="btn btn-primary btn-full" onClick={() => setIsOpen(false)}>
                Finalizar compra
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
