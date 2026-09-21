import { useState } from 'react'
import { Trash2, ImagePlus } from 'lucide-react'
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

  // Imagen principal
  const [mainImageFile, setMainImageFile] = useState(null)
  // Imágenes adicionales: mezcla de URLs ya guardadas + nuevos Files
  const [extraImages, setExtraImages] = useState(product?.images || [])
  const [extraFiles, setExtraFiles] = useState([])
  const [saving, setSaving] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function uploadFile(file) {
    const ext = file.name.split('.').pop()
    const path = `${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  function handleExtraFilesChange(e) {
    const files = Array.from(e.target.files || [])
    setExtraFiles((prev) => [...prev, ...files])
    e.target.value = '' // reset para poder seleccionar el mismo archivo de nuevo
  }

  function removeExtraUrl(url) {
    setExtraImages((prev) => prev.filter((u) => u !== url))
  }

  function removeExtraFile(idx) {
    setExtraFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      // 1. Imagen principal
      let image_url = product?.image_url || null
      if (mainImageFile) image_url = await uploadFile(mainImageFile)

      // 2. Subir nuevos archivos extra
      const uploadedExtras = await Promise.all(extraFiles.map(uploadFile))

      // 3. Combinar URLs guardadas + recién subidas
      const images = [...extraImages, ...uploadedExtras]

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

        {/* Imagen principal */}
        <div className="field">
          <label htmlFor="pimage">Imagen principal</label>
          <input id="pimage" type="file" accept="image/*" className="input"
            onChange={(e) => setMainImageFile(e.target.files?.[0] || null)} />
          {product?.image_url && !mainImageFile && (
            <img src={product.image_url} alt="" style={{ width: 64, height: 80, objectFit: 'cover', marginTop: 8, borderRadius: 6 }} />
          )}
        </div>

        {/* Imágenes adicionales */}
        <div className="field">
          <label>Imágenes adicionales</label>
          <div className="pf-extra-images">
            {/* Miniaturas de URLs ya guardadas */}
            {extraImages.map((url) => (
              <div key={url} className="pf-thumb">
                <img src={url} alt="" />
                <button type="button" className="pf-thumb-remove" onClick={() => removeExtraUrl(url)} aria-label="Eliminar imagen">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {/* Miniaturas de archivos nuevos pendientes de subir */}
            {extraFiles.map((file, idx) => (
              <div key={idx} className="pf-thumb pf-thumb-pending">
                <img src={URL.createObjectURL(file)} alt="" />
                <button type="button" className="pf-thumb-remove" onClick={() => removeExtraFile(idx)} aria-label="Eliminar imagen">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {/* Botón de añadir */}
            <label className="pf-thumb pf-thumb-add" aria-label="Agregar imágenes">
              <ImagePlus size={20} />
              <span>Agregar</span>
              <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleExtraFilesChange} />
            </label>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-faint)', marginTop: '0.4em' }}>
            {extraImages.length + extraFiles.length} imagen{extraImages.length + extraFiles.length !== 1 ? 'es' : ''} adicional{extraImages.length + extraFiles.length !== 1 ? 'es' : ''}
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
