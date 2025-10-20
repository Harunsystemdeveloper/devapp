import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../api'

export function usePosts() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const data = await apiGet('/posts')
    setPosts(data)
    setLoading(false)
  }

  async function add(title: string, content: string) {
    const post = await apiPost('/posts', { title, content })
    setPosts(prev => [post, ...prev])
  }

  async function edit(id: number, title: string, content: string) {
    const updated = await apiPut(`/posts/${id}`, { title, content })
    setPosts(prev => prev.map(p => (p.id === id ? updated : p)))
  }

  async function remove(id: number) {
    await apiDelete(`/posts/${id}`)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  useEffect(() => { load() }, [])

  return { posts, loading, add, edit, remove }
}
