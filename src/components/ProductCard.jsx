import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, X } from 'lucide-react'
import { formatPrice } from '../utils'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  
  const [showModal, setShowModal] = useState(false)
  const [size, setSize] = useState(product?.sizes?.[0] || '')
  const [color, setColor] = useState(product?.colors?.[0] || '')
  const onSale = product.compare_at_price && product.compare_at_price > product.price

  const handleQuickAdd = (e) => {
    e.preventDefault()
    if (product.sizes?.length > 0 || product.colors?.length > 0) {
      setShowModal(true)
    } else {
      addItem(product, { quantity: 1 })
      showToast('Añadido al carrito', 'success')
    }
  }

  const handleConfirmAdd = (e) => {
    e.preventDefault()
    if (product.sizes?.length && !size) return showToast('Elige una talla', 'error')
    if (product.colors?.length && !color) return showToast('Elige un color', 'error')
    addItem(product, { size, color, quantity: 1 })
    showToast('Añadido al carrito', 'success')
    setShowModal(false)
  }

  return (
    <Link to={`/producto/${product.slug}`} className="product-card">
      <div className="product-card-image">
        {product.image_url
          ? <img src={product.image_url} alt={product.name} loading="lazy" />
          : <div className="product-card-placeholder" aria-hidden="true">Russo Indumentaria</div>}
        {product.stock === 0 && <span className="product-card-tag">Agotado</span>}
        
        {product.stock > 0 && (
          <button className="quick-add-btn" onClick={handleQuickAdd} aria-label="Añadir rápido al carrito">
            <ShoppingCart size={18} strokeWidth={2} />
          </button>
        )}
      </div>
      <div className="product-card-info">
        <h3>{product.name}</h3>
        <div className="product-card-price">
          <span>{formatPrice(product.price)}</span>
          {onSale && <span className="product-card-compare">{formatPrice(product.compare_at_price)}</span>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => { e.preventDefault(); setShowModal(false); }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Añadir {product.name}</h3>
              <button className="btn-ghost" onClick={(e) => { e.preventDefault(); setShowModal(false); }} aria-label="Cerrar"><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {product.sizes?.length > 0 && (
                <div className="field">
                  <label>Talla</label>
                  <div className="option-pills" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {product.sizes.map((s) => (
                      <button 
                        key={s} 
                        className={`btn btn-sm ${s === size ? 'btn-primary' : 'btn-outline'}`} 
                        onClick={(e) => { e.preventDefault(); setSize(s); }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {product.colors?.length > 0 && (
                <div className="field">
                  <label>Color</label>
                  <div className="option-pills" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {product.colors.map((c) => (
                      <button 
                        key={c} 
                        className={`btn btn-sm ${c === color ? 'btn-primary' : 'btn-outline'}`} 
                        onClick={(e) => { e.preventDefault(); setColor(c); }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={(e) => { e.preventDefault(); setShowModal(false); }}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleConfirmAdd}>Añadir al carrito</button>
            </div>
          </div>
        </div>
      )}
    </Link>
  )
}
