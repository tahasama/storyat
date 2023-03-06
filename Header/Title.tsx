import { View, Text, StyleSheet } from "react-native";
import React from "react";
import MenuButton from "./MenuButton";
import Options from "./Options";
import Notifications from "./Notifications";

const Title = () => {
  return (
    <View>
      <View style={styles.buttonContainer}>
        <MenuButton />

        <Text style={styles.button}>Storyat</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // marginRight: 5,
            right: 30,
          }}
        >
          <Notifications />
          <Options />
        </View>
      </View>
      <View
        style={{
          borderBottomColor: "grey",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#051E28",
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
