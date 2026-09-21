import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatPrice } from '../utils'
import './ProductDetail.css'

export default function ProductDetail() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const { showToast } = useToast()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
      .then(({ data }) => {
        setProduct(data)
        setSize(data?.sizes?.[0] || '')
        setColor(data?.colors?.[0] || '')
        setLoading(false)
      })
  }, [slug])

  if (loading) return <div className="state-block"><div className="spinner" /></div>

  if (!product) {
    return (
      <div className="state-block">
        <h3>Producto no encontrado</h3>
        <Link to="/tienda" className="btn btn-outline">Volver a la tienda</Link>
      </div>
    )
  }

  const gallery = [product.image_url, ...(product.images || [])].filter(Boolean)
  const outOfStock = product.stock === 0

  function handleAdd() {
    if (product.sizes?.length && !size) return showToast('Elige una talla', 'error')
    if (product.colors?.length && !color) return showToast('Elige un color', 'error')
    addItem(product, { size, color, quantity: 1 })
    showToast('Añadido al carrito', 'success')
  }

  return (
    <div className="container product-detail">
      <div className="product-detail-gallery">
        <div className="product-detail-main-image">
          {gallery[activeImage]
            ? <img src={gallery[activeImage]} alt={product.name} />
            : <div className="product-card-placeholder">Alma</div>}
        </div>
        {gallery.length > 1 && (
          <div className="product-detail-thumbs">
            {gallery.map((src, i) => (
              <button
                key={i}
                className={i === activeImage ? 'active' : ''}
                onClick={() => setActiveImage(i)}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="product-detail-price">{formatPrice(product.price)}</p>
        {product.description && <p className="product-detail-desc">{product.description}</p>}

        {product.sizes?.length > 0 && (
          <div className="product-detail-option">
            <span>Talla</span>
            <div className="option-pills">
              {product.sizes.map((s) => (
                <button key={s} className={s === size ? 'active' : ''} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {product.colors?.length > 0 && (
          <div className="product-detail-option">
            <span>Color</span>
            <div className="option-pills">
              {product.colors.map((c) => (
                <button key={c} className={c === color ? 'active' : ''} onClick={() => setColor(c)}>{c}</button>
              ))}
            </div>
          </div>
        )}

        <button className="btn btn-primary btn-full" disabled={outOfStock} onClick={handleAdd}>
          {outOfStock ? 'Agotado' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  )
}
