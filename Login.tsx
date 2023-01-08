import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";

import Splash from "./Splash";

import * as WebBrowser from "expo-web-browser";
import GoogleLogin from "./GoogleLogin";
import FaceBookLogin from "./FaceBookLogin";
import { getAuthData, menuState } from "./state/reducers/authSlice";
import { useAppDispatch, useAppSelector } from "./state/hooks";

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation, route }) => {
  const para = route.params;
  const dispatch = useAppDispatch();
  const { menuStateVakue, user } = useAppSelector(getAuthData);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(menuState(!menuStateVakue));

    user && !loading && navigation.replace("lll");
  }, [loading, user]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(!loading);
    }, 5000);
  }, []);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
      })
      .catch((error) => alert(error.message));
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      {loading && para !== "noSplash" ? (
        <Splash />
      ) : (
        <View style={styles.container1}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={"#8BBCCC"}
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={"#8BBCCC"}
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleLogin} style={styles.button1}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignUp} style={styles.button2}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <GoogleLogin />
            <FaceBookLogin />
          </View>
        </View>
      )}
    </View>
  );
};

export default Login;

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
