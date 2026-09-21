import { useState } from 'react'
import { useProducts, useCategories } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import './Shop.css'

export default function Shop() {
  const [categorySlug, setCategorySlug] = useState(null)
  const { products, loading } = useProducts({ categorySlug })
  const { categories } = useCategories()

  return (
    <div className="container shop">
      <div className="page-head">
        <div>
          <h1 className="shop-title">Tienda</h1>
          <p>{products.length} {products.length === 1 ? 'producto' : 'productos'}</p>
        </div>
      </div>

      <div className="shop-filters">
        <button
          className={!categorySlug ? 'active' : ''}
          onClick={() => setCategorySlug(null)}
        >
          Todo
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={categorySlug === c.slug ? 'active' : ''}
            onClick={() => setCategorySlug(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="state-block"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="state-block">
          <h3>No hay productos en esta categoría</h3>
          <p>Prueba con otro filtro.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
