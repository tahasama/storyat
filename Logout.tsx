import { signOut } from "firebase/auth";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { auth } from "./firebase";
import { useNavigation } from "@react-navigation/core";

const Logout = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={() => {
          signOut(auth)
            .then(() => {
              navigation.replace("login");
            })
            .catch((error) => alert(error.message));
        }}
        style={styles.button}
      >
        <AntDesign name="logout" size={24} color="#646464" />
      </TouchableOpacity>
    </View>
  );
};

export default Logout;

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    top: 100,
  },
  button: {
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
  },
});
