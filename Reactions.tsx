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
import { useRoute } from "@react-navigation/native";
import {
  voteApplaud,
  voteBroken,
  voteCompassion,
  voteWow,
} from "./state/reducers/storiesSlice";
import FontAwesome from "@expo/vector-icons/FontAwesome";
const Reactions = ({ navigation }) => {
  const { resultReactions } = useAppSelector(getstoriesData);
  const { user } = useAppSelector(getAuthData);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const pageName = useRoute().name;

  // console.log("pageName", pageName);
  const [first, setFirst] = useState([]);

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
    //   setSelectedId(item.id);
  };
  console.log("pppppp");
  useEffect(() => {
    setLoading(true),
      dispatch(ReactedToStories({ userId: user.id, pageName: pageName })),
      setLoading(false);
    setTimeout(() => {
      setFirst(resultReactions);
    }, 1000);
  }, [pageName]);
  console.log("first", first);
  const handleApplauded = (item) => {
    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.applauds];
    item?.applauds.filter((zzz) => zzz === user.id).length === 0
      ? voteArray.push(voteData.voter)
      : voteArray.pop();
    dispatch(
      voteApplaud({
        voteData,
        voteArray,
      })
    ).then(() => dispatch(loadStories({ pageName: pageName })));
  };
  const handleFeelingIt = (item) => {
    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.compassions];
    item.compassions.filter((zzz) => zzz === user.id).length === 0
      ? voteArray.push(voteData.voter)
      : voteArray.pop();
    dispatch(
      voteCompassion({
        voteData,
        voteArray,
      })
    ).then(() => dispatch(loadStories({ pageName: pageName })));
  };
  const handleHeartBreaking = (item) => {
    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.brokens];
    item.brokens.filter((zzz) => zzz === user.id).length === 0
      ? voteArray.push(voteData.voter)
      : voteArray.pop();
    dispatch(
      voteBroken({
        voteData,
        voteArray,
      })
    ).then(() => dispatch(loadStories({ pageName: pageName })));
  };
  const handleCantDealWithThis = (item) => {
    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.justNos];
    item.justNos.filter((zzz) => zzz === user.id).length === 0
      ? voteArray.push(voteData.voter)
      : voteArray.pop();
    dispatch(
      voteWow({
        voteData,
        voteArray,
      })
    ).then(() => dispatch(loadStories({ pageName: pageName })));
  };

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
          data={first}
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
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <TouchableOpacity
                  onPress={() => handleApplauded(item)}
                  style={{ flexDirection: "row" }}
                >
                  <MaterialCommunityIcons
                    name="hand-clap"
                    color={
                      item.applauds.filter((zzz) => zzz === user.id).length ===
                      0
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
                  onPress={() => handleFeelingIt(item)}
                  style={{ flexDirection: "row" }}
                >
                  <MaterialCommunityIcons
                    name="heart"
                    color={
                      item.compassions.filter((zzz) => zzz === user.id)
                        .length === 0
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
                  onPress={() => handleHeartBreaking(item)}
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
                  onPress={() => handleCantDealWithThis(item)}
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

export default Reactions;

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
