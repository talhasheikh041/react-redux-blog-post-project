import { RootStateType } from "../../app/store"
import useAppSelector from "../../hooks/useAppSelector"
import { useGetPostsByUserIdQuery } from "../posts/postsSlice"
import { selectUserById } from "./usersSlice"
import { useParams, Link } from "react-router-dom"

const UserPage = () => {
  const { userId } = useParams()
  const user = useAppSelector((state: RootStateType) =>
    selectUserById(state, Number(userId))
  )

  const {
    data: postsForUser,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetPostsByUserIdQuery(Number(userId))

  let content
  if (isLoading) {
    content = <p>Loading ...</p>
  } else if (isSuccess) {
    const { ids, entities } = postsForUser
    content = ids.map((id) => {
      return (
        <li key={id}>
          <Link to={`/post/${id}`}>{entities[id]?.title}</Link>
        </li>
      )
    })
  } else if (isError) {
    if ("status" in error) {
      content = (
        <p>{"error" in error ? error.error : JSON.stringify(error.data)}</p>
      )
    }
  }

  return (
    <section>
      <h2 className="text-4xl font-bold xl:text-6xl">{user?.name}</h2>
      <ul className="mt-8 list-decimal list-inside flex flex-col gap-1 xl:text-lg tracking-wide">
        {content}
      </ul>
    </section>
  )
}
export default UserPage
