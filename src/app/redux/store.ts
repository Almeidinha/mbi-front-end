import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counter-slice";
import { apiSlice } from "./features/dogs/dogs-api-slice";
import userSlice from "./features/user/user-slice";

export const store = configureStore({
  reducer: {
    currentUser: userSlice,
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
})


export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>