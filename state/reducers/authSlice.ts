import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../../firebase";

const USER_URL: any = process.env.REACT_APP_USER_URL;

interface valueProps {
  email: string;
  password: string;
  provider?: GoogleAuthProvider;
  useremail?: string;
  username?: string;
  userimage?: string;
}

export const registerUser = createAsyncThunk(
  "registerUser",
  async ({ email, password }: valueProps) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      return res.user;
    } catch (error: any) {
      return error;
    }
  }
);

export const loginUser = createAsyncThunk(
  "loginUser",
  async ({ email, password, provider }: valueProps) => {
    if (provider) {
      try {
        const res = await signInWithPopup(auth, provider);
        return res.user;
      } catch (error: any) {
        return error;
      }
    } else {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res.user;
      } catch (error: any) {
        return error;
      }
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      return error;
    }
  }
);

export interface userProps {
  authUser: {
    uid: string;
    email: string;
    password: string;
    // confirmPassword: string;
    err: { code: string; message: string };
    user: any;
  };
}

export const userInitialState = {
  uid: "",
  email: "",
  password: "",
  err: { code: "", message: "" },
  user: "",
};

export const authSlice = createSlice({
  name: "user-redux",
  initialState: userInitialState,
  reducers: {
    updateError: (state, action) => {
      state.err.message = action.payload;
      //   state.error.code = action.payload;
    },
    saveUser: (state, action) => {
      state.user = action.payload;
    },
    resetUser: (state, action) => {
      state.user = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state, action: any) => {
      state.email = action.payload.email;
      state.err.code = action.payload.code;
      state.err.message = action.payload.message;
    });

    builder.addCase(loginUser.fulfilled, (state, action: any) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.err.code = action.payload.code;
      state.err.message = action.payload.message;
    });
  },
});

export const getAuthData = (state: userProps) => state.authUser;
export const { updateError, saveUser, resetUser } = authSlice.actions;
export default authSlice.reducer;
