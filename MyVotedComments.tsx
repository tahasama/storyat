import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import {
  getstoriesData,
  getStory,
  loadStories,
  myStories,
  ReactedToStories,
  // updateResultState,
} from "./state/reducers/storiesSlice";
import { getAuthData } from "./state/reducers/authSlice";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import StoryModal from "./StoryModal";
import {
  AllComments,
  getcommentsData,
  loadAllComments,
} from "./state/reducers/commentsSlice";
import { menuState } from "./state/reducers/headerSlice";

function MyVotedComments({ navigation }) {
  const { votedComments } = useAppSelector(getcommentsData);
  const { user } = useAppSelector(getAuthData);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(AllComments(user.id));
    setTimeout(() => {}, 1000);
  }, []);

  const outputArray = votedComments.reduce((acc, curr) => {
    if (!acc.find((obj) => obj.id === curr.id)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
    // setSelectedId(item.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {outputArray.length === undefined ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            transform: [{ scale: 3 }],
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={outputArray}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TouchableOpacity
                onPress={() => {
                  handleOnpress(item);
                }}
              >
                <View
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
                  <Text style={{ fontSize: 16, color: "white" }}>
                    {item.username}
                  </Text>
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <Text
                  style={[
                    styles.title,
                    {
                      marginHorizontal: 20,
                      color: "#9fa3a7",
                      fontSize: 20,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {item.content}
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  borderBottomColor: "grey",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  marginTop: 15,
                }}
              />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          //   extraData={selectedId}
        />
      )}
    </SafeAreaView>
  );
}
export default MyVotedComments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#333333",
    backgroundColor: "#051e28",
  },

  item: {
    padding: 8,
    marginVertical: 8,
    // marginHorizontal: 16,
    // backgroundColor: "red",
    flex: 1,
  },
  title: {
    fontSize: 22,
    color: "#bcbcbc",
    marginBottom: 25,
    marginHorizontal: 12,
  },

  icon: {
    position: "absolute",
    display: "flex",
    flexDirection: "column-reverse",
    backgroundColor: "#0782F9",
  },
  buttonSpace: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    // backgroundColor: "transparent",
    backgroundColor: "#051E28",
  },
  buttonContainer1: {
    flexDirection: "row",
    justifyContent: "center",
    // backgroundColor: "#051E28",
    // backgroundColor: "#002244",
    backgroundColor: "#332FD0",
    // zIndex: 99,

    alignItems: "center",
    height: 80,
    width: 80,
    borderRadius: 50,
    bottom: 5,
  },
  button: {
    color: "yellow",
    fontSize: 32,
  },
});
