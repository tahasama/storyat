import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";

import {
  getcommentsData,
  addCommentLike,
  addCommentDislike,
  isCommentLiked,
} from "./state/reducers/commentsSlice";
import Entypo from "@expo/vector-icons/Entypo";

const LikeComment = ({ item }) => {
  const { user } = useAppSelector(getAuthData);
  const dispatch = useAppDispatch();
  const { commentLiked } = useAppSelector(getcommentsData);

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
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
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
    flexDirection: "row",
  },
});

export default LikeComment;
