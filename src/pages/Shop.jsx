import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useProducts, useCategories, PAGE_SIZE } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import './Shop.css'

const gridVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function Shop() {
  const [categorySlug, setCategorySlug] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [debounceTimer, setDebounceTimer] = useState(null)

  const { products, total, loading } = useProducts({ categorySlug, search: debouncedSearch, page })
  const { categories } = useCategories()

  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Debounce para no disparar fetch con cada tecla
  const handleSearch = useCallback((val) => {
    setSearch(val)
    setPage(1)
    clearTimeout(debounceTimer)
    const t = setTimeout(() => setDebouncedSearch(val), 350)
    setDebounceTimer(t)
  }, [debounceTimer])

  function changeCategory(slug) {
    setCategorySlug(slug)
    setPage(1)
    setSearch('')
    setDebouncedSearch('')
  }

  function changePage(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.div
      className="container shop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="shop-header">
        <div>
          <h1 className="shop-title">Tienda</h1>
          <p>{loading ? '…' : `${total} ${total === 1 ? 'producto' : 'productos'}`}</p>
        </div>

        {/* Buscador */}
        <div className="shop-search">
          <Search size={16} className="shop-search-icon" />
          <input
            id="shop-search-input"
            type="search"
            placeholder="Buscar productos…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="shop-search-input"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                className="shop-search-clear"
                onClick={() => handleSearch('')}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                aria-label="Limpiar búsqueda"
              >
                <X size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Filtros de categoría */}
      <div className="shop-filters">
        <button
          className={!categorySlug ? 'active' : ''}
          onClick={() => changeCategory(null)}
        >
          Todo
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={categorySlug === c.slug ? 'active' : ''}
            onClick={() => changeCategory(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      {loading ? (
        <div className="state-block"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="state-block">
          <h3>{debouncedSearch ? `Sin resultados para "${debouncedSearch}"` : 'No hay productos en esta categoría'}</h3>
          <p>Probá con otro filtro o búsqueda.</p>
        </div>
      ) : (
        <motion.div
          className="product-grid"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          key={`${categorySlug}-${debouncedSearch}-${page}`}
        >
          {products.map((p) => (
            <motion.div key={p.id} variants={cardVariants}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="shop-pagination">
          <button
            className="pagination-btn"
            onClick={() => changePage(page - 1)}
            disabled={page === 1}
            aria-label="Página anterior"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`pagination-btn ${p === page ? 'active' : ''}`}
              onClick={() => changePage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => changePage(page + 1)}
            disabled={page === totalPages}
            aria-label="Página siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </motion.div>
  )
}

