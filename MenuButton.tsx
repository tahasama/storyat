import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";
import { useNavigation, StackActions } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";
import {
  commentRoute,
  getHeaderData,
  menuState,
  storyRoute,
} from "./state/reducers/headerSlice";

const MenuButton = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  const route = useRoute();

  const { menuStateValue, commentRouteValue, storyRouteValue } =
    useAppSelector(getHeaderData);

  const popAction = StackActions.pop(1);

  // useEffect(() => {}, [route.name]);
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={() => {
          {
            route.name !== "lll"
              ? navigation.dispatch(popAction)
              : dispatch(menuState(true));
            // route.name === "item" && dispatch(commentRoute("")),
            //   route.name === "item" && dispatch(storyRoute(""));
          }
        }}
        style={styles.button}
      >
        {route.name === "lll" ? (
          <Entypo name="menu" size={38} color="#646464" />
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
    // zIndex: 99,
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
