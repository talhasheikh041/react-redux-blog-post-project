import {
  createEntityAdapter,
  createSelector,
  EntityAdapter,
  EntityState,
} from "@reduxjs/toolkit"
import { apiSlice } from "../api/apiSlice"
import { RootStateType } from "../../app/store"

type UserStateType = {
  id: number
  name: string
}

const usersAdapter: EntityAdapter<UserStateType> = createEntityAdapter()

const initialState: EntityState<UserStateType> = usersAdapter.getInitialState()

export const extendedUsersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUsers: builder.query<EntityState<UserStateType>, void>({
      query: () => "/users",
      transformResponse: (responseData: UserStateType[]) => {
        return usersAdapter.setAll(initialState, responseData)
      },
    }),
  }),
})

export const { useFetchUsersQuery } = extendedUsersApiSlice

export const selectUsersResult =
  extendedUsersApiSlice.endpoints.fetchUsers.select()

const selectUsersData = createSelector(
  selectUsersResult,
  (userResult) => userResult.data
)

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors(
    (state: RootStateType) => selectUsersData(state) ?? initialState
  )

// const usersSlice = createSlice({
//   name: "users",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchUsers.fulfilled, (_, action) => {
//       return action.payload
//     })
//   },
// })

// export const selectAllUsers = (state: RootStateType) => state.users
// export const selectUserById = (state: RootStateType, userId: number) =>
//   state.users.find((user) => user.id === userId)

// export default usersSlice.reducer
