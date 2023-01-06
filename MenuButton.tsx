import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";

import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, menuState } from "./state/reducers/authSlice";

const MenuButton = () => {
  const dispatch = useAppDispatch();
  const { menuStateVakue } = useAppSelector(getAuthData);

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={() => {
          dispatch(menuState(!menuStateVakue));
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
    transform: [{ translateX: 50 }],
  },
});
