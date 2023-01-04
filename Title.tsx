import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Logout from "./Logout";
import Menu from "./Menu";
import MenuButton from "./MenuButton";

const Title = () => {
  return (
    <View style={styles.buttonContainer}>
      <MenuButton />
      <Text style={styles.button}>Storyat</Text>
      <Logout />
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  buttonContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#292929",
    alignItems: "center",
    height: 60,
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
