
export const API_URL = '/api'

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}

// Exempel på CRUD-metoder
export async function apiGet<T>(path: string) {
  const res = await fetch(`${API_URL}${path}`, { credentials: 'include' })
  return handle<T>(res)
}

export async function apiPost<T>(path: string, body: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  return handle<T>(res)
}

export async function apiPut<T>(path: string, body: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  return handle<T>(res)
}

export async function apiDelete<T>(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  return handle<T>(res)
}
