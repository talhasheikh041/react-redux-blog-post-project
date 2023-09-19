import {
  createSelector,
  createEntityAdapter,
  EntityState,
  EntityAdapter,
} from "@reduxjs/toolkit"
import { RootStateType } from "../../app/store"
import { sub } from "date-fns"
import { apiSlice } from "../api/apiSlice"

const postsAdapter: EntityAdapter<PostStateType> = createEntityAdapter({
  sortComparer: (a: PostStateType, b: PostStateType) =>
    b.date.localeCompare(a.date),
})

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

const initialState: EntityState<PostStateType> = postsAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<EntityState<PostStateType>, void>({
      query: () => "/posts",
      transformResponse: (responseData: PostStateType[]) => {
        let min = 1
        const loadedPosts = responseData.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString()
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            }
          return post
        })
        return postsAdapter.setAll(initialState, loadedPosts)
      },
      providesTags: (result) =>
        result
          ? [
              ...result.ids.map((id) => ({ type: "Post" as const, id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),

    getPostsByUserId: builder.query<EntityState<PostStateType>, number>({
      query: (id) => `/posts/?userId=${id}`,
      transformResponse: (responseData: PostStateType[]) => {
        let min = 1
        const loadedPosts = responseData.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString()
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            }
          return post
        })
        return postsAdapter.setAll(initialState, loadedPosts)
      },
      providesTags: (result) => {
        if (result)
          return [...result.ids.map((id) => ({ type: "Post" as const, id }))]
        return [{ type: "Post" }]
      },
    }),

    addNewPost: builder.mutation<
      void,
      Omit<PostStateType, "date" | "reactions" | "id">
    >({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    updatePost: builder.mutation<
      void,
      Omit<PostStateType, "date" | "reactions">
    >({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_, __, arg) => {
        return [{ type: "Post", id: arg.id }]
      },
    }),

    deletePost: builder.mutation<void, Pick<PostStateType, "id">>({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_, __, arg) => {
        return [{ type: "Post", id: arg.id }]
      },
    }),

    addReaction: builder.mutation<
      void,
      Pick<PostStateType, "id" | "reactions">
    >({
      query: ({ id: postId, reactions }) => ({
        url: `posts/${postId}`,
        method: "PATCH",
        body: { reactions },
      }),
      onQueryStarted: async (
        { id: postId, reactions },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getPosts",
            undefined,
            (draft) => {
              const post = draft.entities[postId]
              if (post) post.reactions = reactions
            }
          )
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice

// returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select()

const selectPostsData = createSelector(
  selectPostsResult,
  (postResult) => postResult.data
)

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors(
  (state: RootStateType) => selectPostsData(state) ?? initialState
)
