import { useNavigate } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import PostForm from '../components/PostForm'

export default function CreatePost() {
  const nav = useNavigate()
  const { add } = usePosts()

  async function handleCreate(title: string, content: string) {
    await add(title, content)
    nav('/')
  }

  return (
    <>
      <h2>Ny post</h2>
      <PostForm onSubmit={handleCreate} />
    </>
  )
}
