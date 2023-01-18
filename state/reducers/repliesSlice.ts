import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "../../firebase";

// const USER_URL: any = process.env.REACT_APP_USER_URL;

interface replyProps {
  userId: string;
  commentId: string;
  reply: string;
}

export const loadreplies = createAsyncThunk(
  "loadreplies",
  async (commentId: string) => {
    console.log("ffffffffffffff", commentId);
    try {
      let result = [];
      const q = query(
        collection(db, "replies"),
        where("storyId", "==", commentId)
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

export const addreplies = createAsyncThunk(
  "addreplies",
  async ({ reply, userId }: replyProps) => {
    try {
      console.log("the res is", reply, userId);

      const res = await addDoc(collection(db, "replies"), {
        reply: reply,
        replier: userId,
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

export interface repliesProps {
  repliesStates: {
    result: any[];
    reply: string;
    replier: string;
    timestamp: string;
  };
}

export const repliesInitialState = {
  result: [],
  reply: "",
  replier: "",
  timestamp: "",
};

export const repliesSlice = createSlice({
  name: "replies-redux",
  initialState: repliesInitialState,
  reducers: {
    // replyRoute: (state, action) => {
    //   state.replyRouteValue = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(loadreplies.fulfilled, (state, action: any) => {
      state.result = action.payload;
    });
    //     builder.addCase(addreplies.fulfilled, (state, action) => {
    // state=action.payload

    //     });
  },
});

export const getrepliesData = (state: repliesProps) => state.repliesStates;
export const {} = repliesSlice.actions;
export default repliesSlice.reducer;
