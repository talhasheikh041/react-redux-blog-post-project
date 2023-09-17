import {
  PayloadAction,
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
  EntityState,
  EntityAdapter,
} from "@reduxjs/toolkit"
import axios, { isAxiosError } from "axios"
import { RootStateType } from "../../app/store"
import { sub } from "date-fns"

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts"

const postsAdapter: EntityAdapter<PostStateType> = createEntityAdapter({
  sortComparer: (a: PostStateType, b: PostStateType) =>
    b.date.localeCompare(a.date),
})

console.log(postsAdapter.getInitialState())

type ReactionsType = {
  thumbsUp: number
  wow: number
  heart: number
  rocket: number
  coffee: number
}

export type PostStateType = {
  id: number
  title: string
  body: string
  userId?: number
  date: string
  reactions: ReactionsType
}

type InitialStateType = {
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  count: number
}

const initialState: EntityState<PostStateType> & InitialStateType =
  postsAdapter.getInitialState({
    status: "idle",
    error: "",
    count: 0,
  })

// const initialState: InitialStateType = {
//   posts: [],
//   status: "idle",
//   error: "",
//   count: 0,
// }

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await axios.get(POSTS_URL)
    return response.data
  } catch (err) {
    if (isAxiosError(err)) {
      return err.message
    }
  }
})

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost: { title: string; body: string; userId: number }) => {
    try {
      const response = await axios.post(POSTS_URL, initialPost)
      return response.data
    } catch (err) {
      if (isAxiosError(err)) {
        return err.message
      }
    }
  }
)

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost: Omit<PostStateType, "date">) => {
    const { id } = initialPost
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
      return response.data
    } catch (err) {
      if (isAxiosError(err)) return err.message
    }
  }
)

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPost: Pick<PostStateType, "id">) => {
    const { id } = initialPost
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
      if (response.status === 200) return initialPost
      return `${response.status}: ${response.statusText}`
    } catch (err) {
      if (isAxiosError(err)) return err.message
    }
  }
)

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reactionAdded: (
      state,
      action: PayloadAction<{ postId: number; reaction: string }>
    ) => {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction as keyof ReactionsType]++
      }
    },
    incrementCount: (state) => {
      state.count = state.count + 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchPosts.fulfilled,
        (state, action: PayloadAction<PostStateType[]>) => {
          state.status = "succeeded"
          let min = 1
          const loadedPosts = action.payload.map((post) => {
            post.date = sub(new Date(), { minutes: min++ }).toISOString()
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            }
            return post
          })

          // state.posts = state.posts.concat(loadedPosts)
          postsAdapter.upsertMany(state, loadedPosts)
        }
      )
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message!
      })
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading"
      })
      .addCase(
        addNewPost.fulfilled,
        (state, action: PayloadAction<PostStateType>) => {
          action.payload.userId = Number(action.payload.userId)
          action.payload.date = new Date().toISOString()
          action.payload.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          }
          // state.posts.push(action.payload)
          postsAdapter.addOne(state, action.payload)
        }
      )
      .addCase(
        updatePost.fulfilled,
        (state, action: PayloadAction<PostStateType>) => {
          if (!action.payload?.id) {
            console.log("Update could not complete")
            console.log(action.payload)
            return
          }
          action.payload.date = new Date().toISOString()
          // const { id } = action.payload
          // const otherPosts = state.posts.filter((post) => post.id !== id)
          // state.posts = [...otherPosts, action.payload]
          postsAdapter.upsertOne(state, action.payload)
        }
      )
      .addCase(
        deletePost.fulfilled,
        (
          state,
          action: PayloadAction<string | Pick<PostStateType, "id"> | undefined>
        ) => {
          if (
            typeof action.payload !== "string" &&
            typeof action.payload !== "undefined"
          ) {
            if (!action.payload.id) {
              console.log("Post could not delete")
              console.log(action.payload)
              return
            }
            const { id } = action.payload
            // const posts = state.posts.filter((post) => post.id !== id)
            // state.posts = posts
            postsAdapter.removeOne(state, id)
          }
        }
      )
  },
})

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootStateType) => state.posts)

// export const selectAllPosts = (state: RootStateType) => state.posts.posts
export const getPostsError = (state: RootStateType) => state.posts.error
export const getPostsStatus = (state: RootStateType) => state.posts.status
export const getCount = (state: RootStateType) => state.posts.count

// export const selectPostById = (state: RootStateType, postId: number) =>
//   state.posts.posts.find((post) => post.id === postId)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (_: RootStateType, userId: number) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
)

export const { reactionAdded, incrementCount } = postsSlice.actions
export default postsSlice.reducer
