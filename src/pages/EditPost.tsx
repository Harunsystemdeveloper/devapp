import { useParams, useNavigate } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import PostForm from '../components/PostForm'
import { useState, useEffect } from 'react'
import { apiGet } from '../api'

export default function EditPost() {
  const { id } = useParams()
  const { edit } = usePosts()
  const nav = useNavigate()
  const [initial, setInitial] = useState<any>(null)

  useEffect(() => {
    apiGet(`/posts/${id}`).then(setInitial)
  }, [id])

  async function handleSave(title: string, content: string) {
    await edit(Number(id), title, content)
    nav('/')
  }

  if (!initial) return <p>Laddar...</p>
  return (
    <>
      <h2>Redigera</h2>
      <PostForm initial={initial} onSubmit={handleSave} />
    </>
  )
}
