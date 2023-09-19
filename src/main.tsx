import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { store } from "./app/store.ts"
import { Provider } from "react-redux"
import { fetchUsers } from "./features/users/usersSlice.ts"
import { extendedApiSlice } from "./features/posts/postsSlice.ts"

store.dispatch(fetchUsers())
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate())

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
