import React, { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getAuthData } from "../state/reducers/authSlice";
import { getstoriesData, Ivoted, vote } from "../state/reducers/storiesSlice";

const FooterOfStory = React.memo(({ item }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { user } = useAppSelector(getAuthData);
  const { IvotedData } = useAppSelector(getstoriesData);

  // console.log(
  //   "IvotedData in item detail",
  //   // IvotedData.includes({ storyId: item.id, voter: user.id })
  //   IvotedData.some(
  //     (element) => element.storyId === item.id && element.voter === user.id
  //   )
  // );

  // const ttt = IvotedData.some(
  //   (element) => element.storyId === item.id && element.voter === user.id
  // );
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
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      <TouchableOpacity
        onPress={() => handleReactions({ item, reaction: "applauds" })}
        style={{ flexDirection: "row" }}
      >
        <MaterialCommunityIcons
          name="hand-clap"
          color={item["applauds"].includes(user.id) ? "#73481c" : "#707070"}
          size={28}
        />
        {item.applauds.length !== 0 && (
          <Text style={{ color: "#9db0c0", fontSize: 11 }}>
            {item.applauds.length}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleReactions({ item, reaction: "compassions" })}
        style={{ flexDirection: "row" }}
      >
        <MaterialCommunityIcons
          name="heart"
          color={item["compassions"].includes(user.id) ? "#4c0000" : "#707070"}
          size={28}
        />
        {item.compassions.length !== 0 && (
          <Text style={{ color: "#9db0c0", fontSize: 11 }}>
            {item.compassions.length}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleReactions({ item, reaction: "brokens" })}
        style={{ flexDirection: "row" }}
      >
        <MaterialCommunityIcons
          name="heart-broken"
          color={item["brokens"].includes(user.id) ? "#5900b2" : "#707070"}
          size={28}
        />
        {item.brokens.length !== 0 && (
          <Text style={{ color: "#9db0c0", fontSize: 11 }}>
            {item.brokens.length}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleReactions({ item, reaction: "justNos" })}
        style={{ flexDirection: "row" }}
      >
        <Feather
          name="trending-down"
          color={item["justNos"].includes(user.id) ? "#305a63" : "#707070"}
          size={28}
        />
        {item.justNos.length !== 0 && (
          <Text style={{ color: "#9db0c0", fontSize: 11 }}>
            {item.justNos.length}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleOnpress(item)}
        style={{
          flexDirection: "row",
          // alignItems: "center",
        }}
      >
        <FontAwesome name="comments" color={"#707070"} size={28} />

        {item.numOfComments !== 0 && (
          <Text style={{ color: "#9db0c0", fontSize: 11 }}>
            {item.numOfComments}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
});

export default FooterOfStory;
