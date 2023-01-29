import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
  Animated,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";

import { storyRoute } from "./state/reducers/headerSlice";
import {
  getcommentsData,
  loadcomments,
  addcomments,
  removeComment,
  addCommentLike,
  addCommentDislike,
  isCommentLiked,
} from "./state/reducers/commentsSlice";
import Entypo from "@expo/vector-icons/Entypo";
import {} from "./state/reducers/repliesSlice";
import {
  addCommentNumberToStory,
  substractCommentNumberToStory,
  updateNumOfCommentState,
} from "./state/reducers/storiesSlice";

import { useSelector, useDispatch } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import StoryModal from "./StoryModal";
import { getDocs } from "@firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "./firebase";
import { getHeaderData, menuState } from "./state/reducers/headerSlice";
import { getstoriesData, loadStories } from "./state/reducers/storiesSlice";
import { useIsFocused } from "@react-navigation/native";
import GetHeader from "./GetHeader";

const LikeComment = ({ item }) => {
  const { user } = useAppSelector(getAuthData);
  const dispatch = useAppDispatch();
  const { result, resultComments, commentDisliked, commentLiked } =
    useAppSelector(getcommentsData);
  const isFocused = useIsFocused();

  const handleLike = (item) => {
    let liked = item.likes.filter((zzz) => zzz.liker === user.id).length === 0;
    const commentLikesData = {
      commentId: item.id,
      liker: user.id,
      storyId: item.storyId,
    };
    const commentLikesArray = [...item.likes];
    const commentDislikesData = { commentId: item.id, liker: user.id };
    const commentDislikesArray = [...item.dislikes];

    liked ? commentLikesArray.push(commentLikesData) : commentLikesArray.pop();

    item.dislikes.filter((zzz) => zzz.liker === user.id).length !== 0 &&
      commentDislikesArray.pop();
    dispatch(
      addCommentDislike({
        commentDislikesData,
        commentDislikesArray,
      })
    );
    dispatch(
      addCommentLike({
        commentLikesData,
        commentLikesArray,
      })
    );
    isCommentLiked(!liked);
  };

  const handleDislike = (item) => {
    const commentDislikesData = { commentId: item.id, liker: user.id };
    const commentDislikesArray = [...item.dislikes];
    const commentLikesData = { commentId: item.id, liker: user.id };
    const commentLikesArray = [...item.likes];

    item.likes.filter((zzz) => zzz.liker === user.id).length !== 0 &&
      commentLikesArray.pop();

    item.dislikes.filter((zzz) => zzz.liker === user.id).length === 0
      ? commentDislikesArray.push(commentDislikesData)
      : commentDislikesArray.pop();
    dispatch(
      addCommentLike({
        commentLikesData,
        commentLikesArray,
      })
    );
    dispatch(
      addCommentDislike({
        commentDislikesData,
        commentDislikesArray,
      })
    );
    // dispatch(loadcomments(ccc.item.id));
    // setDisLikeLoading(false);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        // disabled={commentLiked && true}
        onPress={() => {
          handleLike(item);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Entypo
            name="arrow-bold-up"
            color={!commentLiked ? "#6a4e7e" : "#3d4c57"}
            size={26}
            style={{ transform: [{ rotate: "40deg" }] }}
          />

          <Text style={{ color: "white" }}>{item.likes.length}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleDislike(item);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Entypo
            name="arrow-bold-down"
            color={
              item.dislikes.filter((zzz) => zzz.liker === user.id).length === 0
                ? "#3d4c57"
                : "#6a4e7e"
            }
            size={26}
            style={{ transform: [{ rotate: "40deg" }] }}
          />

          <Text style={{ color: "white" }}>{item.dislikes.length}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "#051e28",
    // color: "yellow",
    flexDirection: "row",
  },
});

export default LikeComment;
