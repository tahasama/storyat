import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Linking,
} from "react-native";
import React, { useRef } from "react";
import { useEffect, useState } from "react";

import Splash from "../Splash";

import * as WebBrowser from "expo-web-browser";
import GoogleLogin from "./GoogleLogin";
import { getAuthData } from "../state/reducers/authSlice";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getstoriesData, getStory } from "../state/reducers/storiesSlice";
import FlashMessage, { showMessage } from "react-native-flash-message";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation, route }) => {
  const para = route.params;
  const { user } = useAppSelector(getAuthData);
  const { error, story } = useAppSelector(getstoriesData);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  // const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  async function registerForPushNotificationsAsync() {
    let token: string;
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("vvv", {
        name: "vvv",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [],
        // lightColor: "red",
      });
    }
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert(
          "(Bad connection... ) Please close and repoen app, if you have trouble logging in "
        );
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  useEffect(() => {
    expoPushToken === "" &&
      registerForPushNotificationsAsync().then((token) =>
        setExpoPushToken(token)
      );
  }, [expoPushToken]);

  useEffect(() => {
    user && !loading && navigation.replace("lll");
  }, [loading, user]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(!loading);
    }, 5000);
  }, []);

  useEffect(() => {
    error &&
      showMessage({
        message: "Error",
        description: "Please  hit authorise to be able to get notifications",
        type: "danger",
      });
  }, [error]);

  const PicId = () => {
    return Math.floor(Math.random() * 1084);
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (cred) => {
        const q = query(
          collection(db, "users"),
          where("firebaseUserId", "==", cred.user.uid)
        );
        const querySnapshot = (await getDocs(q)).docs.length;

        try {
          querySnapshot === 0 &&
            (await addDoc(collection(db, "users"), {
              username: cred.user.displayName,
              firebaseUserId: cred.user.uid,
              writer: cred.user.email,
              timestamp: Date.now(),
              avatar: `https://picsum.photos/id/${PicId()}/200/300`,
              pushToken: expoPushToken,
            }));
        } catch (e) {
          Alert.alert("action failed please try again");
        }
      })
      .catch((err) => {
        Alert.alert(
          "SomeThing's wrong ...",
          err.code === "auth/user-not-found"
            ? "wrong email, please try again"
            : err.code === "auth/wrong-password"
            ? "Wrong password, please try again"
            : err.code === "auth/invalid-email"
            ? "Please provide a valid email"
            : err.code === "auth/internal-error"
            ? "Please provide a valid password"
            : err.code === "auth/network-request-failed"
            ? "Failed to login, please try again"
            : err.code === "auth/email-already-in-use" &&
              "This email exist already"
        );
      });
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (cred) => {
        const q = query(
          collection(db, "users"),
          where("firebaseUserId", "==", cred.user.uid)
        );
        const querySnapshot = (await getDocs(q)).docs.length;

        try {
          querySnapshot === 0 &&
            (await addDoc(collection(db, "users"), {
              username: cred.user.displayName,
              firebaseUserId: cred.user.uid,
              writer: cred.user.email,
              timestamp: Date.now(),
              avatar: `https://picsum.photos/id/${PicId()}/200/300`,
              pushToken: expoPushToken,
            }));
        } catch (e) {
          console.error("Error adding document: ", e);
          Alert.alert("action failed please try again");
        }
      })
      .catch((error) =>
        alert(
          "Please make sure to Register first, and/or verify you internet connection and retry!  "
        )
      );
  };

  return (
    <View style={styles.container}>
      {loading && para !== "noSplash" ? (
        <Splash />
      ) : (
        !user && (
          <View style={styles.container1}>
            <View style={styles.inputContainer}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text style={{ textAlign: "center", color: "#999999" }}>
                  By continuing, you agree on, and aknowledge that you've read
                  Storyat's{" "}
                </Text>
                <Text
                  style={{ color: "#fccccc", textDecorationLine: "underline" }}
                  onPress={() =>
                    Linking.openURL(
                      "https://www.privacypolicies.com/live/1fd4e6d1-ec5c-4a4f-b1dc-cca55f96360f"
                    )
                  }
                >
                  Privacy policy
                </Text>
              </View>
              <TextInput
                placeholder="Email"
                placeholderTextColor={"#8BBCCC"}
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
              />
              <TextInput
                secureTextEntry
                placeholder="Password"
                placeholderTextColor={"#8BBCCC"}
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleLogin} style={styles.button1}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSignUp} style={styles.button2}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
              <GoogleLogin token={expoPushToken} />
            </View>
          </View>
        )
      )}

      <FlashMessage position="top" />
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
