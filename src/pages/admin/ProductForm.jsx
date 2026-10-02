import { useState } from 'react'
import { Trash2, ImagePlus, Star } from 'lucide-react'
import Modal from '../../components/Modal'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../utils'
import { useToast } from '../../context/ToastContext'

const emptyForm = {
  name: '', description: '', price: '', compare_at_price: '',
  category_id: '', stock: '0', sizes: '', colors: '', is_active: true,
}

// Construye el pool inicial a partir del producto existente
function buildInitialPool(product) {
  const pool = []
  if (product?.image_url) pool.push({ type: 'url', value: product.image_url })
  for (const url of product?.images || []) {
    if (url) pool.push({ type: 'url', value: url })
  }
  return pool
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

  // Pool unificado: [0] = imagen principal, resto = adicionales
  const [imagePool, setImagePool] = useState(() => buildInitialPool(product))
  const [newUrl, setNewUrl] = useState('')
  const [saving, setSaving] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleFilesAdd(e) {
    const files = Array.from(e.target.files || [])
    const newItems = files.map((file) => ({
      type: 'file',
      file,
      preview: URL.createObjectURL(file),
    }))
    setImagePool((prev) => [...prev, ...newItems])
    e.target.value = ''
  }

  function handleUrlAdd() {
    if (!newUrl.trim()) return
    setImagePool((prev) => [...prev, { type: 'url', value: newUrl.trim() }])
    setNewUrl('')
  }

  function removeImage(idx) {
    setImagePool((prev) => prev.filter((_, i) => i !== idx))
  }

  // Mueve la imagen al índice 0 para hacerla principal
  function makeMain(idx) {
    setImagePool((prev) => {
      const next = [...prev]
      const [item] = next.splice(idx, 1)
      next.unshift(item)
      return next
    })
  }

  async function uploadFile(file) {
    const ext = file.name.split('.').pop()
    const path = `${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { contentType: file.type, upsert: false })
    if (error) {
      console.error('[uploadFile] Supabase storage error:', error)
      throw new Error(`Error al subir imagen: ${error.message}`)
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      // Resolver todo el pool a URLs finales (subir archivos, mantener URLs)
      const resolvedUrls = await Promise.all(
        imagePool.map(async (item) => {
          if (item.type === 'url') return item.value
          return await uploadFile(item.file)
        })
      )

      // [0] = imagen principal, el resto = galería adicional
      const image_url = resolvedUrls[0] || null
      const images = resolvedUrls.slice(1)

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
        images,
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

        {/* ── Imágenes (pool unificado) ── */}
        <div className="field">
          <label>
            Imágenes
            <span style={{ fontWeight: 400, color: 'var(--ink-faint)', marginLeft: '0.4em', fontSize: '0.8rem' }}>
              — la primera ⭐ es la portada del producto
            </span>
          </label>

          <div className="pf-extra-images">
            {imagePool.map((item, idx) => {
              const src = item.type === 'url' ? item.value : item.preview
              const isMain = idx === 0
              return (
                <div key={idx} className={`pf-thumb ${isMain ? 'pf-thumb-main' : ''}`}>
                  <img src={src} alt="" />
                  {isMain && (
                    <span className="pf-thumb-badge" title="Imagen principal">⭐</span>
                  )}
                  {!isMain && (
                    <button
                      type="button"
                      className="pf-thumb-star"
                      onClick={() => makeMain(idx)}
                      title="Hacer principal"
                      aria-label="Hacer imagen principal"
                    >
                      <Star size={11} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="pf-thumb-remove"
                    onClick={() => removeImage(idx)}
                    aria-label="Eliminar imagen"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )
            })}

            {/* Botón añadir archivos */}
            <label className="pf-thumb pf-thumb-add" aria-label="Agregar imágenes">
              <ImagePlus size={20} />
              <span>Agregar</span>
              <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFilesAdd} />
            </label>
          </div>

          {/* Añadir por URL */}
          <div style={{ display: 'flex', gap: '0.5em', marginTop: '0.5em' }}>
            <input
              type="url"
              className="input"
              placeholder="Añadir imagen por URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlAdd())}
            />
            <button type="button" className="btn btn-outline btn-sm" onClick={handleUrlAdd}>
              Añadir URL
            </button>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--ink-faint)', marginTop: '0.4em' }}>
            {imagePool.length === 0
              ? 'Sin imágenes — agrega al menos una para mostrar el producto'
              : `${imagePool.length} imagen${imagePool.length !== 1 ? 'es' : ''} — la primera se usará como portada`}
          </p>
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

