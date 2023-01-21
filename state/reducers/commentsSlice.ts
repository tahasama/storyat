import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "../../firebase";

// const USER_URL: any = process.env.REACT_APP_USER_URL;

interface commentProps {
  userId: string;
  storyId: string;
  comment: string;
  likes: any[];
  dislikes: any[];
}

export const loadcomments = createAsyncThunk(
  "loadcomments",
  async (storyId: string) => {
    try {
      const q = query(
        collection(db, "comments"),
        where("storyId", "==", storyId)
      );
      const querySnapshot = await getDocs(q);
      const promises = querySnapshot.docs.map(async (docs: any) => {
        const username = await (
          await getDoc(doc(db, "users", docs.data().commenter))
        ).data().username;
        const avatar = await (
          await getDoc(doc(db, "users", docs.data().commenter))
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
    } catch (error: any) {
      return error;
    }
  }
);

export const addcomments = createAsyncThunk(
  "addcomments",
  async ({ comment, userId, storyId }: commentProps) => {
    try {
      const res = await addDoc(collection(db, "comments"), {
        comment: comment,
        commenter: userId,
        storyId: storyId,
        timestamp: Date.now(),
        likes: [],
        dislikes: [],
      });
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const getComment = createAsyncThunk(
  "getComment",
  async (commentId: any) => {
    try {
      const res = (await getDoc(doc(db, "comments", commentId))).data();
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const addCommentLike = createAsyncThunk(
  "addCommentLike",
  async (commentLikesInfos: any) => {
    try {
      const res = await updateDoc(
        doc(db, "comments", commentLikesInfos.commentLikesData.commentId),
        {
          likes: commentLikesInfos.commentLikesArray,
        }
      );
      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const addCommentDislike = createAsyncThunk(
  "addCommentDislike",
  async (commentDislikesInfos: any) => {
    try {
      const res = await updateDoc(
        doc(db, "comments", commentDislikesInfos.commentDislikesData.commentId),
        {
          dislikes: commentDislikesInfos.commentDislikesArray,
        }
      );

      return res;
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  }
);

export const removeComment = createAsyncThunk(
  "removeComment",
  async (commentId: any) => {
    deleteDoc(doc(db, "comments", commentId));
  }
);

export interface commentsProps {
  commentsStates: {
    result: any[];
    comment: string;
    commenter: string;
    timestamp: string;
    likes: any[];
    dislikes: any[];
    commentLiked: boolean;
    commentDisliked: boolean;
    cleanArray: any[];
  };
}

export const commentsInitialState = {
  result: [],
  comment: "",
  commenter: "",
  timestamp: "",
  likes: [],
  dislikes: [],
  commentLiked: false,
  commentDisliked: false,
  cleanArray: [],
};

export const commentsSlice = createSlice({
  name: "comments-redux",
  initialState: commentsInitialState,
  reducers: {
    isCommentLiked: (state, action) => {
      state.commentLiked = action.payload;
    },
    isCommentDisliked: (state, action) => {
      state.commentDisliked = action.payload;
    },
    cleanArray: (state, action) => {
      state.likes.pop();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadcomments.fulfilled, (state, action: any) => {
      state.result = action.payload;
    });
    builder.addCase(getComment.fulfilled, (state, action) => {
      state.likes = action.payload.likes;
      console.log("1234567", action.payload.likes);
      state.dislikes = action.payload.dislikes;
    });
  },
});

export const getcommentsData = (state: commentsProps) => state.commentsStates;
export const { isCommentLiked, isCommentDisliked } = commentsSlice.actions;
export default commentsSlice.reducer;
