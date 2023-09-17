import { useDispatch } from "react-redux"
import { AppDispatchType } from "../app/store"

const useAppDispatch = () => useDispatch<AppDispatchType>()

export default useAppDispatch
