import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";

const BodyOfStory = ({ item }: any) => {
  const navigation = useNavigation<any>();

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          handleOnpress(item);
        }}
      >
        <Text style={[styles.title, { textAlign: "center" }]}>
          {item.title}
        </Text>
        <Text
          style={[
            styles.title,
            { marginHorizontal: 10, color: "#9fa3a7", fontSize: 20 },
          ]}
          numberOfLines={2}
        >
          {"\t"} {item.content}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default BodyOfStory;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    color: "#bcbcbc",
    marginBottom: 25,
    marginHorizontal: 32,
    minHeight: 80,
  },
});
