import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../utils'
import { useToast } from '../../context/ToastContext'

export default function Categories() {
  const { showToast } = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const { error } = await supabase.from('categories').insert({ name: name.trim(), slug: slugify(name) })
    if (error) showToast('No se pudo crear (¿ya existe?)', 'error')
    else { showToast('Categoría creada', 'success'); setName(''); load() }
    setSaving(false)
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) showToast('No se pudo eliminar', 'error')
    else { showToast('Categoría eliminada', 'success'); load() }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Categorías</h1>
          <p>Organiza tus productos en categorías</p>
        </div>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.8em', maxWidth: 420, marginBottom: 'var(--space-4)' }}>
        <input className="input" placeholder="Nombre de la categoría" value={name}
          onChange={(e) => setName(e.target.value)} />
        <button className="btn btn-primary" disabled={saving}>Añadir</button>
      </form>

      {loading ? (
        <div className="state-block"><div className="spinner" /></div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Nombre</th><th>Slug</th><th></th></tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td>
                    <div className="data-table-actions">
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
