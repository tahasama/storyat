import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth, faceBookProvider, googleProvider } from "./firebase";
import {
  View,
  Text,
  //   KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import Splash from "./Splash";
import * as AuthSession from "expo-auth-session";

import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session/build/providers/Facebook";

const GoogleLogin = () => {
  const [request, response, promptAsync] = useAuthRequest({
    responseType: AuthSession.ResponseType.Token,
    expoClientId: process.env.REACT_APP_FACEBOOK_APP_ID,
  });
  console.log("eeeeeeeeeeeeeeee", request);

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      const auth = getAuth();
      const credential = FacebookAuthProvider.credential(access_token);
      // Sign in with the credential from the Facebook user.
      console.log("11111111", credential);
      signInWithCredential(auth, credential).catch((err) => {
        console.log(
          "xxxxxxxxxx",
          err.code === "auth/account-exists-with-different-credential",
          err.email,
          "and....",
          err
        );
        err.code === "auth/account-exists-with-different-credential" &&
          Alert.alert(
            "Email used with other method",
            "It appears that this email was uses before with another method of athentification, please try with a different email or a different method"
          );
      });
    }
  }, [response]);
  console.log("AuthSession with:", response);
  return (
    <TouchableOpacity
      onPress={() => {
        promptAsync();
      }}
      style={styles.button3}
      disabled={!request}
    >
      <Text style={styles.buttonText}>Login with FaceBook</Text>
    </TouchableOpacity>
  );
};

export default GoogleLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#051e28",
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  inputContainer: {
    width: "60%",
  },
  input: {
    backgroundColor: "#144272",
    color: "#EAFDFC",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button1: {
    backgroundColor: "#292FBF",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
    borderColor: "#0F3460",
    borderWidth: 1,
  },
  button2: {
    backgroundColor: "#2A3FA0",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 12,
    borderColor: "#0F3460",
    borderWidth: 1,
  },
  button3: {
    backgroundColor: "#16213E",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 12,
    alignItems: "center",
    borderColor: "#0F3460",
    borderWidth: 1,
  },

  button4: {
    backgroundColor: "#182747",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 12,
    alignItems: "center",
    borderColor: "#0F3460",
    borderWidth: 1,
  },

  buttonText: {
    color: "#8BBCCC",
    fontWeight: "700",
    fontSize: 16,
  },
});
