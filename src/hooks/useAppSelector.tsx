import { TypedUseSelectorHook, useSelector } from "react-redux"
import type { RootStateType } from "../app/store"

const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector

export default useAppSelector
