import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootStateType } from "../../app/store"
import axios, { isAxiosError } from "axios"

const USERS_URL = "https://jsonplaceholder.typicode.com/users"

type UserStateType = {
  id: number
  name: string
}

const initialState: UserStateType[] = []

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const response = await axios.get(USERS_URL)
    return response.data
  } catch (err) {
    if (isAxiosError(err)) {
      return err.message
    }
  }
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (_, action) => {
      return action.payload
    })
  },
})

export const selectAllUsers = (state: RootStateType) => state.users
export const selectUserById = (state: RootStateType, userId: number) =>
  state.users.find((user) => user.id === userId)

export default usersSlice.reducer
