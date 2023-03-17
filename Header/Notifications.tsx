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
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { auth } from "../firebase";
import { getAuthData, resetUser } from "../state/reducers/authSlice";
import {
  ActivateNotifications,
  ActivateNotificationsSound,
  closedApp,
  getstoriesData,
  getStory,
} from "../state/reducers/storiesSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notificationz from "expo-notifications";
import { ScrollView } from "react-native-gesture-handler";

const Notifications = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [notif, setNotif] = useState([]);
  const [loadingGoToNotif, setLoadingGoToNotif] = useState(false);

  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  const [notificationState, setNotificationState] = useState<any>(false);
  const lastNotificationResponse = Notificationz.useLastNotificationResponse();

  const addItemToAsyncStorageArray = async (notificationState) => {
    try {
      const existingArray = await AsyncStorage.getItem("myArray");

      const parsedArray = existingArray ? JSON.parse(existingArray) : [];
      parsedArray.length >= 10 && parsedArray.shift();
      parsedArray.push(notificationState);
      await AsyncStorage.setItem("myArray", JSON.stringify(parsedArray));
      console.log(
        "8888888",
        notif.map((x) => x.request.content.data)
      );
    } catch (error) {}
  };

  const result = async () => await AsyncStorage.getItem("myArray");
  result().then(() => {
    result().then((res) => setNotif(JSON.parse(res)));
  });

  useEffect(() => {
    lastNotificationResponse &&
      ((notificationListener.current =
        Notificationz.addNotificationReceivedListener((notification) => {
          setNotificationState(notification);
          addItemToAsyncStorageArray(notification);
        })),
      console.log("444444444", notificationListener.current),
      (responseListener.current =
        Notificationz.addNotificationResponseReceivedListener((response) => {
          setNotificationState(response.notification);
          addItemToAsyncStorageArray(response.notification);
        })),
      console.log("555555555", notificationListener.current));

    return () => {
      if (notificationListener.current) {
        Notificationz.removeNotificationSubscription(
          notificationListener.current
        );
      }

      if (responseListener.current) {
        Notificationz.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [lastNotificationResponse]);

  const goToItem = (storyId) => {
    setLoadingGoToNotif(true);
    dispatch(getStory(storyId))
      .then((jjj) => navigation.navigate("item", { item: jjj.payload }))
      .then(() => setNotificationState(false))
      .then(() => (setLoadingGoToNotif(false), setModalVisible(!modalVisible)));
  };

  const removeNotification = async () => {
    setModalVisible(!modalVisible);
    setNotificationState(false);
  };

  return (
    <View style={styles.centeredView}>
      {modalVisible && <StatusBar hidden />}

      <Modal
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
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
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
          onPress={() => setModalVisible(false)}
        />
        <View
          style={{
            flex: 1,
            margin: 0,
            top: 77,
          }}
        >
          <View
            style={[
              styles.modalView,
              {
                height: notif ? windowHeight / 1.7 : windowHeight / 6,
                width: windowWidth,
              },
            ]}
          >
            {notif ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {!loadingGoToNotif ? (
                  notif &&
                  notif.reverse().map((x: any, index) => (
                    <TouchableOpacity
                      disabled={notif && notif.length === 0 && true}
                      key={index}
                      onPress={() => goToItem(x.request.content.data.storyId)}
                    >
                      <Text style={{ color: "#97897b", fontSize: 16 }}>
                        {x.request.content.body}
                      </Text>

                      <View
                        style={{
                          borderBottomColor: "grey",
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          margin: 15,
                        }}
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <>
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                      }}
                    />
                    <ActivityIndicator size="large" />
                    <Text
                      style={{ color: "#97897b", fontSize: 16, marginTop: 30 }}
                    >
                      Navigating...
                    </Text>
                  </>
                )}
              </ScrollView>
            ) : (
              <Text style={{ color: "#97897b", fontSize: 14 }}>
                No notifications yet.
              </Text>
            )}
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={removeNotification}
        style={{ right: 4 }}
        disabled={notif && notif.length === 0 && true}
      >
        <AntDesign name="notification" color={"#646464"} size={30} />
        {notificationState && (
          <View
            style={{
              backgroundColor: "#8e0000",
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: -5,
              right: -5,
            }}
          >
            <Text style={{ color: "white", fontSize: 11 }}>1</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#0d3444",
    borderRadius: 20,
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

export default Notifications;
