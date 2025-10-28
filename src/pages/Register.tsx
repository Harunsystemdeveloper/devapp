import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { apiRegister } from '../api'

export default function Register() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      await apiRegister(email, password)
      setSuccess(true)
      // Vänta 1,5 sekund och gå sedan till login
      setTimeout(() => nav('/login'), 1500)
    } catch (err: any) {
      setError('Kunde inte skapa användare: ' + err.message)
    }
  }

  return (
    <Form
      onSubmit={handleSubmit}
      style={{ maxWidth: 400, margin: 'auto', marginTop: '50px' }}
    >
      <h2 className="mb-4 text-center">Registrera konto</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Konto skapat! Du skickas till inloggningen...
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>E-postadress</Form.Label>
        <Form.Control
          type="email"
          placeholder="exempel@domän.se"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Lösenord</Form.Label>
        <Form.Control
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <div className="d-grid">
        <Button type="submit" variant="success">
          Skapa konto
        </Button>
      </div>

      <p className="mt-3 text-center">
        Har du redan ett konto?{' '}
        <Link to="/login">Logga in här</Link>
      </p>
    </Form>
  )
}

