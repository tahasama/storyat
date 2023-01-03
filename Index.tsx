import { StyleSheet, View } from "react-native";
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
import Menu from "./Menu";
import Eee from "./Eee";

const Index = () => {
  const Stack = createNativeStackNavigator();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getAuthData);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(saveUser(user));
      } else {
        //   dispatch(saveUser(undefined));
        console.log("no user bro", user);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="eee"
          component={Eee}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="logout"
          component={Logout}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index;
