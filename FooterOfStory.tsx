import React, { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, getUser } from "./state/reducers/authSlice";

import { useNavigation } from "@react-navigation/native";
import { getHeaderData, menuState } from "./state/reducers/headerSlice";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { vote } from "./state/reducers/storiesSlice";

const FooterOfStory = ({ item }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { user } = useAppSelector(getAuthData);
  const { menuStateValue } = useAppSelector(getHeaderData);

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
  };

  const handleReactions = ({ item, reaction }) => {
    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray =
      reaction === "applauds"
        ? [...item.applauds]
        : reaction === "compassions"
        ? [...item.compassions]
        : reaction === "brokens"
        ? [...item.brokens]
        : [...item.justNos];
    voteArray.length === 0 ? voteArray.push(user.id) : voteArray.pop();

    dispatch(
      vote({
        voteData,
        outputArray: voteArray,
        reaction,
      })
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
          color={
            item.applauds.filter((zzz) => zzz === user.id).length === 0
              ? "#707070"
              : "#73481c"
          }
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
          color={
            item.compassions.filter((zzz) => zzz === user.id).length === 0
              ? "#707070"
              : "#4c0000"
          }
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
          color={
            item.brokens.filter((zzz) => zzz === user.id).length === 0
              ? "#707070"
              : "#5900b2"
          }
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
          color={
            item.justNos.filter((zzz) => zzz === user.id).length === 0
              ? "#707070"
              : "#305a63"
          }
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
};

export default FooterOfStory;
