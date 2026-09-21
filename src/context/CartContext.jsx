import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'alma_cart_v1'

function cartKey(item) {
  return `${item.id}__${item.size || ''}__${item.color || ''}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product, { size, color, quantity = 1 } = {}) {
    setItems((prev) => {
      const key = cartKey({ id: product.id, size, color })
      const existing = prev.find((i) => cartKey(i) === key)
      if (existing) {
        return prev.map((i) =>
          cartKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url,
          size, color, quantity,
        },
      ]
    })
    setIsOpen(true)
  }

  function removeItem(item) {
    setItems((prev) => prev.filter((i) => cartKey(i) !== cartKey(item)))
  }

  function updateQuantity(item, quantity) {
    if (quantity < 1) return removeItem(item)
    setItems((prev) =>
      prev.map((i) => (cartKey(i) === cartKey(item) ? { ...i, quantity } : i))
    )
  }

  function clearCart() {
    setItems([])
  }

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )
  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
