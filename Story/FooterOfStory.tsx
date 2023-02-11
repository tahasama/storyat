import React, { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getAuthData } from "../state/reducers/authSlice";
import { vote } from "../state/reducers/storiesSlice";

const FooterOfStory = ({ item }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { user } = useAppSelector(getAuthData);

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
  };

  const handleReactions = ({ item, reaction }) => {
    const voteData = {
      voter: user.id,
      story: item,
    };

    dispatch(
      vote({
        voteData,
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
    </View>
  );
};

export default FooterOfStory;
