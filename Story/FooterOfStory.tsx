import React, { useEffect, useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getAuthData } from "../state/reducers/authSlice";
import {
  getstoriesData,
  Ivoted,
  ReactedToStories,
  vote,
} from "../state/reducers/storiesSlice";
import FlashMessage, { showMessage } from "react-native-flash-message";
import Reaction from "./Reaction";

const FooterOfStory = ({ item }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { IvotedData } = useAppSelector(getstoriesData);
  const [message, setMessage] = useState(false);
  const { user } = useAppSelector(getAuthData);

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
  };

  const handleReactions = ({ item, reaction }) => {
    const voteData = {
      voter: user.id,
      story: item,
      reaction,
    };

    dispatch(vote(voteData)).then(() =>
      dispatch(Ivoted({ voter: user.id, storyId: item.id }))
    );

    dispatch(ReactedToStories({ userId: user.id }));

    // : showMessage({
    //     message: "You cant react to your own stories",
    //     type: "info",
    //   });
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
// (prevProps, nextProps) => {
//   return prevProps.item === nextProps.item;
// }

export default React.memo(FooterOfStory);
