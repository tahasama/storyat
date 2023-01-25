import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Switch,
  StatusBar,
} from "react-native";
import React, { Profiler, useEffect, useState } from "react";
import Logout from "./Logout";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { resetUser } from "./state/reducers/authSlice";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { menuState } from "./state/reducers/headerSlice";

{
  /* <TouchableOpacity
// activeOpacity={1}
style={{
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
}}
onPress={() => setModalVisible(false)}
/> */
}

const Options = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [modalVisible, setModalVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

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
          // activeOpacity={1}
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
                height: windowHeight / 3,
                width: windowWidth,
                // backgroundColor: "blue",
                // position: "relative",
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
                  marginBottom: 20,
                  // backgroundColor: "red",
                  width: windowWidth / 2.55,
                  flexDirection: "row",
                }}
                onPress={() => (
                  navigation.navigate("profile"), setModalVisible(false)
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
                  navigation.navigate("actions"), setModalVisible(false)
                )}
                style={{
                  // backgroundColor: "red",
                  width: windowWidth / 2.5,
                  flexDirection: "row",
                  marginBottom: 12,
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
              <View
                style={{
                  // justifyContent: "center",
                  // alignItems: "flex-start",
                  flexDirection: "row",
                  // flex: 1,
                  height: windowHeight / 18,
                  // backgroundColor: "red",
                  width: windowWidth / 2.6,
                  marginBottom: 12,
                }}
              >
                <Switch
                  style={{
                    transform: [{ scale: 1.2 }],
                  }}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    height: "100%",
                  }}
                >
                  <Text style={styles.menuText}>Dark/Light</Text>
                </View>
              </View>
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
                  // backgroundColor: "red",
                  width: windowWidth / 2.5,
                  flexDirection: "row",
                  marginBottom: 12,
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
        onPress={() => (setModalVisible(true), dispatch(menuState(false)))}
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
    justifyContent: "space-evenly",
    // alignItems: "flex-start",
    // backgroundColor: "yellow",
    width: "100%",
  },
  buttonContainer: {
    // position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    // margin: 10,
    right: 20,
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
    // marginTop: 22,
  },
  modalView: {
    // margin: 20,
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
