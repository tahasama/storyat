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

function MyReactions({ navigation }) {
  const { resultReactions } = useAppSelector(getstoriesData);
  const { user } = useAppSelector(getAuthData);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  console.log("HHHHHH", resultReactions);
  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
    //   setSelectedId(item.id);
  };
  useEffect(() => {
    dispatch(menuState(false)),
      setLoading(true),
      dispatch(ReactedToStories({ pageName: user.id })),
      setLoading(false);
  }, []);
  const Reactions = () => {
    return (
      <SafeAreaView style={styles.container}>
        {resultReactions.length === undefined ? (
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
            data={resultReactions}
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
                      { marginHorizontal: 20, color: "#9fa3a7", fontSize: 20 },
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
            keyExtractor={(item) => {
              return item.id;
            }}
            // extraData={selectedId}
          />
        )}
      </SafeAreaView>
    );
  };

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        header: () => null,
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
        name="applaud"
        component={Reactions}
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
        name="heart"
        component={Reactions}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={"#4c0000"} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="broken heart"
        component={Reactions}
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
        name="down trend"
        component={Reactions}
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
