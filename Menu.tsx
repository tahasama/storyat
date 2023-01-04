import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Items from "./Items";
import Login from "./Login";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";
import { DrawerActions } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

function HomeScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { menuStateVakue } = useAppSelector(getAuthData);
  menuStateVakue && DrawerActions.toggleDrawer();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button title="Toggle drawer" onPress={() => navigation.toggleDrawer()} />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  const { menuStateVakue } = useAppSelector(getAuthData);
  // menuStateVakue && DrawerActions.toggleDrawer();
  useEffect(() => {
    navigation.toggleDrawer();
  }, [menuStateVakue]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Settings Screen</Text>
    </View>
  );
}
export default function Menu({ navigation }) {
  return (
    <View style={styles.buttonContainer}>
      <NavigationContainer independent={true}>
        <Drawer.Navigator
          useLegacyImplementation
          initialRouteName="SettingsScreen"
          screenOptions={{
            header: () => null,
          }}
        >
          <Drawer.Screen name="Homejj" component={HomeScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#292929",
    alignItems: "center",
    height: "100%",
    // marginTop: 20,
  },
  button: {
    color: "#dadada",
    fontFamily: "BebasNeue-Regular",
    fontSize: 32,
    // textAlign: "center",
    // alignItems: "center",
    // justifyContent: "center",
    letterSpacing: 1,
    // backgroundColor: "green",
  },
});
