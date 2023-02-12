import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "../../firebase";

interface storyProps {
  userId: string;
  title: string;
  content: string;
}

export const myStories = createAsyncThunk(
  "myStories",
  async ({ userId }: any) => {
    const yo = collection(db, "stories");
    const g = query(yo, where("writerId", "==", userId));

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

    try {
      await AsyncStorage.setItem("myStoredStories", JSON.stringify(result));
    } catch (error) {
      console.log("error", error);
    }

    return result;
  }
);

export const ReactedToStories = createAsyncThunk(
  "ReactedToStories",
  async ({ userId }: any) => {
    const results: any = [];

    const yo = collection(db, "stories");
    const g = query(yo, where("brokens", "array-contains", userId));
    const h = query(yo, where("compassions", "array-contains", userId));
    const e = query(yo, where("applauds", "array-contains", userId));
    const f = query(yo, where("jusNos", "array-contains", userId));

    const querySnapshotg = await getDocs(g);
    querySnapshotg.docs.map(async (docs: any) => {
      const username = await (
        await getDoc(doc(db, "users", docs.data().writerId))
      ).data().username;
      const avatar = await (
        await getDoc(doc(db, "users", docs.data().writerId))
      ).data().avatar;
      results.push({
        ...docs.data(),
        id: docs.id,
        username: username,
        avatar: avatar,
      });
    });
    const querySnapshoth = await getDocs(h);
    querySnapshoth.docs.map(async (docs: any) => {
      const username = await (
        await getDoc(doc(db, "users", docs.data().writerId))
      ).data().username;
      const avatar = await (
        await getDoc(doc(db, "users", docs.data().writerId))
      ).data().avatar;
      results.push({
        ...docs.data(),
        id: docs.id,
        username: username,
        avatar: avatar,
      });
    });
    const querySnapshote = await getDocs(e);
    querySnapshote.docs.map(async (docs: any) => {
      const username = await (
        await getDoc(doc(db, "users", docs.data().writerId))
      ).data().username;
      const avatar = await (
        await getDoc(doc(db, "users", docs.data().writerId))
      ).data().avatar;
      results.push({
        ...docs.data(),
        id: docs.id,
        username: username,
        avatar: avatar,
      });
    });
    const querySnapshotf = await getDocs(f);
    querySnapshotf.docs.map(async (docs: any) => {
      const username = await (
        await getDoc(doc(db, "users", docs.data().writerId))
      ).data().username;
      const avatar = await (
        await getDoc(doc(db, "users", docs.data().writerId))
      ).data().avatar;
      results.push({
        ...docs.data(),
        id: docs.id,
        username: username,
        avatar: avatar,
      });
    });

    const arr = await Promise.all(results);
    console.log("111", arr);
    const result = arr.filter(
      (obj, index, self) => self.findIndex((t) => t.id === obj.id) === index
    );

    console.log("222", arr);

    try {
      await AsyncStorage.setItem(
        "myStoredDataApplaudsReaction",
        JSON.stringify(result.filter((x) => x.applauds.includes(userId)))
      );

      await AsyncStorage.setItem(
        "myStoredDataCompassionsReaction",
        JSON.stringify(result.filter((x) => x.compassions.includes(userId)))
      );
      await AsyncStorage.setItem(
        "myStoredDataBrokensReaction",
        JSON.stringify(result.filter((x) => x.brokens.includes(userId)))
      );
      await AsyncStorage.setItem(
        "myStoredDataJustNosReaction",
        JSON.stringify(result.filter((x) => x.justNos.includes(userId)))
      );
    } catch (error) {}

    return result;
  }
);

