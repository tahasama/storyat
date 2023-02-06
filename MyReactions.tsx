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
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import Reactions from "./Reactions";

function MyReactions({ navigation, theUser }: any) {
  const { resultReactions } = useAppSelector(getstoriesData);
  const { user } = useAppSelector(getAuthData);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  // console.log("787878", theUser);

  useEffect(() => {
    dispatch(menuState(false));
  }, []);

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveBackgroundColor: "#213242",
        // tabBarInactiveBackgroundColor: "#051e2d",
        header: () => null,
        tabBarItemStyle: { borderRadius: 20 },
        tabBarStyle: { backgroundColor: "#051e2d" },
      }}
    >
      <Tab.Screen
        name="applauds"
        children={() => <Reactions theUser={theUser} />}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="hand-clap"
              color={"#73481c"}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="compassions"
        children={() => <Reactions theUser={theUser} />}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={"#4c0000"} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="brokens"
        children={() => <Reactions theUser={theUser} />}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="heart-broken"
              color={"#5900b2"}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="justNos"
        children={() => <Reactions theUser={theUser} />}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="trending-down" color={"#305a63"} size={28} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default MyReactions;

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
