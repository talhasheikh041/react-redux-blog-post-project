import { useState } from "react"
import useAppSelector from "../../hooks/useAppSelector"
import {
  selectPostById,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "./postsSlice"
import { useParams, useNavigate } from "react-router-dom"

import { selectAllUsers } from "../users/usersSlice"
import { RootStateType } from "../../app/store"
import { isAxiosError } from "axios"

const EditPostForm = () => {
  const { postId } = useParams()
  const navigate = useNavigate()

  const post = useAppSelector((state: RootStateType) =>
    selectPostById(state, Number(postId))
  )
  const users = useAppSelector(selectAllUsers)

  const [title, setTitle] = useState(post?.title)
  const [content, setContent] = useState(post?.body)
  const [userId, setUserId] = useState(post?.userId)

  const [updatePost, { isLoading }] = useUpdatePostMutation()
  const [deletePost] = useDeletePostMutation()

  if (!post) {
    return (
      <section>
        <p>No Post Found!</p>
      </section>
    )
  }

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value)

  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value)

  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(Number(e.target.value))

  const canSavePost = [title, content, userId].every(Boolean) && !isLoading

  const onSavePostClicked = async () => {
    if (canSavePost) {
      try {
        if (title && content && userId)
          await updatePost({
            id: post.id,
            title,
            body: content,
            userId,
          }).unwrap()

        setTitle("")
        setContent("")
        setUserId(undefined)
        navigate(`/post/${postId}`)
      } catch (error) {
        if (isAxiosError(error)) console.error("Failed to save the post", error)
      }
    }
  }

  const onDeletePostClicked = async () => {
    try {
      await deletePost({ id: post.id }).unwrap()
      setTitle("")
      setContent("")
      setUserId(undefined)
      navigate("/")
    } catch (err) {
      console.error("Failed to delete post", err)
    }
  }

  const usersOptions = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    )
  })

  return (
    <section>
      <h2 className="text-3xl font-bold">Edit Post</h2>
      <form className="flex flex-col mt-4">
        <label htmlFor="postTitle" className="text-lg">
          Post Title:
        </label>
        <input
          className="bg-gray-900 outline-none border text-white rounded-sm focus:border-blue-300 pl-1 p-1"
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="text-lg mt-4" htmlFor="postAuthor">
          Author:
        </label>
        <select
          className="bg-gray-900 outline-none border text-white rounded-sm focus:border-blue-300 pl-1 p-1"
          name="postAuthor"
          id="postAuthor"
          defaultValue={userId}
          onChange={onAuthorChanged}
        >
          <option value="">Select the Author</option>
          {usersOptions}
        </select>

        <label htmlFor="postContent" className="text-lg mt-4">
          Content:
        </label>
        <textarea
          className="bg-gray-900 outline-none border text-white rounded-sm focus:border-blue-300 pl-1"
          name="postContent"
          id="postContent"
          value={content}
          onChange={onContentChanged}
        />

        <button
          type="button"
          className="border mt-8 p-1 text-lg hover:bg-slate-300 hover:text-black hover:font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed w-1/2 mx-auto"
          onClick={onSavePostClicked}
          disabled={!canSavePost}
        >
          {canSavePost ? "Save Post" : "🚫"}
        </button>

        <button
          className="hover:bg-red-700 border mt-4 p-1 text-lg  hover:font-semibold w-1/2 mx-auto"
          type="button"
          onClick={onDeletePostClicked}
        >
          Delete Post
        </button>
      </form>
    </section>
  )
}
export default EditPostForm
