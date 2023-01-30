import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";
import { addStories, loadStories } from "./state/reducers/storiesSlice";
import { useRoute } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const StoryModal = () => {
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const { user } = useAppSelector(getAuthData);
  const pageName = useRoute().name;

  const handleStory = async () => {
    content !== "" && title !== ""
      ? (dispatch(addStories({ title, userId: user.id, content })).then(() =>
          setStatus("success")
        ),
        setTimeout(() => {
          dispatch(loadStories({ pageName: pageName }));
        }, 250))
      : title === "" && content !== ""
      ? setTitleError(true)
      : title !== "" && content === ""
      ? setContentError(true)
      : (setTitleError(true), setContentError(true));
  };

  useEffect(() => {
    !modalVisible &&
      (setTitleError(false),
      setContentError(false),
      setContent(""),
      setTitle(""));
  }, [modalVisible]);

  useEffect(() => {
    status === "success" &&
      setTimeout(() => {
        setModalVisible(!modalVisible);
        setStatus("ready");
      }, 1300);
  }, [status]);

  return (
    <View style={styles.centeredView}>
      {modalVisible && <StatusBar hidden />}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: -30,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            height: windowHeight + 30,
          }}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={titleError ? "required title" : "Give it a title"}
                placeholderTextColor={titleError ? "red" : "#8BBCCC"}
                onChangeText={(text) => setTitle(text)}
                style={styles.input}
              />
              <TextInput
                multiline
                numberOfLines={8}
                placeholder={
                  contentError ? "required content" : "Write your story here..."
                }
                placeholderTextColor={contentError ? "red" : "#8BBCCC"}
                onChangeText={(text) => setContent(text)}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={handleStory}
                style={styles.buttonSendContainer}
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
    marginTop: 100,
    width: windowWidth * 0.98,
    paddingVertical: 50,
    paddingHorizontal: 17,
  },

  buttonOpen: {
    backgroundColor: "#495C83",
    borderRadius: 50,
    padding: 26,
    elevation: 4,
    position: "absolute",
    right: 20,
    bottom: 50,
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
    fontSize: 18,
  },
  buttonSendContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSend: {
    borderRadius: 50,
    elevation: 4,
    top: 16,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
});

export default StoryModal;
