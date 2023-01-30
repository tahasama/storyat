import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Items from "./Items";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getHeaderData, menuState } from "./state/reducers/headerSlice";

const Drawer = createDrawerNavigator();

const Lll = () => {
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
          name="timestamp"
          component={Items}
          listeners={{
            drawerItemPress: () => {
              dispatch(menuState(!menuStateValue));
            },
          }}
        />
        <Drawer.Screen
          name="applauds"
          component={Items}
          listeners={{
            drawerItemPress: () => {
              dispatch(menuState(!menuStateValue));
            },
          }}
        />
        <Drawer.Screen
          name="compassions"
          component={Items}
          listeners={{
            drawerItemPress: () => {
              dispatch(menuState(!menuStateValue));
            },
          }}
        />
        <Drawer.Screen
          name="brokens"
          component={Items}
          listeners={{
            drawerItemPress: () => {
              dispatch(menuState(!menuStateValue));
            },
          }}
        />
        <Drawer.Screen
          name="justNos"
          component={Items}
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
