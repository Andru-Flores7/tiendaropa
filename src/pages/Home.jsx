import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import './Home.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

export default function Home() {
  const { products, loading } = useProducts()
  const featured = products.slice(0, 4)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
      <section className="hero">
        <motion.div 
          className="container hero-inner"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="hero-eyebrow" variants={fadeInUp}>Colección actual</motion.p>
          <motion.h1 variants={fadeInUp}>Piezas simples,<br />pensadas para durar.</motion.h1>
          <motion.p className="hero-copy" variants={fadeInUp}>
            Telas naturales, cortes limpios y colores que no pasan de moda.
            Ropa hecha para ponerse todos los días, no solo para la foto.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link to="/tienda" className="btn btn-primary">Ver la tienda</Link>
          </motion.div>
        </motion.div>
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
          <motion.div 
            className="product-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {featured.map((p) => (
              <motion.div key={p.id} variants={fadeInUp}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </motion.div>
  )
}
