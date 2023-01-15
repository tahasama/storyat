

import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
// import itnReducer from "./reducers/itnSlice";
import authReducer from "./reducers/authSlice";
import headerSlice from "./reducers/headerSlice";


export const store = configureStore({
  reducer: {
    // itnz: itnReducer
    authUser: authReducer,
    headerStates:headerSlice

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