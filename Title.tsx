import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Logout from "./Logout";
import MenuButton from "./MenuButton";
import Options from "./Options";

const Title = () => {
  return (
    <View style={styles.buttonContainer}>
      <MenuButton />
      <Text style={styles.button}>Storyat</Text>
      <Options />
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#051E28",
    // backgroundColor: "#002244",
    // backgroundColor: "#001f20",

    alignItems: "center",
    height: 60,
  },
  button: {
    color: "#dadada",
    fontFamily: "BebasNeue-Regular",
    fontSize: 32,
    letterSpacing: 1,
  },
});
