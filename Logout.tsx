import { signOut } from "firebase/auth";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { auth } from "./firebase";
import { useNavigation } from "@react-navigation/core";
import { resetUser } from "./state/reducers/authSlice";
import { useDispatch } from "react-redux";

const Logout = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={() => {
          signOut(auth)
            .then(() => {
              setTimeout(() => {
                dispatch(resetUser({}));
                navigation.replace("login", "noSplash");
              }, 1000);
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
    right: 7,
  },
  button: {
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
  },
});
