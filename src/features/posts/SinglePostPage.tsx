import useAppSelector from "../../hooks/useAppSelector"
import { selectPostById } from "./postsSlice"

import PostAuthor from "./PostAuthor"
import TimeAgo from "./TimeAgo"
import ReactionButtons from "./ReactionButtons"
import { RootStateType } from "../../app/store"

import { Link, useParams } from "react-router-dom"

const SinglePostPage = () => {
  // retrieve post id
  const { postId } = useParams()

  const post = useAppSelector((state: RootStateType) =>
    selectPostById(state, Number(postId))
  )

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  return (
    <article className="border mt-6 rounded-md p-6 xl:p-11 border-gray-500 ">
      <h3 className="font-semibold text-3xl uppercase xl:w-9/12">
        {post.title}
      </h3>
      <p className="mt-6 text-lg xl:w-3/4">{post.body}</p>
      <p className="text-sm text-gray-400 mt-6 flex gap-4">
        <Link className="text-white underline" to={`/post/edit/${post.id}`}>
          Edit Post
        </Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timeStamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  )
}
export default SinglePostPage
