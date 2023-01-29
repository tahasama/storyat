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
  startAfter,
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
    const g =
      pageName === "items"
        ? query(yo, orderBy("timestamp", "desc"), limit(4))
        : query(
            yo,
            where(pageName, "!=", []),
            orderBy(pageName, "desc"),
            limit(4)
          );

    const querySnapshot = await getDocs(g);
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
    const resultInitial = await Promise.all(promises);

    return resultInitial;
  }
);

export const loadMoreStories = createAsyncThunk(
  "loadMoreStories",
  async ({ pageName, resultLength, resultInitial }: any) => {
    const xxx = pageName;

    try {
      const yo = collection(db, "stories");

      // const g = query(
      //   yo,
      //   orderBy("timestamp", "desc"),
      //   limit(2),
      //   startAfter(resultInitial[resultInitial.length - 1].timestamp)
      // );
      const g =
        pageName === "items"
          ? query(
              yo,
              orderBy("timestamp", "desc"),
              limit(2),
              startAfter(resultInitial[resultInitial.length - 1].timestamp)
            )
          : query(
              yo,
              where(pageName, "!=", []),
              orderBy(pageName, "desc"),
              limit(2),
              startAfter(
                pageName === "applauds"
                  ? resultInitial[resultInitial.length - 1].applauds
                  : pageName === "timestamp"
                  ? resultInitial[resultInitial.length - 1].timestamp
                  : pageName === "compassions"
                  ? resultInitial[resultInitial.length - 1].compassions
                  : pageName === "brokens"
                  ? resultInitial[resultInitial.length - 1].brokens
                  : pageName === "justNos" &&
                    resultInitial[resultInitial.length - 1].justNos
              )
            );

      const querySnapshot = await getDocs(g);
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
      // const resulty = result.sort(() => Math.random() + 0.5);
      const resultw = [...resultInitial];
      resultw.push(...result);
      // const resultInitiaSet = new Set(resultInitia);
      // const arrRes = Array.from(resultInitiaSet);

      return resultw;
    } catch (error) {
      console.log("MMMMMMMMMM", error);
    }
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
    resultCumul: any[];
    resultInitial: any[];
    resultLoadMore: any[];
    title: string;
    content: string;
    writerId: string;
    timestamp: string;
    username: string;
    story: any;
    applaudState: any[];
    compassionState: any[];
    brokenState: any[];
    wowState: any[];
    NumOfCommentState: number;
    loadmore: number;
  };
}

export const storiesInitialState = {
  resultCumul: [],
  resultInitial: [],
  resultLoadMore: [],
  title: "",
  content: "",
  writerId: "",
  timestamp: "",
  username: "",
  story: {},
  applaudState: [],
  compassionState: [],
  brokenState: [],
  wowState: [],
  NumOfCommentState: 0,
  loadmore: 0,
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
      // console.log("tttttt", action.payload);
      state.wowState = action.payload;
    },
    updateNumOfCommentState: (state, action) => {
      state.NumOfCommentState = action.payload;
    },
    updateResultState: (state, action) => {
      state.resultLoadMore = action.payload;
    },
    updateInitilalResultState: (state, action) => {
      state.resultInitial = action.payload;
    },
    loadMore: (state, action) => {
      state.loadmore = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadStories.fulfilled, (state, action: any) => {
      state.resultInitial = action.payload;
    });
    builder.addCase(loadMoreStories.fulfilled, (state, action: any) => {
      // console.log();
      state.resultLoadMore = action.payload;
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
  loadMore,
  updateResultState,
  updateInitilalResultState,
} = storiesSlice.actions;
export default storiesSlice.reducer;
