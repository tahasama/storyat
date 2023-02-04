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
import MyStories from "./MyStories";
import {
  AllComments,
  getcommentsData,
  loadAllComments,
} from "./state/reducers/commentsSlice";
import { menuState } from "./state/reducers/headerSlice";
import MyComments from "./MyComments";
import MyReactions from "./MyReactions";
import MyVotedComments from "./MyVotedComments";

const Actions = ({ navigation, route }) => {
  // const { user } = useAppSelector(getAuthData);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 14,
          textTransform: "capitalize",
          color: "#9ba5a9",
        },
        tabBarItemStyle: { padding: 9 },
        tabBarStyle: {
          backgroundColor: "#051e2d",
          // borderBottomWidth: 4,
          borderBottomColor: "#9ba5a9",
          borderStyle: "solid",
          elevation: 10,
        },
      }}
    >
      <Tab.Screen
        name="My stories"
        children={() => <MyStories theUser={route.params} />}
      />
      <Tab.Screen name="My comments" component={MyComments} />
      <Tab.Screen name="My reactions" component={MyReactions} />
      <Tab.Screen name="My voted comments" component={MyVotedComments} />
    </Tab.Navigator>
  );
};

export default Actions;

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
