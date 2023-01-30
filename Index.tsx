import { StatusBar, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Item from "./Item";
import Login from "./Login";
import Logout from "./Logout";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { getAuthData, saveUser } from "./state/reducers/authSlice";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import React from "react";
import { useFonts } from "expo-font";
import Lll from "./Lll";
import Title from "./Title";
import Reply from "./Reply";
import { collection, getDocs, query, where } from "firebase/firestore";
import Profile from "./Profile";
import Actions from "./Actions";
import * as SecureStore from "expo-secure-store";

const Index = () => {
  const Stack = createNativeStackNavigator();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getAuthData);
  const [loading, setLoading] = useState(true);

  const unsubscribe = () =>
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

          // storeData("myUser", result[0]).then(() => getData("myUser"));
          dispatch(saveUser(result[0]));
        }, 500);
      } else {
        console.log("no user bro");
      }
    });

  useEffect(() => {
    unsubscribe();
  }, []);

  useEffect(() => {
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
          screenOptions={{
            header: () => (user && !loading ? <Title /> : null),
          }}
          initialRouteName={user ? "login" : "lll"}
        >
          <Stack.Group>
            <Stack.Screen name="lll" component={Lll} />
            <Stack.Screen name="item" component={Item} />
            <Stack.Screen name="reply" component={Reply} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="logout" component={Logout} />
            <Stack.Screen name="profile" component={Profile} />
            <Stack.Screen name="actions" component={Actions} />
          </Stack.Group>
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
