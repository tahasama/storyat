import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import {
  createDrawerNavigator,
  useDrawerStatus,
} from "@react-navigation/drawer";
import Items from "./Items";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getHeaderData, menuState } from "./state/reducers/headerSlice";

const Drawer = createDrawerNavigator();

function SettingsScreen({ navigation }) {
  const { menuStateValue } = useAppSelector(getHeaderData);
  const ddd = useDrawerStatus();
  const dispatch = useAppDispatch();

  useEffect(() => {
    menuStateValue ? navigation.openDrawer() : navigation.closeDrawer();
  }, [menuStateValue]);

  useEffect(() => {
    ddd === "closed" && dispatch(menuState(false));
  }, [ddd]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Settings Screen</Text>
    </View>
  );
}

const Lll = ({ navigation }) => {
  const { menuStateValue } = useAppSelector(getHeaderData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(menuState(false));
  }, []);

  return (
    <>
      <Drawer.Navigator
        initialRouteName="items"
        useLegacyImplementation
        screenOptions={{
          header: () => null,
          drawerStyle: { backgroundColor: "#041820" },
          drawerInactiveTintColor: "#9BA5A9",
          swipeEnabled: true,
          overlayColor: "transparent",
        }}
      >
        <Drawer.Screen
          name="items"
          component={Items}
          listeners={{
            drawerItemPress: () => {
              dispatch(menuState(!menuStateValue));
            },
          }}
        />
        <Drawer.Screen
          name="setting"
          component={SettingsScreen}
          listeners={{
            drawerItemPress: () => {
              dispatch(menuState(!menuStateValue));
            },
          }}
        />
      </Drawer.Navigator>
    </>
  );
};

export default Lll;

const styles = StyleSheet.create({
  buttonContainer: { backgroundColor: "#051E28", height: 14 },

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
    zIndex: 99,

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
