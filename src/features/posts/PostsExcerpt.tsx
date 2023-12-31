import { EntityId } from "@reduxjs/toolkit"
import PostAuthor from "./PostAuthor"
import ReactionButtons from "./ReactionButtons"
import TimeAgo from "./TimeAgo"
import { selectPostById } from "./postsSlice"

import { Link } from "react-router-dom"
import useAppSelector from "../../hooks/useAppSelector"

type PropsType = {
  postId: EntityId
}

const PostsExcerpt = ({ postId }: PropsType) => {
  const post = useAppSelector((state) => selectPostById(state, postId))!

  return (
    <article className="border mt-6 rounded-md p-4 border-gray-500 ">
      <h3 className="font-bold text-2xl">{post.title}</h3>
      <p className="mt-3 text-sm italic">{post.body.substring(0, 75)}...</p>
      <p className="text-xs text-gray-400 mt-4 flex gap-2">
        <Link className="text-white underline" to={`post/${post.id}`}>
          View Post
        </Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timeStamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  )
}
export default PostsExcerpt
