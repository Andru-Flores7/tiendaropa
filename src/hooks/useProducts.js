import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const PAGE_SIZE = 12

// Lista pública de productos activos, con filtro opcional por categoría, búsqueda y paginación
export function useProducts({ categorySlug, search = '', page = 1 } = {}) {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('products')
      .select('*, categories(name, slug)', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug)
    }

    if (search.trim()) {
      query = query.ilike('name', `%${search.trim()}%`)
    }

    const { data, error, count } = await query

    if (error) {
      setError(error.message)
    } else {
      // Filtro en cliente para category (join filter workaround de Supabase)
      const filtered = categorySlug
        ? (data || []).filter((p) => p.categories?.slug === categorySlug)
        : (data || [])
      setProducts(filtered)
      setTotal(count || 0)
    }
    setLoading(false)
  }, [categorySlug, search, page])

  useEffect(() => { load() }, [load])

  return { products, total, loading, error, reload: load }
}

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setCategories(data || [])
        setLoading(false)
      })
  }, [])

  return { categories, loading }
}
