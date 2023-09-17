import useAppDispatch from "../../hooks/useAppDispatch"
import { PostStateType, reactionAdded } from "./postsSlice"

type PropsType = {
  post: PostStateType
}

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😲",
  heart: "💖",
  rocket: "🚀",
  coffee: "☕",
}

const ReactionButtons = ({ post }: PropsType) => {
  const dispatch = useAppDispatch()

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className=""
        onClick={() =>
          dispatch(reactionAdded({ postId: post.id, reaction: name }))
        }
      >
        {emoji} {post.reactions[name as keyof typeof reactionEmoji]}
      </button>
    )
  })

  return <div className="flex gap-2 mt-4">{reactionButtons}</div>
}
export default ReactionButtons
