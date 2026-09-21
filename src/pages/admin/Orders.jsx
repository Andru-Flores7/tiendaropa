import { useEffect, useState, useCallback, Fragment } from 'react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../utils'
import { useToast } from '../../context/ToastContext'

const STATUSES = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']

export default function Orders() {
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [items, setItems] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleExpand(order) {
    if (expanded === order.id) { setExpanded(null); return }
    setExpanded(order.id)
    if (!items[order.id]) {
      const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id)
      setItems((prev) => ({ ...prev, [order.id]: data || [] }))
    }
  }

  async function updateStatus(order, status) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', order.id)
    if (error) showToast('No se pudo actualizar el estado', 'error')
    else {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)))
      showToast('Estado actualizado', 'success')
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Pedidos</h1>
          <p>{orders.length} pedidos recibidos</p>
        </div>
      </div>

      {loading ? (
        <div className="state-block"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div className="state-block">
          <h3>Todavía no hay pedidos</h3>
          <p>Aquí verás los pedidos en cuanto lleguen.</p>
        </div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o.id}>
                  <tr>
                    <td>{o.customer_name}<br /><span style={{ color: 'var(--ink-faint)', fontSize: '0.78rem' }}>{o.customer_email}</span></td>
                    <td>{new Date(o.created_at).toLocaleDateString('es-ES')}</td>
                    <td>{formatPrice(o.total)}</td>
                    <td>
                      <select className="input" style={{ padding: '0.4em 0.6em', fontSize: '0.82rem' }}
                        value={o.status} onChange={(e) => updateStatus(o, e.target.value)}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleExpand(o)}>
                        {expanded === o.id ? 'Ocultar' : 'Ver detalle'}
                      </button>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr>
                      <td colSpan={5} style={{ background: 'var(--paper-soft)' }}>
                        <div style={{ padding: '0.6em 0.4em' }}>
                          <p style={{ marginBottom: '0.5em' }}><strong>Envío:</strong> {o.shipping_address}</p>
                          {o.customer_phone && <p style={{ marginBottom: '0.5em' }}><strong>Teléfono:</strong> {o.customer_phone}</p>}
                          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.3em' }}>
                            {(items[o.id] || []).map((it) => (
                              <li key={it.id} style={{ fontSize: '0.86rem', display: 'flex', justifyContent: 'space-between', maxWidth: 420 }}>
                                <span>{it.product_name} {it.size && `· ${it.size}`} {it.color && `· ${it.color}`} × {it.quantity}</span>
                                <span>{formatPrice(it.unit_price * it.quantity)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
