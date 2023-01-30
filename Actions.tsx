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
  updateResultState,
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

const Actions = () => {
  const { result } = useAppSelector(getstoriesData);
  const { user } = useAppSelector(getAuthData);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(menuState(false)),
      setLoading(true),
      dispatch(myStories({ pageName: user.id })),
      setLoading(false);
  }, []);

  function MyStories({ navigation }) {
    const handleOnpress = (item) => {
      navigation.navigate("item", { item: item });
      setSelectedId(item.id);
    };
    return (
      <SafeAreaView style={styles.container}>
        {result.length === undefined ? (
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
            data={result}
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
            extraData={selectedId}
          />
        )}

        <View style={{ flex: 1 }}>
          <StoryModal />
        </View>
      </SafeAreaView>
    );
  }

  function MyComments({ navigation }) {
    const { resultComments } = useAppSelector(getcommentsData);

    const { story } = useAppSelector(getstoriesData);
    const dispatch = useAppDispatch();
    const [stories, setStories] = useState([]);
    useEffect(() => {
      dispatch(loadAllComments({ userId: user.id }));
    }, []);
    const outputArray = resultComments.reduce((acc, curr) => {
      if (!acc.find((obj) => obj.id === curr.id)) {
        acc.push(curr);
      }
      return acc;
    }, []);

    // let myComments = resultAll.filter((xxx) => xxx.commenter === user.id);
    // myComments.map((vvv) => dispatch(getStory(vvv.storyId)));

    const handleOnpress = (item) => {
      navigation.navigate("item", { item: item });
      setSelectedId(item.id);
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
            extraData={selectedId}
          />
        )}

        <View style={{ flex: 1 }}>
          <StoryModal />
        </View>
      </SafeAreaView>
    );
  }

  function MyReactions({ navigation }) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>myReactions</Text>
      </SafeAreaView>
    );
  }

  function MyVotedComments({ navigation }) {
    const { votedComments } = useAppSelector(getcommentsData);
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
      setSelectedId(item.id);
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
            extraData={selectedId}
          />
        )}

        <View style={{ flex: 1 }}>
          <StoryModal />
        </View>
      </SafeAreaView>
    );
  }

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
      <Tab.Screen name="My stories" component={MyStories} />
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
