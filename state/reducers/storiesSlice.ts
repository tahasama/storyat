import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "../../firebase";

// const USER_URL: any = process.env.REACT_APP_USER_URL;

interface storyProps {
  userId: string;
  title: string;
  content: string;
}

export const loadStories = createAsyncThunk(
  "loadStories",
  async ({ pageName }: any) => {
    const yo = collection(db, "stories");
    const q = query(
      yo,
      where(pageName, "!=", []),
      orderBy(pageName, "desc")
      // limit(2)
    );

    const querySnapshot = await getDocs(pageName !== "items" ? q : yo);
    const promises = querySnapshot.docs.map(async (docs: any) => {
      const username = await (
        await getDoc(doc(db, "users", docs.data().writerId))
      ).data().username;
      const avatar = await (
        await getDoc(doc(db, "users", docs.data().writerId))
      ).data().avatar;
      return {
        ...docs.data(),
        id: docs.id,
        username: username,
        avatar: avatar,
      };
    });
    const result = await Promise.all(promises);
    return result;
  }
);

export const getStory = createAsyncThunk("getStory", async (storyId: any) => {
  try {
    const res = (await getDoc(doc(db, "stories", storyId))).data();

    return res;
  } catch (e) {
    console.error("Error adding document: ", e);
    Alert.alert("action failed please try again");
  }
});

export const addStories = createAsyncThunk(
  "addStories",
  async ({ title, content, userId }: storyProps) => {
    try {
      const res = await addDoc(collection(db, "stories"), {
        title: title,
        content: content,
        writerId: userId,
        timestamp: Date.now(),
        numOfComments: 0,
        applauds: [],
        compassions: [],
        brokens: [],
        justNos: [],
      });

      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const addCommentNumberToStory = createAsyncThunk(
  "addCommentNumberToStory",
  async (infos: any) => {
    try {
      const res = await updateDoc(doc(db, "stories", infos.storyId), {
        numOfComments: infos.numOfComments + 1,
      });
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const substractCommentNumberToStory = createAsyncThunk(
  "substractCommentNumberToStory",
  async (infos: any) => {
    try {
      const res = await updateDoc(doc(db, "stories", infos.storyId), {
        numOfComments: infos.numOfComments - 1,
      });
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const voteApplaud = createAsyncThunk(
  "voteApplaud",
  async (infos: any) => {
    try {
      const res = await updateDoc(doc(db, "stories", infos.voteData.storyId), {
        applauds: infos.voteArray,
      });
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const voteCompassion = createAsyncThunk(
  "voteApplaud",
  async (infos: any) => {
    try {
      const res = await updateDoc(doc(db, "stories", infos.voteData.storyId), {
        compassions: infos.voteArray,
      });
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const voteBroken = createAsyncThunk(
  "voteApplaud",
  async (infos: any) => {
    try {
      const res = await updateDoc(doc(db, "stories", infos.voteData.storyId), {
        brokens: infos.voteArray,
      });
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const voteWow = createAsyncThunk("voteApplaud", async (infos: any) => {
  try {
    const res = await updateDoc(doc(db, "stories", infos.voteData.storyId), {
      justNos: infos.voteArray,
    });
    return res;
  } catch (e) {
    console.error("Error adding document: ", e);
    Alert.alert("action failed please try again");
  }
});

export interface storiesProps {
  storiesStates: {
    result: any[];
    title: string;
    content: string;
    writerId: string;
    timestamp: string;
    username: string;
    story: any;
    applaudState: boolean;
    compassionState: boolean;
    brokenState: boolean;
    wowState: boolean;
    NumOfCommentState: number;
  };
}

export const storiesInitialState = {
  result: [],
  title: "",
  content: "",
  writerId: "",
  timestamp: "",
  username: "",
  story: {},
  applaudState: false,
  compassionState: false,
  brokenState: false,
  wowState: false,
  NumOfCommentState: 0,
};

export const storiesSlice = createSlice({
  name: "stories-redux",
  initialState: storiesInitialState,
  reducers: {
    getUserName: (state, action) => {
      state.username = action.payload;
    },
    updateApplaudState: (state, action) => {
      state.applaudState = action.payload;
    },
    updateCompassionState: (state, action) => {
      state.compassionState = action.payload;
    },
    updateBrokenState: (state, action) => {
      state.brokenState = action.payload;
    },
    updateWowState: (state, action) => {
      state.wowState = action.payload;
    },
    updateNumOfCommentState: (state, action) => {
      state.NumOfCommentState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadStories.fulfilled, (state, action: any) => {
      state.result = action.payload;
    });
    builder.addCase(getStory.fulfilled, (state, action) => {
      state.story = action.payload;
    });
  },
});

export const getstoriesData = (state: storiesProps) => state.storiesStates;
export const {
  getUserName,
  updateApplaudState,
  updateCompassionState,
  updateBrokenState,
  updateWowState,
  updateNumOfCommentState,
} = storiesSlice.actions;
export default storiesSlice.reducer;
