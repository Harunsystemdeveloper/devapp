export const API_URL = '/api'

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}

// GET
export async function apiGet<T>(path: string) {
  const res = await fetch(`${API_URL}${path}`, { credentials: 'include' })
  return handle<T>(res)
}

// POST
export async function apiPost<T>(path: string, body: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  return handle<T>(res)
}

// PUT
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


export async function apiRegister<T>(email: string, password: string) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}
