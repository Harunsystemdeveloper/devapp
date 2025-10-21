import { Container, Navbar, Nav, Button } from 'react-bootstrap'
import { Routes, Route, Link } from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user, logout } = useAuth()

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Digital Anslagstavla</Navbar.Brand>
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/new">Ny post</Nav.Link>
                <Button variant="outline-secondary" onClick={logout}>Logga ut</Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Logga in</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route element={<ProtectedRoute />}>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  )
}

