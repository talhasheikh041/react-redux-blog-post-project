import { RootStateType } from "../../app/store"
import useAppSelector from "../../hooks/useAppSelector"
import { selectPostsByUser } from "../posts/postsSlice"
import { selectUserById } from "./usersSlice"
import { useParams, Link } from "react-router-dom"

const UserPage = () => {
  const { userId } = useParams()
  const user = useAppSelector((state: RootStateType) =>
    selectUserById(state, Number(userId))
  )

  const userPosts = useAppSelector((state: RootStateType) =>
    selectPostsByUser(state, Number(userId))
  )

  const userPostTitles = userPosts.map((userPost) => {
    return (
      <li key={userPost.id}>
        <Link
          className="hover:underline hover:font-semibold"
          to={`/post/${userPost.id}`}
        >
          {userPost.title}
        </Link>
      </li>
    )
  })

  return (
    <section>
      <h2 className="text-4xl font-bold xl:text-6xl">{user?.name}</h2>
      <ul className="mt-8 list-decimal list-inside flex flex-col gap-1 xl:text-lg tracking-wide">
        {userPostTitles}
      </ul>
    </section>
  )
}
export default UserPage
