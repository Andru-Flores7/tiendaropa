import { useState } from 'react'
import Modal from '../../components/Modal'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../utils'
import { useToast } from '../../context/ToastContext'

const emptyForm = {
  name: '', description: '', price: '', compare_at_price: '',
  category_id: '', stock: '0', sizes: '', colors: '', is_active: true,
}

export default function ProductForm({ product, categories, onClose, onSaved }) {
  const { showToast } = useToast()
  const [form, setForm] = useState(() =>
    product
      ? {
          name: product.name,
          description: product.description || '',
          price: product.price,
          compare_at_price: product.compare_at_price || '',
          category_id: product.category_id || '',
          stock: product.stock,
          sizes: (product.sizes || []).join(', '),
          colors: (product.colors || []).join(', '),
          is_active: product.is_active,
        }
      : emptyForm
  )
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function uploadImage() {
    const ext = imageFile.name.split('.').pop()
    const path = `${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, imageFile)
    if (error) throw error
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      let image_url = product?.image_url || null
      if (imageFile) image_url = await uploadImage()

      const payload = {
        name: form.name,
        slug: slugify(form.name),
        description: form.description,
        price: Number(form.price),
        compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
        category_id: form.category_id || null,
        stock: Number(form.stock),
        sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [],
        colors: form.colors ? form.colors.split(',').map((s) => s.trim()).filter(Boolean) : [],
        is_active: form.is_active,
        image_url,
      }

      const { error } = product
        ? await supabase.from('products').update(payload).eq('id', product.id)
        : await supabase.from('products').insert(payload)

      if (error) throw error
      showToast(product ? 'Producto actualizado' : 'Producto creado', 'success')
      onSaved()
    } catch (err) {
      showToast(err.message || 'No se pudo guardar el producto', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={product ? 'Editar producto' : 'Nuevo producto'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="pname">Nombre</label>
          <input id="pname" className="input" required value={form.name}
            onChange={(e) => update('name', e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="pdesc">Descripción</label>
          <textarea id="pdesc" className="input" value={form.description}
            onChange={(e) => update('description', e.target.value)} />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="pprice">Precio</label>
            <input id="pprice" type="number" step="0.01" min="0" className="input" required
              value={form.price} onChange={(e) => update('price', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="pcompare">Precio anterior (oferta)</label>
            <input id="pcompare" type="number" step="0.01" min="0" className="input"
              value={form.compare_at_price} onChange={(e) => update('compare_at_price', e.target.value)} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="pstock">Stock</label>
            <input id="pstock" type="number" min="0" className="input" required
              value={form.stock} onChange={(e) => update('stock', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="pcat">Categoría</label>
            <select id="pcat" className="input" value={form.category_id}
              onChange={(e) => update('category_id', e.target.value)}>
              <option value="">Sin categoría</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="psizes">Tallas (separadas por coma)</label>
            <input id="psizes" className="input" placeholder="XS, S, M, L, XL"
              value={form.sizes} onChange={(e) => update('sizes', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="pcolors">Colores (separados por coma)</label>
            <input id="pcolors" className="input" placeholder="Negro, Blanco"
              value={form.colors} onChange={(e) => update('colors', e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="pimage">Imagen principal</label>
          <input id="pimage" type="file" accept="image/*" className="input"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          {product?.image_url && !imageFile && (
            <img src={product.image_url} alt="" style={{ width: 64, height: 80, objectFit: 'cover', marginTop: 8, borderRadius: 4 }} />
          )}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em', fontSize: '0.88rem', marginBottom: 'var(--space-3)' }}>
          <input type="checkbox" checked={form.is_active}
            onChange={(e) => update('is_active', e.target.checked)} />
          Producto visible en la tienda
        </label>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar producto'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
