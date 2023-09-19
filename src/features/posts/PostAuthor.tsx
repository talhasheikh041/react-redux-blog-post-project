import useAppSelector from "../../hooks/useAppSelector"
import { selectAllUsers } from "../users/usersSlice"
import { Link } from "react-router-dom"

type PropsType = {
  userId: number | undefined
}

const PostAuthor = ({ userId }: PropsType) => {
  const users = useAppSelector(selectAllUsers)

  const author = users.find((user) => user.id === userId)

  return (
    <span>
      by{" "}
      {author ? (
        <Link className="text-white underline" to={`/users/${userId}`}>
          {author.name}
        </Link>
      ) : (
        "Unknown Author"
      )}
    </span>
  )
}
export default PostAuthor