export const loadStories = createAsyncThunk("loadStories", async () => {
  const yo = collection(db, "stories");
  const querySnapshot = await getDocs(yo);
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

  try {
    await AsyncStorage.setItem(
      "myStoredDataApplauds",
      JSON.stringify(resultInitial.filter((x) => x.applauds.length !== 0))
    );

    await AsyncStorage.setItem(
      "myStoredDataCompassions",
      JSON.stringify(resultInitial.filter((x) => x.compassions.length !== 0))
    );
    await AsyncStorage.setItem(
      "myStoredDataBrokens",
      JSON.stringify(resultInitial.filter((x) => x.brokens.length !== 0))
    );
    await AsyncStorage.setItem(
      "myStoredDataJustNos",
      JSON.stringify(resultInitial.filter((x) => x.justNos.length !== 0))
    );
    await AsyncStorage.setItem(
      "myStoredDataTimestamp",
      JSON.stringify(resultInitial.filter((x) => x.timestamp.length !== 0))
    );
    await AsyncStorage.setItem(
      "myStoredDataRandom",
      JSON.stringify(resultInitial.sort(() => Math.random() - 0.3))
    );
  } catch (error) {
    console.error(error);
  }
  return resultInitial;
});

export const getStory = createAsyncThunk("getStory", async (storyId: any) => {
  try {
    const res = await getDoc(doc(db, "stories", storyId));
    // const res = {...xxx.data().id }

    return res;
  } catch (e) {
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
      try {
        const result = await getDoc(doc(db, "stories", res.id));
        const username = await (
          await getDoc(doc(db, "users", result.data().writerId))
        ).data().username;
        const avatar = await (
          await getDoc(doc(db, "users", result.data().writerId))
        ).data().avatar;
        return {
          id: result.id,
          ...result.data(),
          username: username,
          avatar: avatar,
        };
      } catch (error) {
        console.log("result getDoc errorrrrr", error);
      }
    } catch (e) {
      Alert.alert("action failed please try again");
    }
  }
);

export const updateStories = createAsyncThunk(
  "updateStories",
  async ({ title, content, storyId }: any) => {
    try {
      const res = await updateDoc(doc(db, "stories", storyId), {
        title: title,
        content: content,
      });
      try {
        const result = await getDoc(doc(db, "stories", storyId));
        const username = await (
          await getDoc(doc(db, "users", result.data().writerId))
        ).data().username;
        const avatar = await (
          await getDoc(doc(db, "users", result.data().writerId))
        ).data().avatar;
        return {
          id: result.id,
          ...result.data(),
          username: username,
          avatar: avatar,
        };
      } catch (error) {
        console.log("result getDoc errorrrrr", error);
      }

      return res;
    } catch (e) {
      Alert.alert("action failed please try again");
    }
  }
);

export const removeStory = createAsyncThunk(
  "removeStory",
  async ({ storyId }: any) => {
    try {
      const res = await deleteDoc(doc(db, "stories", storyId));

      return res;
    } catch (e) {
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
      Alert.alert("action failed please try again");
    }
  }
);

export const vote = createAsyncThunk(
  "vote",
  async (infos: any, { rejectWithValue }) => {
    if (infos.reaction === "applauds") {
      const voterIndexApplauds = infos.story.applauds.indexOf(infos.voter);

      if (voterIndexApplauds !== -1) {
        infos.story.applauds.splice(voterIndexApplauds, 1);
      } else {
        infos.story.applauds.push(infos.voter);
      }

      try {
        await updateDoc(doc(db, "stories", infos.story.id), {
          applauds: infos.story.applauds,
        });
      } catch (error) {
        console.log("this is applauds error", error);
      }
    }
    if (infos.reaction === "compassions") {
      const voterIndexCompassions = infos.story.compassions.indexOf(
        infos.voter
      );
      if (voterIndexCompassions !== -1) {
        infos.story.compassions.splice(voterIndexCompassions, 1);
      } else {
        infos.story.compassions.push(infos.voter);
      }
      await updateDoc(doc(db, "stories", infos.story.id), {
        compassions: infos.story.compassions,
      });
    }
    if (infos.reaction === "brokens") {
      const voterIndexBrokens = infos.story.brokens.indexOf(infos.voter);
      if (voterIndexBrokens !== -1) {
        infos.story.brokens.splice(voterIndexBrokens, 1);
      } else {
        infos.story.brokens.push(infos.voter);
      }
      await updateDoc(doc(db, "stories", infos.story.id), {
        brokens: infos.story.brokens,
      });
    }
    if (infos.reaction === "justNos") {
      const voterIndexJustNos = infos.story.justNos.indexOf(infos.voter);
      if (voterIndexJustNos !== -1) {
        infos.story.justNos.splice(voterIndexJustNos, 1);
      } else {
        infos.story.justNos.push(infos.voter);
      }
      await updateDoc(doc(db, "stories", infos.story.id), {
        justNos: infos.story.justNos,
      });
    }
  }
);

