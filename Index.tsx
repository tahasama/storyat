// import "react-native-gesture-handler";
import { StatusBar, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Items from "./Items";
import Item from "./Item";
import Login from "./Login";
import Logout from "./Logout";
import { store } from "./state/store";
import { Provider } from "react-redux";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { getAuthData, saveUser } from "./state/reducers/authSlice";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import React from "react";
import { useFonts } from "expo-font";
import Title from "./Title";
import Menu from "./Menu";

const Index = () => {
  const Stack = createNativeStackNavigator();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getAuthData);
  console.log("hello user", user.email);
  const [user1, setuser1] = useState<any>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(saveUser(user));
        setuser1(user);
      } else {
        //   dispatch(saveUser(undefined));
        console.log("no user bro");
      }
    });
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
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen
            name="items"
            component={Items}
            options={{
              header: () => <Title />,
              headerShown: true,
            }}
          />
          <Stack.Screen name="item" component={Item} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index;

const styles = StyleSheet.create({
  buttonContainer: { backgroundColor: "#292929", height: 14 },
});
