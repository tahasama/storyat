import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  Text,
  Button,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import StoryModal from "../StoryModal";
import {
  getstoriesData,
  loadStories,
  reloadInitialData,
} from "../state/reducers/storiesSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeadOfStory from "../Story/HeadOfStory";
import BodyOfStory from "../Story/BodyOfStory";
import FooterOfStory from "../Story/FooterOfStory";
import { getAuthData } from "../state/reducers/authSlice";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const Items = () => {
  const dispatch = useAppDispatch();
  const { reloadState } = useAppSelector(getstoriesData);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const result = async () => await AsyncStorage.getItem("myStoredDataRandom");
  const route = useRoute<any>();
  console.log("route", route.params && route.params.storyId);
  console.log(
    "data",
    data.map((X: any) => X.id)
  );
  // notification stuff

  useEffect(() => {
    setLoading(true),
      result()
        .then((res) => setData(JSON.parse(res)))
        .then(() => dispatch(reloadInitialData(false)))
        .then(() => setLoading(false));
  }, [reloadState]);

  useEffect(() => {
    result().then((res) => setData(JSON.parse(res)));
  }, []);

  useEffect(() => {
    route.params &&
      route.params.storyId &&
      setData(data.filter((x: any) => x.id !== route.params.storyId));
  }, [route]);

  const onRefresh = async () => {
    dispatch(loadStories());
    dispatch(reloadInitialData(true));
    setIsRefreshing(true);
    result()
      .then((res) => setData(JSON.parse(res)))
      .then(() => dispatch(reloadInitialData(false)));
    setIsRefreshing(false);
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    if (scrollPosition > 2000) {
      setIsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else if (scrollPosition < 50) {
      setIsVisible(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
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
        <>
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <TouchableOpacity onPress={onRefresh}>
              <Ionicons
                name={"reload"}
                size={30}
                color={"white"}
                // style={{ marginHorizontal: 10 }}
              />
            </TouchableOpacity>
          </Animated.View>
          <FlatList
            data={data}
            style={{ height: 10000 }}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            onScroll={handleScroll}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <HeadOfStory item={item} />
                <BodyOfStory item={item} />
                <FooterOfStory item={item} />
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
          />
        </>
      )}
      <View style={{ flex: 1 }}>
        <StoryModal />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 20,
    right: 20,
    borderRadius: 100,
    backgroundColor: "#003d55",
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",

    zIndex: 99,
    // padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#051e28",
  },

  item: {
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 22,
    color: "#bcbcbc",
    marginBottom: 25,
    marginHorizontal: 32,
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
    backgroundColor: "#051E28",
  },
  buttonContainer1: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#332FD0",
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
