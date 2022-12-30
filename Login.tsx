import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import {
  View,
  Text,
  //   KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import Splash from "./Splash";

const Login = () => {
  // const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("eee");
      }
      setTimeout(() => {
        setLoading(!loading);
      }, 500);
    });

    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with:", user.email);
      })
      .catch((error) => alert(error.message));
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      {/* {loading ? ( */}
      <Splash />
      {/* //   <View style={styles.container1}>
      //     <View style={styles.inputContainer}>
      //       <TextInput
      //         placeholder="Email"
      //         value={email}
      //         onChangeText={(text) => setEmail(text)}
      //         style={styles.input}
      //       />
      //       <TextInput
      //         placeholder="Password"
      //         value={password}
      //         onChangeText={(text) => setPassword(text)}
      //         style={styles.input}
      //         secureTextEntry
      //       />
      //     </View>
      //     <View style={styles.buttonContainer}>
      //       <TouchableOpacity onPress={handleLogin} style={styles.button}>
      //         <Text style={styles.buttonText}>Login</Text>
      //       </TouchableOpacity>
      //       <TouchableOpacity
      //         onPress={handleSignUp}
      //         style={[styles.button, styles.buttonOutline]}
      //       >
      //         <Text style={styles.buttonOutlineText}>Register</Text>
      //       </TouchableOpacity>
      //     </View>
      //   </View>
      // )} */}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    width: "43%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 7,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});
