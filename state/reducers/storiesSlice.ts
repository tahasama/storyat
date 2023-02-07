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

    const arrRes = await Promise.all(results);

    const setRes = new Set(arrRes);
    const result = Array.from(setRes);

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
    const res = (await getDoc(doc(db, "stories", storyId))).data();

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

      return res;
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

export const vote = createAsyncThunk("vote", async (infos: any) => {
  try {
    const res =
      infos.reaction === "applauds"
        ? await updateDoc(doc(db, "stories", infos.voteData.storyId), {
            applauds: infos.outputArray,
          })
        : infos.reaction === "compassions"
        ? await updateDoc(doc(db, "stories", infos.voteData.storyId), {
            compassions: infos.outputArray,
          })
        : infos.reaction === "brokens"
        ? await updateDoc(doc(db, "stories", infos.voteData.storyId), {
            brokens: infos.outputArray,
          })
        : infos.reaction === "justNos" &&
          (await updateDoc(doc(db, "stories", infos.voteData.storyId), {
            justNos: infos.outputArray,
          }));
    return res;
  } catch (e) {
    Alert.alert("action failed please try again");
  }
});

export const voteBroken = createAsyncThunk(
  "voteApplaud",
  async (infos: any) => {
    try {
      const res = await updateDoc(doc(db, "stories", infos.voteData.storyId), {
        brokens: infos.voteArray,
      });
      return res;
    } catch (e) {
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
    Alert.alert("action failed please try again");
  }
});

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
    // updateResultState: (state, action) => {
    //   state.resultLoadMore = action.payload;
    // },
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
  },
  extraReducers: (builder) => {
    builder.addCase(loadStories.fulfilled, (state, action: any) => {
      state.resultInitial = action.payload;
    });
    // builder.addCase(loadMoreStories.fulfilled, (state, action: any) => {
    //   state.resultLoadMore = action.payload;
    // });
    builder.addCase(getStory.fulfilled, (state, action) => {
      state.story = action.payload;
    });
    builder.addCase(myStories.fulfilled, (state, action) => {
      state.result = action.payload;
    });
    builder.addCase(ReactedToStories.fulfilled, (state, action) => {
      state.resultReactions = action.payload;
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
  // updateResultState,
  updateInitilalResultState,
  reactedToStoriesState,
  updateStoriesState,
  updateStory,
} = storiesSlice.actions;
export default storiesSlice.reducer;
