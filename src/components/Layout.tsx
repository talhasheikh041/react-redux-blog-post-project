import { Outlet } from "react-router-dom"
import Header from "./Header"

const Layout = () => {
  return (
    <>
      <Header />
      <div className="p-10 xl:px-64">
        <Outlet />
      </div>
    </>
  )
}
export default Layout
