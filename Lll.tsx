import { View, Text } from "react-native";
import React, { useEffect } from "react";
import {
  createDrawerNavigator,
  useDrawerStatus,
} from "@react-navigation/drawer";
import Items from "./Items";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, menuState } from "./state/reducers/authSlice";

const Drawer = createDrawerNavigator();

function SettingsScreen({ navigation }) {
  const { menuStateVakue } = useAppSelector(getAuthData);
  const ddd = useDrawerStatus();
  const dispatch = useAppDispatch();

  console.log("55555", ddd);

  useEffect(() => {
    menuStateVakue ? navigation.openDrawer() : navigation.closeDrawer();
  }, [menuStateVakue]);

  useEffect(() => {
    ddd === "closed" && dispatch(menuState(false));
  }, [ddd]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Settings Screen</Text>
    </View>
  );
}

const Lll = () => {
  const { menuStateVakue } = useAppSelector(getAuthData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(menuState(false));
  }, []);

  return (
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
            dispatch(menuState(!menuStateVakue));
          },
        }}
      />
      <Drawer.Screen
        name="setting"
        component={SettingsScreen}
        listeners={{
          drawerItemPress: () => {
            dispatch(menuState(!menuStateVakue));
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default Lll;
