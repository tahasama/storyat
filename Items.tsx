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

const Items = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getAuthData);
  const { menuStateValue } = useAppSelector(getHeaderData);
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState([]);

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
    setSelectedId(item.id);
  };

  // const [locations, setLocations] = useState([]);
  const loadData = async () => {
    let result = [];
    const querySnapshot = await getDocs(collection(db, "stories"));
    querySnapshot.forEach((doc: any) =>
      result.push({ ...doc.data(), id: doc.id })
    );

    setData(result);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    dispatch(menuState(!menuStateValue));
  }, []);

  useEffect(() => {
    menuStateValue ? navigation.openDrawer() : navigation.closeDrawer();
    // navigation.toggleDrawer();
  }, [menuStateValue]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              onPress={() => {
                handleOnpress(item);
              }}
            >
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    color: "#bcbcbc",
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
