import { StatusBar, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Item from "./Item";
import Login from "./Login";
import Logout from "./Logout";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { getAuthData, saveUser } from "./state/reducers/authSlice";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import React from "react";
import { useFonts } from "expo-font";
import Lll from "./Lll";
import Title from "./Title";

const Index = () => {
  const Stack = createNativeStackNavigator();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getAuthData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (userx) => {
      if (userx) {
        dispatch(saveUser(userx));
      } else {
        console.log("no user bro");
      }
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(!loading);
    }, 6000);
  }, []);

  let [fontsLoaded] = useFonts({
    "IndieFlower-Regular": require("./assets/fonts/IndieFlower-Regular.ttf"),
    "RubikBubbles-Regular": require("./assets/fonts/RubikBubbles-Regular.ttf"),
    "Caramel-Regular": require("./assets/fonts/Caramel-Regular.ttf"),
    "JosefinSans-Bold": require("./assets/fonts/JosefinSans-Bold.ttf"),
    "BebasNeue-Regular": require("./assets/fonts/BebasNeue-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <View style={styles.buttonContainer}>
        <StatusBar backgroundColor={"#292929"} />
      </View>
      <Stack.Navigator
        screenOptions={{ header: () => (user && !loading ? <Title /> : null) }}
        initialRouteName={!user ? "login" : "lll"}
      >
        <Stack.Group>
          <Stack.Screen name="lll" component={Lll} />
          {/* <Stack.Screen name="items" component={Items} /> */}
          <Stack.Screen name="item" component={Item} />
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="logout" component={Logout} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index;

const styles = StyleSheet.create({
  buttonContainer: { backgroundColor: "#292929", height: 14 },
});
