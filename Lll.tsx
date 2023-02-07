import { StyleSheet, TouchableOpacity, View, Text, Button } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Applauds from "./DrawerActions/Applauds";
import JustNos from "./DrawerActions/JustNos";
import Brokens from "./DrawerActions/Brokens";
import Compassions from "./DrawerActions/Compassions";
import Newest from "./DrawerActions/Newest";
import Items from "./DrawerActions/Items";
import { getstoriesData, loadStories } from "./state/reducers/storiesSlice";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import Title from "./Title";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Lll = () => {
  const dispatch = useAppDispatch();
  const { resultInitial } = useAppSelector(getstoriesData);
  const [data, setData] = useState([]);
  const result = async () => await AsyncStorage.getItem("myStoredDataRandom");

  useEffect(() => {
    setTimeout(() => {
      result().then((res) => setData(JSON.parse(res)));
    }, 750);
  }, []);

  useEffect(() => {
    let isSubscribed = resultInitial.length === 0 && dispatch(loadStories());
    return () => {
      isSubscribed;
    };
  }, []);

  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      // defaultScreenOptions={{ unmountOnBlur: true }}
      //   header: () => <Title />,
      screenOptions={{
        header: () => <Title />,
        drawerStyle: { backgroundColor: "#041820" },
        drawerInactiveTintColor: "#9BA5A9",
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen name="items" component={Items} />
      <Drawer.Screen name="timestamp" component={Newest} />
      <Drawer.Screen name="applauds" component={Applauds} />
      <Drawer.Screen name="compassions" component={Compassions} />
      <Drawer.Screen name="brokens" component={Brokens} />
      <Drawer.Screen name="justNos" component={JustNos} />
    </Drawer.Navigator>
  );
};

export default Lll;

const styles = StyleSheet.create({
  buttonContainer: { backgroundColor: "#051E28", height: 14 },

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
