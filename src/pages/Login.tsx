import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login(username, password)
      nav('/')
    } catch {
      setError('Fel användarnamn eller lösenord')
    }
  }

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Logga in</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Användarnamn</Form.Label>
        <Form.Control value={username} onChange={e => setUsername(e.target.value)} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Lösenord</Form.Label>
        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </Form.Group>
      <Button type="submit">Logga in</Button>
    </Form>
  )
}
