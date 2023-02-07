import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { useIsFocused, useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getAuthData } from "../state/reducers/authSlice";
import { getHeaderData } from "../state/reducers/headerSlice";
import { getstoriesData } from "../state/reducers/storiesSlice";
import StoryModal from "../StoryModal";
import FooterOfStory from "../FooterOfStory";
import BodyOfStory from "../BodyOfStory";
import HeadOfStory from "../HeadOfStory";

const JustNos = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getAuthData);
  const { menuStateValue } = useAppSelector(getHeaderData);
  const { resultInitial } = useAppSelector(getstoriesData);
  const [selectedId, setSelectedId] = useState(null);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pageName = useRoute().name;
  const [data, setData] = useState([]);
  const result = async () =>
    await AsyncStorage.getItem("myStoredDataJustNosReaction");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      result()
        .then((res) => setData(JSON.parse(res)))
        .then(() => setLoading(false));
    }, 350);
  }, []);

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
          // onEndReached={handleLoadMore}
          refreshControl={
            <RefreshControl
              colors={["#14764b", "#0F5838", "#093421"]}
              refreshing={refreshing}
              // onRefresh={handleRefresh}
            />
          }
          data={data}
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
          extraData={selectedId}
        />
      )}

      <View style={{ flex: 1 }}>
        <StoryModal />
      </View>
    </SafeAreaView>
  );
};

export default JustNos;

const styles = StyleSheet.create({
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