export interface storiesProps {
  storiesStates: {
    result: any[];
    resultInitial: any[];
    resultReactions: any[];
    myReactedToStories: any[];

    // resultLoadMore: any[];
    title: string;
    content: string;
    writerId: string;
    timestamp: string;
    username: string;
    story: any;
    myupdateStoriesState: any;
    myupdateStoryState: any;
    applaudState: any[];
    applaudArray: any[];

    compassionState: boolean;
    compassionArray: any[];

    brokenState: boolean;
    brokenArray: any[];

    wowState: boolean;
    wowArray: any[];

    NumOfCommentState: number;
    // loadmore: number;
    reloadState: boolean;
    IvotedData: any[];
    resultAdd: any;
    resultUpdate: any;
  };
}

export const storiesInitialState = {
  result: [],
  resultInitial: [],
  resultReactions: [],
  myReactedToStories: [],
  // resultLoadMore: [],
  title: "",
  content: "",
  writerId: "",
  timestamp: "",
  username: "",
  story: {},

  applaudState: [],
  applaudArray: [],

  compassionState: false,
  compassionArray: [],

  brokenState: false,
  brokenArray: [],

  wowState: false,
  wowArray: [],

  NumOfCommentState: 0,
  // loadmore: 0,
  myupdateStoriesState: {},
  myupdateStoryState: [],
  reloadState: false,
  resultAdd: {},
  resultUpdate: {},
  IvotedData: [{ storyId: "", voter: "" }],
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

    updateInitilalResultState: (state, action) => {
      state.resultInitial = action.payload;
    },
    reactedToStoriesState: (state, action) => {
      state.myReactedToStories = action.payload;
    },
    updateStoriesState: (state, action) => {
      state.myupdateStoriesState = action.payload;
    },
    updateStory: (state, action) => {
      state.myupdateStoryState = action.payload;
    },
    reloadInitialData: (state, action) => {
      state.reloadState = action.payload;
    },
    Ivoted: (state, action) => {
      state.IvotedData.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadStories.fulfilled, (state, action: any) => {
      state.resultInitial = action.payload;
    });
    builder.addCase(addStories.fulfilled, (state, action: any) => {
      console.log("action.payload", action.payload);
      state.resultAdd = action.payload;
    });
    builder.addCase(updateStories.fulfilled, (state, action: any) => {
      console.log("action.payload", action.payload);
      state.resultUpdate = action.payload;
    });
    builder.addCase(getStory.fulfilled, (state, action) => {
      state.story = action.payload;
    });
    builder.addCase(myStories.fulfilled, (state, action) => {
      state.result = action.payload;
    });
    builder.addCase(ReactedToStories.fulfilled, (state, action) => {
      state.resultReactions = action.payload;
    });
    // builder.addCase(vote.fulfilled, (state, action) => {
    //   state. = action.payload;
    // });
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
  // updateResultState,
  updateInitilalResultState,
  reactedToStoriesState,
  updateStoriesState,
  updateStory,
  reloadInitialData,
  Ivoted,
} = storiesSlice.actions;
export default storiesSlice.reducer;
