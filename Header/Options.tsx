import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Switch,
  StatusBar,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../state/hooks";
import { auth } from "../firebase";
import { getAuthData, resetUser } from "../state/reducers/authSlice";
import {
  ActivateNotifications,
  ActivateNotificationsSound,
  getstoriesData,
} from "../state/reducers/storiesSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Options = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { user } = useAppSelector(getAuthData);
  const { notifs, notifsSound } = useAppSelector(getstoriesData);
  const [notif, setNotif] = useState();

  const [notifSound, setNotifSound] = useState();
  console.log("notifs", notifs, "notifsSound", notifsSound);
  console.log("notif", notif, "notifSound", notifSound);

  const notifsSoundResult = async () =>
    await AsyncStorage.getItem("notifsSound");
  const notifsResult = async () => await AsyncStorage.getItem("notifs");

  useEffect(() => {
    notifsSoundResult().then((res) => setNotifSound(JSON.parse(res)));
  }, [notifsSound]);

  useEffect(() => {
    notifsResult().then((res) => setNotif(JSON.parse(res)));
  }, [notifs]);

  return (
    <View style={styles.centeredView}>
      {modalVisible && <StatusBar hidden />}

      <Modal
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          onPress={() => setModalVisible(false)}
        />
        <View
          style={[styles.centeredView, { bottom: 0, position: "absolute" }]}
        >
          <View
            style={[
              styles.modalView,
              {
                height: windowHeight / 2.3,
                width: windowWidth,
              },
            ]}
          >
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <AntDesign name="minus" color={"#404258"} />
            </Pressable>
            <View style={styles.subMenu}>
              <TouchableOpacity
                style={{
                  // marginBottom: 20,

                  width: windowWidth / 2.55,
                  flexDirection: "row",
                  paddingVertical: 5,
                }}
                onPress={() => (
                  navigation.navigate("profile", {
                    notActualUser: false,
                    userOfProfile: user.id,
                  }),
                  setModalVisible(false)
                )}
              >
                <FontAwesome name="user-circle-o" size={33} color="#646464" />

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <Text style={styles.menuText}>My Profile</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => (
                  navigation.navigate("actions", {
                    notActualUser: false,
                    userId: user.id,
                    flag: "hohoho",
                    // userId: user, //this is a verification
                  }),
                  setModalVisible(false)
                )}
                style={{
                  width: windowWidth / 2.5,
                  flexDirection: "row",
                  // marginBottom: 20,
                  paddingVertical: 5,
                }}
              >
                <MaterialCommunityIcons
                  name="post-outline"
                  size={36}
                  color="#646464"
                />

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    marginLeft: 5,
                  }}
                >
                  <Text style={styles.menuText}> My Actions</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  {
                    dispatch(ActivateNotificationsSound(!notifsSound)),
                      await AsyncStorage.setItem(
                        "notifsSound",
                        JSON.stringify(!notifsSound)
                      );
                  }
                }}
                style={{
                  flexDirection: "row",
                  // justifyContent: "flex-start",
                  height: windowHeight / 18,
                  // width: windowWidth / 2.6,
                  // marginBottom: 12,
                  // backgroundColor: "red",
                  paddingVertical: 5,
                }}
              >
                <Ionicons
                  name={
                    notifSound !== null
                      ? notifSound
                        ? "volume-medium-sharp"
                        : "volume-mute-sharp"
                      : notifsSound
                      ? "volume-medium-sharp"
                      : "volume-mute-sharp"
                  }
                  size={40}
                  color="#646464"
                />

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 20,
                    height: "100%",
                  }}
                >
                  <Text style={styles.menuText}>
                    {notifSound !== null
                      ? notifSound
                        ? "Deactivate Notifications Sound"
                        : "Activate Notifications Sound"
                      : notifsSound
                      ? "Deactivate Notification Sounds"
                      : "Activate Notifications Sound"}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  dispatch(ActivateNotifications(!notifs)),
                    await AsyncStorage.setItem(
                      "notifs",
                      JSON.stringify(!notifs)
                    );
                }}
                style={{
                  flexDirection: "row",
                  // justifyContent: "flex-start",
                  height: windowHeight / 18,
                  // width: windowWidth / 2.6,
                  // marginBottom: 12,
                  // backgroundColor: "red",
                  paddingVertical: 5,
                }}
              >
                <Ionicons
                  name={
                    notif !== null
                      ? notif
                        ? "notifications"
                        : "notifications-off"
                      : notifs
                      ? "notifications"
                      : "notifications-off"
                  }
                  size={33}
                  color="#646464"
                />

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",

                    marginLeft: 26,
                  }}
                >
                  <Text style={styles.menuText}>
                    {notif !== null
                      ? notif
                        ? "Deactivate Notifications"
                        : "Activate Notifications"
                      : notifs
                      ? "Deactivate Notifications"
                      : "Activate Notifications"}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  dispatch(ActivateNotifications(!notifs)),
                    await AsyncStorage.setItem(
                      "notifs",
                      JSON.stringify(!notifs)
                    );
                }}
                style={{
                  flexDirection: "row",
                  // justifyContent: "flex-start",
                  height: windowHeight / 18,
                  // width: windowWidth / 2.6,
                  // marginBottom: 12,
                  // backgroundColor: "red",
                  paddingVertical: 5,
                }}
              >
                <Entypo name={"info"} size={33} color="#646464" />

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",

                    marginLeft: 26,
                  }}
                >
                  <Text
                    style={styles.menuText}
                    onPress={() =>
                      Linking.openURL(
                        "https://www.privacypolicies.com/live/1fd4e6d1-ec5c-4a4f-b1dc-cca55f96360f"
                      )
                    }
                  >
                    Read Privacy policy
                  </Text>
                </View>
              </TouchableOpacity>
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
                style={{
                  width: windowWidth / 2.5,
                  flexDirection: "row",

                  justifyContent: "flex-start",
                  paddingVertical: 5,
                }}
              >
                <AntDesign
                  name="logout"
                  size={30}
                  color="#646464"
                  style={{ left: 7 }}
                />

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    marginRight: 12,
                  }}
                >
                  <Text style={styles.menuText}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.buttonContainer]}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="user-circle-o" size={28} color="#646464" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  subMenu: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
    // gap: 40,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    left: 14,
  },
  button: {
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    zIndex: 99,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#051E28",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button2: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#404258",
    top: -20,
    width: "25%",
    height: "5%",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#778899",
  },
});

export default Options;
