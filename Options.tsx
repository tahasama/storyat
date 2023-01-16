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
import React, { useState } from "react";
import Logout from "./Logout";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";

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
          activeOpacity={1}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
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

                // position: "relative",
              },
            ]}
          >
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
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
    backgroundColor: "white",
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
    backgroundColor: "#2196F3",
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
});

export default Options;
