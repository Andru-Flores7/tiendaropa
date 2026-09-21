import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Lista pública de productos activos, con filtro opcional por categoría (slug)
export function useProducts({ categorySlug } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    let query = supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug)
    }

    const { data, error } = await query
    if (error) setError(error.message)
    else setProducts(categorySlug ? (data || []).filter((p) => p.categories?.slug === categorySlug) : data || [])
    setLoading(false)
  }, [categorySlug])

  useEffect(() => { load() }, [load])

  return { products, loading, error, reload: load }
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
