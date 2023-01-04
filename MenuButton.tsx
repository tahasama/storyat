import { signOut } from "firebase/auth";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  Pressable,
} from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { auth } from "./firebase";
import { useNavigation } from "@react-navigation/core";
import { useState } from "react";
// import Modal from "./Modalx";

import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, menuState } from "./state/reducers/authSlice";
import { DrawerActions } from "@react-navigation/native";
// import { openAndClose, firstOne } from "./state/reducers/modalSlice";

const MenuButton = () => {
  const navigation = useNavigation();

  const dispatch = useAppDispatch();
  const { menuStateVakue } = useAppSelector(getAuthData);
  menuStateVakue && DrawerActions.toggleDrawer();

  console.log("try that dude", menuStateVakue);
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={() => {
          dispatch(menuState(!menuStateVakue));
          DrawerActions.toggleDrawer();
        }}
        style={styles.button}
      >
        <Entypo name="menu" size={30} color="#646464" />
      </TouchableOpacity>
    </View>
  );
};

export default MenuButton;

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  button: {
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    zIndex: 99,
  },
  modal: {
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    border: 5,
    borderColor: "black",
    height: "100%",
    backgroundColor: "blue",
    // marginTop: 80,
    transform: [{ translateX: 50 }],
  },
});
