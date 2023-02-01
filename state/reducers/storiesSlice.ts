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

interface storyProps {
  userId: string;
  title: string;
  content: string;
}

export const myStories = createAsyncThunk(
  "myStories",
  async ({ pageName }: any) => {
    const yo = collection(db, "stories");
    const g = query(yo, where("writerId", "==", pageName));

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

    return result;
  }
);

export const ReactedToStories = createAsyncThunk(
  "ReactedToStories",
  async ({ pageName }: any) => {
    console.log("333333333", pageName);
    const yo = collection(db, "stories");
    const g = query(yo, where("applauds", "array-contains", pageName));

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
    console.log("@@@@@@", result);

    return result;
  }
);

export const loadStories = createAsyncThunk(
  "loadStories",
  async ({ pageName }: any) => {
    const yo = collection(db, "stories");
    const g =
      pageName === "items"
        ? query(yo, orderBy("timestamp", "desc"))
        : query(
            yo,
            where(pageName, "!=", []),
            orderBy(pageName, "desc")
            // limit(4)
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

// export const loadMoreStories = createAsyncThunk(
//   "loadMoreStories",
//   async ({ pageName, resultInitial }: any) => {
//     try {
//       const yo = collection(db, "stories");
//       const g =
//         pageName === "items"
//           ? query(
//               yo,
//               orderBy("timestamp", "desc"),
//               limit(2),
//               startAfter(resultInitial[resultInitial.length - 1].timestamp)
//             )
//           : query(
//               yo,
//               where(pageName, "!=", []),
//               orderBy(pageName, "desc"),
//               limit(2),
//               startAfter(
//                 pageName === "applauds"
//                   ? resultInitial[resultInitial.length - 1].applauds
//                   : pageName === "timestamp"
//                   ? resultInitial[resultInitial.length - 1].timestamp
//                   : pageName === "compassions"
//                   ? resultInitial[resultInitial.length - 1].compassions
//                   : pageName === "brokens"
//                   ? resultInitial[resultInitial.length - 1].brokens
//                   : pageName === "justNos" &&
//                     resultInitial[resultInitial.length - 1].justNos
//               )
//             );

//       const querySnapshot = await getDocs(g);
//       const promises = querySnapshot.docs.map(async (docs: any) => {
//         const username = await (
//           await getDoc(doc(db, "users", docs.data().writerId))
//         ).data().username;
//         const avatar = await (
//           await getDoc(doc(db, "users", docs.data().writerId))
//         ).data().avatar;
//         return {
//           ...docs.data(),
//           id: docs.id,
//           username: username,
//           avatar: avatar,
//         };
//       });

//       const result = await Promise.all(promises);
//       const resultw = [...resultInitial];
//       resultw.push(...result);

//       return resultw;
//     } catch (error) {
//       console.log("MMMMMMMMMM", error);
//     }
//   }
// );

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
    resultInitial: any[];
    resultReactions: any[];
    // resultLoadMore: any[];
    title: string;
    content: string;
    writerId: string;
    timestamp: string;
    username: string;
    story: any;
    applaudState: boolean;
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
  // resultLoadMore: [],
  title: "",
  content: "",
  writerId: "",
  timestamp: "",
  username: "",
  story: {},

  applaudState: false,
  applaudArray: [],

  compassionState: false,
  compassionArray: [],

  brokenState: false,
  brokenArray: [],

  wowState: false,
  wowArray: [],

  NumOfCommentState: 0,
  // loadmore: 0,
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
} = storiesSlice.actions;
export default storiesSlice.reducer;
