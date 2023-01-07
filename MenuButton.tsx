import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, itemRoute, menuState } from "./state/reducers/authSlice";
import { useNavigation, StackActions } from "@react-navigation/core";

const MenuButton = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  const { menuStateVakue, itemRouteVakue } = useAppSelector(getAuthData);
  console.log("dddddddddddd");

  const popAction = StackActions.pop(1);

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={() => {
          {
            itemRouteVakue === ""
              ? dispatch(menuState(!menuStateVakue))
              : navigation.dispatch(popAction),
              dispatch(itemRoute(""));
          }
        }}
        style={styles.button}
      >
        {itemRouteVakue === "" ? (
          <Entypo name="menu" size={30} color="#646464" />
        ) : (
          <AntDesign name="left" size={30} color="#646464" />
        )}
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
