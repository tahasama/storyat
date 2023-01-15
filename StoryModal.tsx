import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const StoryModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const { user } = useAppSelector(getAuthData);
  console.log("tha usaaa", user);

  const handleStory = async () => {
    try {
      await addDoc(collection(db, "stories"), {
        title: title,
        content: content,
        writerId: user.id,
        timestamp: Date.now(),
      }).then(() => setStatus("success"));
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  };

  useEffect(() => {
    status === "success" &&
      setTimeout(() => {
        setModalVisible(!modalVisible);
        setStatus("ready");
      }, 1300);
  }, [status]);

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Give it a title"
                placeholderTextColor={"#8BBCCC"}
                //   value={email}
                onChangeText={(text) => setTitle(text)}
                style={styles.input}
              />
              <TextInput
                multiline
                numberOfLines={10}
                placeholder="Write your story here..."
                placeholderTextColor={"#8BBCCC"}
                //   value={password}
                onChangeText={(text) => setContent(text)}
                style={styles.input}
                //   secureTextEntry
              />

              <TouchableOpacity
                onPress={handleStory}
                style={styles.buttonSendContainer}
                disabled={status === "success" && true}
              >
                {status !== "success" ? (
                  <Text
                    style={[
                      styles.buttonSend,
                      {
                        backgroundColor: "#748DA6",
                      },
                    ]}
                  >
                    Send
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.buttonSend,
                      {
                        backgroundColor: "#68A7AD",
                      },
                    ]}
                  >
                    Succes !
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <Pressable
              style={[styles.buttonClose]}
              onPress={() => (
                setModalVisible(!modalVisible), setStatus("ready")
              )}
            >
              <AntDesign
                style={styles.textStyle}
                name="close"
                size={30}
                color="#646464"
              />
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.buttonOpen, { opacity: modalVisible ? 0 : 1 }]}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign
          style={styles.textStyle}
          name="plus"
          size={30}
          color="#646464"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#495C83",
    borderRadius: 20,
    // paddingHorizontal: 120,
    // paddingVertical: 10,
    marginTop: 100,
    width: windowWidth * 0.9,
    paddingVertical: 50,
    paddingHorizontal: 20,
  },

  buttonOpen: {
    backgroundColor: "#495C83",
    borderRadius: 50,
    padding: 26,
    elevation: 4,
    position: "absolute",
    right: 20,
    bottom: 60,
  },
  buttonClose: {
    backgroundColor: "#495C83",
    position: "absolute",
    right: 12,
    top: 12,
    borderRadius: 50,
    elevation: 50,
    padding: 3,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    // marginBottom: 15,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#144272",
    color: "#EAFDFC",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    // width: "100%",
    fontSize: 18,
  },
  buttonSendContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSend: {
    // backgroundColor: "#748DA6",
    borderRadius: 50,
    elevation: 4,
    // width: "30%",
    // height: 70,
    // textAlign: "center",
    top: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
});

export default StoryModal;
