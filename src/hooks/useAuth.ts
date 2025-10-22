import { useState, useEffect } from 'react'
import { apiPost, apiGet } from '../api'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet('/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const u = await apiPost('/login', { email, password })
    setUser(u)
  }

  async function logout() {
    await apiPost('/logout', {})
    setUser(null)
  }

  return { user, loading, login, logout }
}
