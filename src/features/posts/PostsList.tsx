import useAppSelector from "../../hooks/useAppSelector"

import { selectPostIds, useGetPostsQuery } from "./postsSlice"

import PostsExcerpt from "./PostsExcerpt"

const PostsList = () => {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery()

  const orderedPostsIds = useAppSelector(selectPostIds)

  let content: React.ReactNode
  if (isLoading) {
    content = (
      <svg
        className="animate-spin -ml-1 mr-3 h-10 text-white block mx-auto mt-16 w-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    )
  } else if (isSuccess) {
    content = orderedPostsIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ))
  } else if (isError) {
    if ("status" in error) {
      content = (
        <p>{"error" in error ? error.error : JSON.stringify(error.data)}</p>
      )
    }
  }

  return <section className="mt-8 px-8 xl:px-36">{content}</section>
}
export default PostsList
