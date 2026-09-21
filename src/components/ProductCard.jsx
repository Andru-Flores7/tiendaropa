import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { formatPrice } from '../utils'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const onSale = product.compare_at_price && product.compare_at_price > product.price

  const handleQuickAdd = (e) => {
    e.preventDefault()
    addToCart(product, 1)
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
    </Link>
  )
}
