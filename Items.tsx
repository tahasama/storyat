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
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import StoryModal from "./StoryModal";
import { getDocs } from "@firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "./firebase";
import { getHeaderData, menuState } from "./state/reducers/headerSlice";
import { getstoriesData, loadStories } from "./state/reducers/storiesSlice";

const Items = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { menuStateValue } = useAppSelector(getHeaderData);
  const { result } = useAppSelector(getstoriesData);
  const [selectedId, setSelectedId] = useState(null);

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
    setSelectedId(item.id);
  };

  useEffect(() => {
    dispatch(loadStories());
  }, []);

  useEffect(() => {
    dispatch(menuState(false));
  }, []);

  useEffect(() => {
    menuStateValue ? navigation.openDrawer() : navigation.closeDrawer();
  }, [menuStateValue]);

  return (
    <SafeAreaView style={styles.container}>
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
                {/* <Image
                  source={require(item.avatar !== undefined
                    ? item.avatar
                    : "https://i.pravatar.cc/300")}
                /> */}
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
              }}
            />
          </View>
        )}
        keyExtractor={(item) => {
          return item.id;
        }}
        extraData={selectedId}
      />

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
