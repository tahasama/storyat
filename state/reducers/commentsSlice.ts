import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "../../firebase";

// const USER_URL: any = process.env.REACT_APP_USER_URL;

interface commentProps {
  userId: string;
  storyId: string;
  comment: string;
}

export const loadcomments = createAsyncThunk(
  "loadcomments",
  async (storyId: string) => {
    try {
      let result = [];
      const q = query(
        collection(db, "comments"),
        where("storyId", "==", storyId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc: any) =>
        result.push({ ...doc.data(), id: doc.id })
      );
      return result;
    } catch (error: any) {
      return error;
    }
  }
);

export const addcomments = createAsyncThunk(
  "addcomments",
  async ({ comment, userId, storyId }: commentProps) => {
    console.log("the res is", comment, userId, storyId);

    try {
      console.log("the res is", comment, userId);

      const res = await addDoc(collection(db, "comments"), {
        comment: comment,
        commenter: userId,
        storyId: storyId,
        timestamp: Date.now(),
      });
      console.log("the res is", res);
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export interface commentsProps {
  commentsStates: {
    result: any[];
    comment: string;
    commenter: string;
    timestamp: string;
  };
}

export const commentsInitialState = {
  result: [],
  comment: "",
  commenter: "",
  timestamp: "",
};

export const commentsSlice = createSlice({
  name: "comments-redux",
  initialState: commentsInitialState,
  reducers: {
    // commentRoute: (state, action) => {
    //   state.commentRouteValue = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(loadcomments.fulfilled, (state, action: any) => {
      state.result = action.payload;
    });
    //     builder.addCase(addcomments.fulfilled, (state, action) => {
    // state=action.payload

    //     });
  },
});

export const getcommentsData = (state: commentsProps) => state.commentsStates;
export const {} = commentsSlice.actions;
export default commentsSlice.reducer;
