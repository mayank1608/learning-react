import { configureStore } from "@reduxjs/toolkit"
import userReducer  from "./usersSlice"
import loaderReducer  from "./loaderSlice"


const store = configureStore({
    reducer: {userReducer, loaderReducer}
})

export default store;