import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getAuthData } from "../state/reducers/authSlice";
import {
  getstoriesData,
  Ivoted,
  ReactedToStories,
  vote,
} from "../state/reducers/storiesSlice";
import Reaction from "./Reaction";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FooterOfStory = ({ item }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  const { user } = useAppSelector(getAuthData);

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
  };
  function schedulePushNotification() {
    let response = fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: item.pushToken,
        title: "New Reaction",
        body: ` ${
          user.username ? user.username : "Someone"
        } reacted on your story (${item.title} ), check it out !`,

        data: {
          storyId: item.id,
          recipient: item.pushToken,
        },
        channelId: "vvv",
      }),
    });
  }

  const handleReactions = ({ item, reaction }) => {
    const voteData = {
      voter: user.id,
      story: item,
      reaction,
    };

    dispatch(vote(voteData))
      .then(() => dispatch(Ivoted({ voter: user.id, storyId: item.id })))
      .then(() =>
        setTimeout(() => {
          dispatch(ReactedToStories({ userId: user.id })).then(() =>
            schedulePushNotification()
          );
        }, 250)
      );
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      <Reaction
        reaction="applauds"
        item={item}
        handleReactions={handleReactions}
        handleOnpress={handleOnpress}
      />
      <Reaction
        reaction="compassions"
        item={item}
        handleReactions={handleReactions}
        handleOnpress={handleOnpress}
      />
      <Reaction
        reaction="brokens"
        item={item}
        handleReactions={handleReactions}
        handleOnpress={handleOnpress}
      />
      <Reaction
        reaction="justNos"
        item={item}
        handleReactions={handleReactions}
        handleOnpress={handleOnpress}
      />
      <Reaction
        reaction="comments"
        item={item}
        handleReactions={handleReactions}
        handleOnpress={handleOnpress}
      />
    </View>
  );
};

export default FooterOfStory;
