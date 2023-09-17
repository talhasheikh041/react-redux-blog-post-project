import useAppSelector from "../../hooks/useAppSelector"
import { selectAllUsers } from "./usersSlice"
import { Link } from "react-router-dom"

const UsersList = () => {
  const users = useAppSelector(selectAllUsers)

  const userLinkElements = users.map((user) => {
    return (
      <li className="hover:underline hover:font-semibold" key={user.id}>
        <Link to={`${user.id}`}>{user.name}</Link>
      </li>
    )
  })

  return (
    <section>
      <h2 className="text-4xl font-bold xl:text-6xl">Users List</h2>
      <ul className="mt-8 list-decimal list-inside flex flex-col gap-1 xl:text-lg tracking-wide">
        {userLinkElements}
      </ul>
    </section>
  )
}
export default UsersList
