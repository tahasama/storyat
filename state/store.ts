

import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
// import itnReducer from "./reducers/itnSlice";
import authSlice from "./reducers/authSlice";
import headerSlice from "./reducers/headerSlice";
import storiesSlice from "./reducers/storiesSlice";


export const store = configureStore({
  reducer: {
    // itnz: itnReducer
    authUser: authSlice,
    headerStates:headerSlice,
    storiesStates:storiesSlice

  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;