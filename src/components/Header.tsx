import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="flex justify-between items-center border-b p-6 xl:pr-20 ">
      <h1 className="text-3xl font-bold xl:text-4xl">Redux Blog</h1>
      <nav className="flex gap-4">
        <ul className="flex gap-4 xl:gap-10 xl:text-xl ">
          <li>
            <Link className="hover:text-gray-500 hover:underline" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-500 hover:underline" to="post">
              Post
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-500 hover:underline" to="users">
              Users
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
export default Header
