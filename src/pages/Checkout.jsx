import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../utils'
import './Checkout.css'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [submitting, setSubmitting] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)

    try {
      // 1. Crear el pedido en orders
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: form.address,
          total,
        })
        .select()
        .single()

      if (orderError) throw new Error('No se pudo crear el pedido.')

      // 2. Insertar los ítems (el trigger de Supabase descuenta stock automáticamente)
      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.id,
        product_name: i.name,
        unit_price: i.price,
        quantity: i.quantity,
        size: i.size || null,
        color: i.color || null,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

      if (itemsError) {
        // El trigger lanzó un error de stock insuficiente u otro problema
        // Borramos el pedido huérfano para no dejar basura en la base de datos
        await supabase.from('orders').delete().eq('id', order.id)

        // El mensaje viene del trigger: "Stock insuficiente para el producto..."
        const msg = itemsError.message?.includes('Stock insuficiente')
          ? itemsError.message
          : 'Uno o más productos no tienen stock suficiente. Revisá tu carrito.'
        throw new Error(msg)
      }

      // 3. Llamar a la Edge Function para enviar emails (no bloqueante)
      // TODO: Descomentar cuando hayas configurado la Edge Function en Supabase
      // supabase.functions
      //   .invoke('notify-order', {
      //     body: {
      //       order_id: order.id,
      //       customer_name: form.name,
      //       customer_email: form.email,
      //       customer_phone: form.phone || null,
      //       shipping_address: form.address,
      //       total,
      //       items: items.map((i) => ({
      //         product_name: i.name,
      //         quantity: i.quantity,
      //         unit_price: i.price,
      //         size: i.size || null,
      //         color: i.color || null,
      //       })),
      //     },
      //   })
      //   .catch((err) => console.warn('Email notification failed:', err))

      clearCart()
      navigate('/pedido-confirmado', { state: { orderId: order.id } })
    } catch (err) {
      showToast(err.message || 'Ocurrió un error al procesar tu pedido.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="state-block">
        <h3>Tu carrito está vacío</h3>
        <Link to="/tienda" className="btn btn-outline">Ir a la tienda</Link>
      </div>
    )
  }

  return (
    <div className="container checkout">
      <h1>Finalizar compra</h1>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Nombre completo</label>
            <input id="name" className="input" required value={form.name}
              onChange={(e) => update('name', e.target.value)} />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="email">Correo</label>
              <input id="email" type="email" className="input" required value={form.email}
                onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="phone">Teléfono</label>
              <input id="phone" className="input" value={form.phone}
                onChange={(e) => update('phone', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="address">Dirección de envío</label>
            <textarea id="address" className="input" required value={form.address}
              onChange={(e) => update('address', e.target.value)} />
          </div>
          <button className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? 'Enviando…' : `Confirmar pedido — ${formatPrice(total)}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Tu pedido</h3>
          <ul>
            {items.map((i) => (
              <li key={`${i.id}-${i.size}-${i.color}`}>
                <span>{i.name} {i.size && `· ${i.size}`} × {i.quantity}</span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="checkout-summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
