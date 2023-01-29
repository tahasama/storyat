import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,
  Modal,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import StoryModal from "./StoryModal";
import { getDocs } from "@firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "./firebase";
import { getHeaderData, menuState } from "./state/reducers/headerSlice";
import {
  getstoriesData,
  loadMore,
  loadMoreStories,
  loadStories,
  updateApplaudState,
  updateBrokenState,
  updateCompassionState,
  updateInitilalResultState,
  updateResultState,
  updateWowState,
  voteApplaud,
  voteBroken,
  voteCompassion,
  voteWow,
} from "./state/reducers/storiesSlice";
import { useIsFocused, useRoute } from "@react-navigation/native";

const Items = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getAuthData);
  const { menuStateValue } = useAppSelector(getHeaderData);
  const {
    resultLoadMore,
    resultInitial,
    resultCumul,
    brokenState,
    applaudState,
    compassionState,
    wowState,
  } = useAppSelector(getstoriesData);
  const [selectedId, setSelectedId] = useState(null);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [data, setData] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const pageName = useRoute().name;

  const randomm = () => {
    let yyy = [...resultInitial];
    return yyy.sort(() => Math.random() - 0.3);
  };

  const randomMore = () => {
    let yyy = [...resultLoadMore];
    return yyy.sort(() => Math.random() - 0.3);
  };

  // console.log(
  //   "resultInitial",
  //   resultInitial.map((x) => x.title),
  //   "resultLoadMore",
  //   resultLoadMore.map((x) => x.title),
  //   "randomm",
  //   randomm().map((x) => x.title),
  //   "applaudState",
  //   applaudState
  // );

  const handleLoadMore = async () => {
    setLoadingMore(true);

    dispatch(
      loadMoreStories({
        pageName: pageName,
        resultLength:
          resultLoadMore.length === 0
            ? resultInitial.length
            : resultLoadMore.length,
        resultInitial:
          resultLoadMore.length === 0 ? resultInitial : resultLoadMore,
      })
    );
    setLoadingMore(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(loadStories({ pageName: pageName }));

    setRefreshing(false);
  };

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
    setSelectedId(item.id);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(updateResultState([]));
    dispatch(updateInitilalResultState([]));
    isFocused && dispatch(loadStories({ pageName: pageName }));

    // dispatch(updateResultState(resultInitial));
    setLoading(false);
    // console.log("resultInitial", resultInitial);
  }, [isFocused]);

  useEffect(() => {
    dispatch(menuState(false));
    isFocused && dispatch(updateApplaudState([]));
    isFocused && dispatch(updateCompassionState([]));
    isFocused && dispatch(updateBrokenState([]));
    isFocused && dispatch(updateWowState([]));
  }, [isFocused]);

  console.log("gggggggg", applaudState, "data", data);

  useEffect(() => {
    menuStateValue ? navigation.openDrawer() : navigation.closeDrawer();
  }, [menuStateValue]);

  const handleApplauded = (item) => {
    let inter = [...applaudState];
    setData(applaudState.reduce((x, y) => x + (y === item.id), 0));
    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.applauds];
    item?.applauds.filter((zzz) => zzz.voter === user.id).length === 0
      ? voteArray.push(voteData)
      : voteArray.pop();
    dispatch(
      voteApplaud({
        voteData,
        voteArray,
      })
    ).then(() => dispatch(updateApplaudState([...applaudState, item.id])));
    // .then(() => dispatch(loadStories({ pageName: pageName })));
  };
  const handleFeelingIt = (item) => {
    let inter = [...compassionState];

    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.compassions];

    item.compassions.filter((zzz) => zzz.voter === user.id).length === 0
      ? voteArray.push(voteData)
      : voteArray.pop();

    dispatch(
      voteCompassion({
        voteData,
        voteArray,
      })
    );
    // .then(() =>
    //   dispatch(
    //     updateCompassionState(
    //       inter.filter((zzz) => zzz === item.id).length !== 0
    //         ? inter.filter((zzz) => zzz !== item.id)
    //         : [...compassionState, item.id]
    //     )
    //   )
    // );
    // .then(() => dispatch(loadStories({ pageName: pageName })));
  };

  const handleHeartBreaking = (item) => {
    let interb = [...brokenState];

    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.brokens];
    item.brokens.filter((zzz) => zzz.voter === user.id).length === 0
      ? voteArray.push(voteData)
      : voteArray.pop();
    dispatch(
      voteBroken({
        voteData,
        voteArray,
      })
    );
    // .then(() =>
    //   dispatch(
    //     updateBrokenState(
    //       interb.filter((zzz) => zzz === item.id).length !== 0
    //         ? interb.filter((zzz) => zzz !== item.id)
    //         : [...brokenState, item.id]
    //     )
    //   )
    // );
    // .then(() => dispatch(loadStories({ pageName: pageName })));
  };
  const handleCantDealWithThis = (item) => {
    let inter = [...wowState];
    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.justNos];
    item.justNos.filter((zzz) => zzz.voter === user.id).length === 0
      ? voteArray.push(voteData)
      : voteArray.pop();
    dispatch(
      voteWow({
        voteData,
        voteArray,
      })
    );

    // dispatch(
    //   updateWowState(
    //     inter.filter((zzz) => zzz === item.id).length !== 0
    //       ? inter.filter((zzz) => zzz !== item.id)
    //       : [...wowState, item.id]
    //     // : inter.filter((zzz) => console.log("9999", zzz))
    //   )
    // );

    dispatch(loadStories({ pageName: pageName }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
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
          onEndReached={handleLoadMore}
          refreshControl={
            <RefreshControl
              colors={["#14764b", "#0F5838", "#093421"]}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          data={
            pageName !== "items"
              ? resultLoadMore.length === 0
                ? resultInitial
                : resultLoadMore
              : resultLoadMore.length === 0
              ? randomm()
              : randomMore()
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              {/* <Text style={{ color: "white", height: 400 }}>{item.id}</Text> */}
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
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <TouchableOpacity onPress={() => handleApplauded(item)}>
                  <MaterialCommunityIcons
                    name="hand-clap"
                    color={
                      (item.applauds.filter((zzz) => zzz.voter === user.id)
                        .length !== 0 &&
                        applaudState.reduce((x, y) => x + (y === item.id), 0) %
                          2 ===
                          0) ||
                      (item.applauds.filter((zzz) => zzz.voter === user.id)
                        .length === 0 &&
                        applaudState.reduce((x, y) => x + (y === item.id), 0) %
                          2 !==
                          0)
                        ? "#73481c"
                        : "#707070"
                    }
                    size={28}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFeelingIt(item)}>
                  <MaterialCommunityIcons
                    name="heart"
                    color={
                      compassionState.filter((zzz) => zzz === item.id)
                        .length !== 0 ||
                      item.compassions.filter((zzz) => zzz.voter === user.id)
                        .length !== 0
                        ? "#4c0000"
                        : "#707070"
                    }
                    size={28}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleHeartBreaking(item)}>
                  <MaterialCommunityIcons
                    name="heart-broken"
                    color={
                      brokenState.filter((zzz) => zzz === item.id).length !==
                        0 ||
                      item.brokens.filter((zzz) => zzz.voter === user.id)
                        .length !== 0
                        ? "#5900b2"
                        : "#707070"
                    }
                    size={28}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCantDealWithThis(item)}>
                  <Feather
                    name="trending-down"
                    color={
                      wowState.filter((zzz) => zzz === item.id).length !== 0 ||
                      item.justNos.filter((zzz) => zzz.voter === user.id)
                        .length !== 0
                        ? "#305a63"
                        : "#707070"
                    }
                    size={28}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOnpress(item)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // justifyContent: "space-between",
                  }}
                >
                  <FontAwesome name="comments" color={"#707070"} size={28} />

                  {item.numOfComments !== 0 && (
                    <Text
                      style={{
                        color: "white",
                        padding: 0,
                        marginHorizontal: 5,
                      }}
                    >
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
          extraData={selectedId}
        />
      )}

      <View style={{ flex: 1 }}>
        <StoryModal />
      </View>
    </SafeAreaView>
  );
};

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

export default Items;
