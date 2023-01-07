import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Items from "./Items";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, menuState } from "./state/reducers/authSlice";

const Drawer = createDrawerNavigator();

function SettingsScreen({ navigation }) {
  const { menuStateVakue } = useAppSelector(getAuthData);

  useEffect(() => {
    menuStateVakue ? navigation.openDrawer() : navigation.closeDrawer();
  }, [menuStateVakue]);

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
      screenOptions={{ header: () => null }}
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
