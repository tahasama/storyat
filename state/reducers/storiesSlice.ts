import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "../../firebase";

// const USER_URL: any = process.env.REACT_APP_USER_URL;

interface storyProps {
  userId: string;
  title: string;
  content: string;
}

export const loadStories = createAsyncThunk("loadStories", async () => {
  const querySnapshot = await getDocs(collection(db, "stories"));
  const promises = querySnapshot.docs.map(async (docs: any) => {
    const username = await (
      await getDoc(doc(db, "users", docs.data().writerId))
    ).data().username;
    const avatar = await (
      await getDoc(doc(db, "users", docs.data().writerId))
    ).data().avatar;
    return { ...docs.data(), id: docs.id, username: username, avatar: avatar };
  });
  const result = await Promise.all(promises);
  return result;
});

export const addStories = createAsyncThunk(
  "addStories",
  async ({ title, content, userId }: storyProps) => {
    try {
      console.log("the res is", title, content, userId);

      const res = await addDoc(collection(db, "stories"), {
        title: title,
        content: content,
        writerId: userId,
        timestamp: Date.now(),
      });

      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export interface storiesProps {
  storiesStates: {
    result: any[];
    title: string;
    content: string;
    writerId: string;
    timestamp: string;
    username: string;
  };
}

export const storiesInitialState = {
  result: [],
  title: "",
  content: "",
  writerId: "",
  timestamp: "",
  username: "",
};

export const storiesSlice = createSlice({
  name: "stories-redux",
  initialState: storiesInitialState,
  reducers: {
    getUserName: (state, action) => {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadStories.fulfilled, (state, action: any) => {
      // console.log("sssssssssssssssssssss", action);
      state.result = action.payload;
    });
    //     builder.addCase(addStories.fulfilled, (state, action) => {
    // state=action.payload

    //     });
  },
});

export const getstoriesData = (state: storiesProps) => state.storiesStates;
export const { getUserName } = storiesSlice.actions;
export default storiesSlice.reducer;
