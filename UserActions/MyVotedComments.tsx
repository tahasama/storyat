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

import HeadOfStory from "../HeadOfStory";
import BodyOfStory from "../BodyOfStory";
import FooterOfStory from "../FooterOfStory";
import { AllComments, getcommentsData } from "../state/reducers/commentsSlice";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getAuthData } from "../state/reducers/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

function MyVotedComments({ navigation }) {
  const { votedComments } = useAppSelector(getcommentsData);
  const { user } = useAppSelector(getAuthData);
  const dispatch = useAppDispatch();

  const [data, setData] = useState([]);

  const storedResult = async () =>
    await AsyncStorage.getItem("myStoredVotedComments");

  useEffect(() => {
    setTimeout(() => {
      storedResult().then((res) => setData(JSON.parse(res)));
    }, 750);
  }, []);
  console.log("data", data);
  return (
    <SafeAreaView style={styles.container}>
      {data.length === undefined ? (
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
