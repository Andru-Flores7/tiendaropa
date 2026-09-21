import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../utils'
import { useToast } from '../../context/ToastContext'
import ProductForm from './ProductForm'

export default function Products() {
  const { showToast } = useToast()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    setProducts(prods || [])
    setCategories(cats || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openNew() { setEditing(null); setShowForm(true) }
  function openEdit(p) { setEditing(p); setShowForm(true) }

  async function handleDelete(id) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) showToast('No se pudo eliminar', 'error')
    else { showToast('Producto eliminado', 'success'); load() }
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Productos</h1>
          <p>{products.length} productos en total</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Nuevo producto</button>
      </div>

      {loading ? (
        <div className="state-block"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="state-block">
          <h3>Aún no tienes productos</h3>
          <p>Crea el primero para que aparezca en tu tienda.</p>
          <button className="btn btn-outline" onClick={openNew}>+ Nuevo producto</button>
        </div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th></th><th>Nombre</th><th>Categoría</th><th>Precio</th>
                <th>Stock</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ width: 40, height: 50, borderRadius: 4, overflow: 'hidden', background: 'var(--paper-soft)' }}>
                      {p.image_url && <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                  </td>
                  <td>{p.name}</td>
                  <td>{p.categories?.name || '—'}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`badge ${p.is_active ? 'badge-moss' : ''}`}>
                      {p.is_active ? 'Activo' : 'Oculto'}
                    </span>
                  </td>
                  <td>
                    <div className="data-table-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Editar</button>
                      {deleteTarget === p.id ? (
                        <>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Confirmar</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(null)}>Cancelar</button>
                        </>
                      ) : (
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(p.id)}>Eliminar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load() }}
        />
      )}
    </div>
  )
}
