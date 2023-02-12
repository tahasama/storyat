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
import {
  addStories,
  getstoriesData,
  loadStories,
  reloadInitialData,
  updateStories,
  updateStoriesState,
} from "./state/reducers/storiesSlice";
import { useNavigation, useRoute } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const StoryModal = (item) => {
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const { user } = useAppSelector(getAuthData);
  const { myupdateStoryState, resultAdd } = useAppSelector(getstoriesData);
  const pageName = useRoute().name;
  const navigation = useNavigation<any>();

  // console.log("uaaa", item.item.title, "pageName", pageName);

  const vvv = () => {
    pageName !== "item"
      ? dispatch(addStories({ title, userId: user.id, content }))
          .then(() => setStatus("success"))
          .then(() => (setContent(""), setTitle("")))
      : // setTimeout(() => {
        //   navigation.navigate("item", { item: resultAdd });
        //   //   dispatch(loadStories())
        //   //     .then(() => dispatch(reloadInitialData(true)))
        // }, 5000)
        // .then(() => navigation.navigate("actions"))
        // setTimeout(() => {
        //   dispatch(loadStories())
        //     .then(() => dispatch(reloadInitialData(true)))

        // }, 250)
        dispatch(
          updateStories({
            title,
            storyId: myupdateStoryState.id,
            content,
          })
        )
          .then(() => {
            dispatch(updateStoriesState({ title: title, content: content }));
          })
          .then(() => (setStatus("success"), setContent(""), setTitle("")));
  };

  const handleStory = async () => {
    content !== "" && title !== ""
      ? vvv()
      : // setTimeout(() => {
      //   console.log("opop222", resultAdd);
      // }, 4000)
      title === "" && content !== ""
      ? setTitleError(true)
      : title !== "" && content === ""
      ? setContentError(true)
      : (setTitleError(true), setContentError(true));

    // navigation.navigate("item", { item: resultAdd });
    //   dispatch(loadStories())
    //     .then(() => dispatch(reloadInitialData(true)))
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
        navigation.navigate("item", { item: resultAdd });
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
                maxLength={70}
                defaultValue={pageName === "item" && item.item.title}
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
                defaultValue={pageName === "item" && item.item.content}
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
        style={
          pageName === "item"
            ? { opacity: modalVisible ? 0 : 1, bottom: 20, left: 20 }
            : [styles.buttonOpen, { opacity: modalVisible ? 0 : 1 }]
        }
        onPress={() => setModalVisible(true)}
      >
        {pageName !== "item" ? (
          <AntDesign
            style={styles.textStyle}
            name="plus"
            size={29}
            color="#646464"
          />
        ) : (
          <Feather name="edit" color={"#244f76"} size={24} />
        )}
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
    backgroundColor: "#5b6c8f",
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
function reloadData(arg0: boolean): any {
  throw new Error("Function not implemented.");
}
