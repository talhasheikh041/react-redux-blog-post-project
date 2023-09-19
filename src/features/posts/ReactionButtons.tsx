import { PostStateType, useAddReactionMutation } from "./postsSlice"

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
  const [addReaction] = useAddReactionMutation()

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className=""
        onClick={() => {
          const newValue =
            post.reactions[name as keyof typeof reactionEmoji] + 1
          addReaction({
            id: post.id,
            reactions: { ...post.reactions, [name]: newValue },
          })
        }}
      >
        {emoji} {post.reactions[name as keyof typeof reactionEmoji]}
      </button>
    )
  })

  return <div className="flex gap-2 mt-4">{reactionButtons}</div>
}
export default ReactionButtons
