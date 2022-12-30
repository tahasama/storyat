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

import { useAppDispatch } from "./state/hooks";
// import { openAndClose, firstOne } from "./state/reducers/modalSlice";

const Menu = () => {
  const navigation = useNavigation();
  const [menu, setMenu] = useState(false);
  // const modal = useSelector((state) => state.modalz.value);
  // console.log("state in menu", modal);
  const dispatch = useAppDispatch();

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        onPress={() => {
          console.log("open menu");
        }}
        style={styles.button}
      >
        <Entypo name="menu" size={30} color="#646464" />
      </Pressable>
    </View>
  );
};

export default Menu;

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
