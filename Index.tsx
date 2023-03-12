import { StatusBar, StyleSheet, Vibration, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Item from "./Item";
import Login from "./Login/Login";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { getAuthData, saveUser } from "./state/reducers/authSlice";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import React from "react";
import { useFonts } from "expo-font";
import Lll from "./Header/Lll";
import Title from "./Header/Title";
import Reply from "./Reply";
import { collection, getDocs, query, where } from "firebase/firestore";
import Profile from "./Profile";
import Actions from "./Actions";
import { closedApp, getstoriesData } from "./state/reducers/storiesSlice";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const Stack = createNativeStackNavigator();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getAuthData);
  const [loading, setLoading] = useState(true);
  const { notifs, notifsSound } = useAppSelector(getstoriesData);
  const [notifSound, setNotifSound] = useState(true);
  const [notif, setNotif] = useState(true);

  const addItemToAsyncStorageArray = async (notificationState) => {
    try {
      const existingArray = await AsyncStorage.getItem("myArray");

      const parsedArray = existingArray ? JSON.parse(existingArray) : [];
      parsedArray.length >= 6 && parsedArray.shift();

      parsedArray.push(notificationState);
      await AsyncStorage.setItem("myArray", JSON.stringify(parsedArray));
      console.log("Item added to array in AsyncStorage:", notificationState);
      await AsyncStorage.getItem("myArray").then((res) =>
        console.log("dddddddd", JSON.parse(res).length)
      );
    } catch (error) {
      console.log("Error adding item to array in AsyncStorage:", error);
    }
  };

  const lastNotificationResponse: any =
    Notifications.useLastNotificationResponse();

  React.useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      dispatch(closedApp("HAHAHAHAH!!!"));
      addItemToAsyncStorageArray(lastNotificationResponse.notification);
      console.log(
        "lastNotificationResponse.notification",
        lastNotificationResponse.notification
      );
    }
  }, [lastNotificationResponse]);

  const notifsResult = async () => await AsyncStorage.getItem("notifs");

  useEffect(() => {
    notifsResult().then((res) => setNotif(JSON.parse(res)));
  }, [notifs]);

  const notifsSoundResult = async () =>
    await AsyncStorage.getItem("notifsSound");

  useEffect(() => {
    notifsSoundResult().then((res) => setNotifSound(JSON.parse(res)));
  }, [notifsSound]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: notif !== null ? notif : notifs,
      shouldPlaySound:
        (notif || notifs) && notifSound !== null ? notifSound : notifsSound,
      shouldSetBadge: true,
    }),
  });

  const unsubscribe = () =>
    !user &&
    onAuthStateChanged(auth, async (userx) => {
      let result = [];
      if (userx) {
        setTimeout(async () => {
          const q = query(
            collection(db, "users"),
            where("firebaseUserId", "==", userx.uid)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc: any) =>
            result.push({ ...doc.data(), id: doc.id })
          );
          dispatch(saveUser(result[0]));
        }, 500);
      } else {
        console.log("no user bro");
      }
    });

  useEffect(() => {
    try {
      unsubscribe();
    } catch (error) {
      console.log("rrrrrrrrrrrrrrrrrrr", error);
    }
  }, [user]);

  useEffect(() => {
    Vibration.cancel();
    loading &&
      setTimeout(() => {
        setLoading(!loading);
      }, 6000);
  }, [loading]);

  let [fontsLoaded] = useFonts({
    "IndieFlower-Regular": require("./assets/fonts/IndieFlower-Regular.ttf"),
    "RubikBubbles-Regular": require("./assets/fonts/RubikBubbles-Regular.ttf"),
    "Caramel-Regular": require("./assets/fonts/Caramel-Regular.ttf"),
    "JosefinSans-Bold": require("./assets/fonts/JosefinSans-Bold.ttf"),
    "BebasNeue-Regular": require("./assets/fonts/BebasNeue-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <NavigationContainer>
        {!loading && (
          <View style={styles.buttonContainer}>
            <StatusBar backgroundColor={"#051E28"} barStyle="light-content" />
          </View>
        )}
        <Stack.Navigator
          initialRouteName={!user ? "login" : "lll"}
          screenOptions={{
            header: () => <Title />,
          }}
        >
          <Stack.Screen
            options={{ headerShown: false }}
            name="lll"
            component={Lll}
          />
          <Stack.Screen name="item" component={Item} />
          <Stack.Screen name="reply" component={Reply} />
          <Stack.Screen
            options={{ headerShown: false }}
            name="login"
            component={Login}
          />
          <Stack.Screen
            name="profile"
            component={Profile}
            options={{ animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="actions"
            component={Actions}
            options={{ animation: "slide_from_right" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Index;

const styles = StyleSheet.create({
  buttonContainer: { backgroundColor: "#051E28", height: 14 },

  buttonSpace: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "#051E28",
  },
  buttonContainer1: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#332FD0",
    alignItems: "center",
    height: 80,
    width: 80,
    borderRadius: 50,
    bottom: 5,
  },
  button: {
    color: "yellow",
    fontSize: 32,
  },
});
