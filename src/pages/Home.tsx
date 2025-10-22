import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom';


export default function Home() {
  const { posts, loading, remove } = usePosts()
  const { user } = useAuth()

  if (loading) return <p>Laddar...</p>

  return (
    <div className="d-grid gap-3">
      {posts.map(p => (
        <Card key={p.id}>
          <Card.Body>
            <Card.Title>{p.title}</Card.Title>
            <Card.Text>{p.content}</Card.Text>
            {user && (
              <>
              {/* @ts-expect-error React Bootstrap typing bug */}
                <Button as={Link} to={`/edit/${p.id}`} variant="secondary" size="sm">Redigera</Button>{' '}
        
              </>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}
