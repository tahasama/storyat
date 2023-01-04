import "react-native-gesture-handler";
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
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { saveUser } from "./state/reducers/authSlice";
import { useAppDispatch } from "./state/hooks";
import Index from "./Index";
import React from "react";

function App() {
  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
}

export default App;
