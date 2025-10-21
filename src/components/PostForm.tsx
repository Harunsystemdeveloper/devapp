import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

export default function PostForm({ initial, onSubmit }: any) {
  const [title, setTitle] = useState(initial?.title || '')
  const [content, setContent] = useState(initial?.content || '')

  return (
    <Form onSubmit={e => { e.preventDefault(); onSubmit(title, content) }}>
      <Form.Group className="mb-3">
        <Form.Label>Titel</Form.Label>
        <Form.Control value={title} onChange={e => setTitle(e.target.value)} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Innehåll</Form.Label>
        <Form.Control as="textarea" rows={4} value={content} onChange={e => setContent(e.target.value)} required />
      </Form.Group>
      <Button type="submit">Spara</Button>
    </Form>
  )
}
