import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StoryModal from "../StoryModal";
import FooterOfStory from "../Story/FooterOfStory";
import BodyOfStory from "../Story/BodyOfStory";
import HeadOfStory from "../Story/HeadOfStory";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import {
  getstoriesData,
  reloadInitialData,
} from "../state/reducers/storiesSlice";
import { useIsFocused } from "@react-navigation/native";

const Applauds = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useAppDispatch();
  const { reloadState } = useAppSelector(getstoriesData);
  const isFocused = useIsFocused();

  const result = async () => await AsyncStorage.getItem("myStoredDataApplauds");

  useEffect(() => {
    // (isFocused || reloadState) &&
    setLoading(true),
      result()
        .then((res) => setData(JSON.parse(res)))
        .then(() => dispatch(reloadInitialData(false)))
        .then(() => setLoading(false));

    // voterIndex();
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
        />
      )}

      <View style={{ flex: 1 }}>
        <StoryModal />
      </View>
    </SafeAreaView>
  );
};

export default Applauds;

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
