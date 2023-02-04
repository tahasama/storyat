import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Alert } from "react-native";

import { auth, db } from "../../firebase";

const USER_URL: any = process.env.REACT_APP_USER_URL;

interface valueProps {
  email: string;
  password: string;
  provider?: GoogleAuthProvider;
  useremail?: string;
  username?: string;
  userimage?: string;
}

export const updateUserImage = createAsyncThunk(
  "updateUserImage",
  async (userImageInfos: any) => {
    try {
      const res = await updateDoc(doc(db, "users", userImageInfos.userId), {
        avatar: userImageInfos.userImage,
      });
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const getUser = createAsyncThunk("getUser", async (userId: any) => {
  let result = [];
  try {
    const res: any = await getDoc(doc(db, "users", userId));
    res.forEach((doc: any) => result.push({ ...doc.data(), id: userId }));
    return res;
  } catch (e) {
    console.error("Error adding document: ", e);
    Alert.alert("action failed please try again");
  }
});

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
    image: string;
  };
}

export const userInitialState = {
  uid: "",
  email: "",
  password: "",
  err: { code: "", message: "" },
  user: "",
  image: "",
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
    updateUserImageState: (state, action) => {
      state.image = action.payload;
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
    builder.addCase(getUser.fulfilled, (state, action: any) => {
      state.user = action.payload;
    });
  },
});

export const getAuthData = (state: userProps) => state.authUser;
export const { updateError, saveUser, resetUser, updateUserImageState } =
  authSlice.actions;
export default authSlice.reducer;
