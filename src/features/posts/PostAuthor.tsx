import useAppSelector from "../../hooks/useAppSelector"
import { selectAllUsers } from "../users/usersSlice"

type PropsType = {
  userId: number | undefined
}

const PostAuthor = ({ userId }: PropsType) => {
  const users = useAppSelector(selectAllUsers)

  const author = users.find((user) => user.id === userId)

  return <span>by {author ? author.name : "Unknown Author"}</span>
}
export default PostAuthor
