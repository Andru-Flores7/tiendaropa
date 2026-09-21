import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import './Home.css'

export default function Home() {
  const { products, loading } = useProducts()
  const featured = products.slice(0, 4)

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <p className="hero-eyebrow">Colección actual</p>
          <h1>Piezas simples,<br />pensadas para durar.</h1>
          <p className="hero-copy">
            Telas naturales, cortes limpios y colores que no pasan de moda.
            Ropa hecha para ponerse todos los días, no solo para la foto.
          </p>
          <Link to="/tienda" className="btn btn-primary">Ver la tienda</Link>
        </div>
      </section>

      <section className="container featured">
        <div className="featured-head">
          <h2>Recién llegado</h2>
          <Link to="/tienda">Ver todo →</Link>
        </div>

        {loading ? (
          <div className="state-block"><div className="spinner" /></div>
        ) : featured.length === 0 ? (
          <div className="state-block">
            <h3>Todavía no hay productos</h3>
            <p>Agrega productos desde el panel de administración para que aparezcan aquí.</p>
          </div>
        ) : (
          <div className="product-grid">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
