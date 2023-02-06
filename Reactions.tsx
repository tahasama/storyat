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
import { vote } from "./state/reducers/storiesSlice";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import HeadOfStory from "./HeadOfStory";
import BodyOfStory from "./BodyOfStory";
import FooterOfStory from "./FooterOfStory";
const Reactions = ({ navigation, theUser }: any) => {
  const { resultReactions, myReactedToStories } =
    useAppSelector(getstoriesData);
  const { user } = useAppSelector(getAuthData);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const pageName = useRoute().name;

  useEffect(() => {
    setLoading(true),
      dispatch(ReactedToStories({ userId: theUser })),
      setLoading(false);
  }, []);

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
          data={
            pageName === "applauds"
              ? resultReactions.filter((x) => x.applauds.includes(theUser))
              : pageName === "compassions"
              ? resultReactions.filter((x) => x.compassions.includes(theUser))
              : pageName === "brokens"
              ? resultReactions.filter((x) => x.brokens.includes(theUser))
              : pageName === "justNos" &&
                resultReactions.filter((x) => x.justNos.includes(theUser))
          }
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
