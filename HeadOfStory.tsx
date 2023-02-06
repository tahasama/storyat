import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, Image } from "react-native";

import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, getUser } from "./state/reducers/authSlice";

const HeadOfStory = ({ item }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const handleNavigation = () => {
    setTimeout(() => {
      dispatch(getUser(item.writerId));
      navigation.navigate("profile", { notActualUser: true });
    }, 50);
  };
  return (
    <TouchableOpacity
      onPress={handleNavigation}
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri: item.avatar,
        }}
        style={{
          width: 30,
          height: 30,
          borderRadius: 50,
          marginHorizontal: 10,
          marginVertical: 18,
        }}
      />
      <Text style={{ fontSize: 16, color: "white" }}>{item.username}</Text>
    </TouchableOpacity>
  );
};

export default HeadOfStory;
