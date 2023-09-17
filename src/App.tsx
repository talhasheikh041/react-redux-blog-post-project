import Layout from "./components/Layout"
import AddPostForm from "./features/posts/AddPostForm"
import PostsList from "./features/posts/PostsList"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom"
import SinglePostPage from "./features/posts/SinglePostPage"
import EditPostForm from "./features/posts/EditPostForm"
import UsersList from "./features/users/UsersList"
import UserPage from "./features/users/UserPage"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<PostsList />} />

      <Route path="post">
        <Route index element={<AddPostForm />} />
        <Route path=":postId" element={<SinglePostPage />} />
        <Route path="edit/:postId" element={<EditPostForm />} />
      </Route>

      <Route path="users">
        <Route index element={<UsersList />} />
        <Route path=":userId" element={<UserPage />} />
      </Route>
    </Route>
  )
)

function App() {
  return <RouterProvider router={router} />
}

export default App
