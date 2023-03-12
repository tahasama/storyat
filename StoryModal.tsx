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
  ActivityIndicator,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";
import {
  addStories,
  getStatus,
  getstoriesData,
  getStory,
  loadStories,
  reloadInitialData,
  updateStories,
} from "./state/reducers/storiesSlice";
import { useNavigation, useRoute } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const StoryModal = (item) => {
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState(item && item.item ? item.item.title : "");
  const [content, setContent] = useState(
    item && item.content ? item.item.content : ""
  );
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const { user } = useAppSelector(getAuthData);
  const { story, storyStatus } = useAppSelector(getstoriesData);
  const pageName = useRoute().name;
  const navigation = useNavigation<any>();
  const [storyImage, setStoryImage] = useState("");

  let original = { story };

  let { story: clonedItem } = original;
  let cloned = { ...clonedItem };

  const handleStory = async () => {
    setLoading(true);

    pageName !== "item"
      ? (content !== "" || storyImage !== "") && title !== ""
        ? dispatch(addStories({ title, userId: user.id, content, storyImage }))
            .then(({ payload }: any) => dispatch(getStory(payload.id)))
            .then(() =>
              setTimeout(() => {
                dispatch(getStatus("success"));
              }, 50)
            )
            .then(() => (setContent(""), setTitle(""), setStoryImage("")))
        : title === "" && content !== ""
        ? (setTitleError(true), setLoading(false))
        : storyImage === "" && content === ""
        ? (setContentError(true), setLoading(false))
        : setLoading(false)
      : dispatch(
          updateStories({
            title: title !== "" ? title : item && item.item && item.item.title,
            storyId: item.item.id,
            content:
              content !== "" ? content : item && item.item && item.item.content,
            storyImage:
              storyImage !== ""
                ? storyImage
                : item && item.item && item.item.storyImage,
          })
        )
          .then(({ payload }: any) => dispatch(getStory(payload.id)))
          .then(() =>
            setTimeout(() => {
              dispatch(getStatus("success"));
              setContent(""), setTitle(""), setStoryImage("");
            }, 50)
          );
  };

  useEffect(() => {
    !modalVisible &&
      (setTitleError(false),
      setContentError(false),
      setContent(""),
      setTitle(""));
  }, [modalVisible]);

  useEffect(() => {
    storyStatus === "success" &&
      setTimeout(() => {
        setLoading(false);
        setModalVisible(false);
        dispatch(getStatus("ready"));

        pageName !== "item" &&
          dispatch(loadStories()).then(() => dispatch(reloadInitialData(true)));

        pageName !== "item"
          ? navigation.navigate("item", { item: cloned })
          : navigation.navigate("item", { item: cloned });
      }, 50);
  }, [storyStatus]);

  const getNumber = () => {
    let numbersString = "";

    for (let i = 0; i < 6; i++) {
      numbersString += Math.floor(Math.random() * 10);
    }
    return numbersString;
  };

  const pickImageAsync = async () => {
    setImageLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      const storageRef =
        storyImage !== ""
          ? ref(
              storage,
              "Stories/" + item.item.storyImage.substring(83, 89) + ".jpg"
            )
          : ref(storage, "Stories/" + getNumber() + ".jpg");

      uploadBytesResumable(storageRef, blob)
        .then(async () => {
          const res = await getDownloadURL(storageRef);

          setStoryImage(res);
          setImageLoading(false);
        })

        .catch((error) => {
          setImageLoading(false);
        });
    } else {
      setImageLoading(false);
    }
  };

  return (
    <View style={[styles.centeredView]}>
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
        <View
          style={[styles.centeredView, { position: "absolute", bottom: 0 }]}
        >
          <View
            style={[
              styles.modalView,
              {
                height: windowHeight * 0.57,
                width: windowWidth,
              },
            ]}
          >
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={
                  titleError ? "ow!..you forgot title" : "Give it a title"
                }
                placeholderTextColor={titleError ? "#8c0052" : "#8BBCCC"}
                onChangeText={(text) => setTitle(text)}
                style={styles.input}
                maxLength={70}
                defaultValue={
                  Object.entries(item).length !== 0 ? item.item.title : ""
                }
              />
              <TextInput
                multiline
                numberOfLines={7}
                placeholder={
                  contentError
                    ? "..you can write your story , or add an image.. or both :)"
                    : "Write your story here..."
                }
                placeholderTextColor={contentError ? "#C73E1D" : "#8BBCCC"}
                onChangeText={(text) => setContent(text)}
                style={styles.input}
                defaultValue={
                  Object.entries(item).length !== 0 ? item.item.content : ""
                }
              />
              <Pressable
                onPress={() => pickImageAsync()}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#7f724c",
                  paddingRight: 22,
                  paddingLeft: 0,
                  paddingVertical: 10,
                  borderRadius: 5,
                  marginVertical: 10,
                }}
                disabled={imageLoading && true}
              >
                {!imageLoading ? (
                  <Feather
                    name={"camera"}
                    size={20}
                    color={"white"}
                    style={{ marginHorizontal: 10 }}
                  />
                ) : (
                  <ActivityIndicator size="small" />
                )}
                <Text style={{ color: "white" }}>
                  {!imageLoading ? "Upload image" : "Uploading ..."}
                </Text>
              </Pressable>
              <Text style={{ fontSize: 13 }}>
                * Upload Images may take some time depending on the image,
                please be patient
              </Text>
              <TouchableOpacity
                onPress={handleStory}
                style={styles.buttonSendContainer}
                disabled={imageLoading && true}
              >
                {!loading ? (
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
                  <View
                    style={[
                      {
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        borderRadius: 50,
                        elevation: 4,
                        marginTop: 16,
                        padding: 6,
                      },
                    ]}
                  >
                    <ActivityIndicator size="large" />
                    <Text>Processing story...</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Pressable
              style={[styles.buttonClose]}
              onPress={() => (
                setModalVisible(!modalVisible), dispatch(getStatus("ready"))
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
            ? {
                opacity: modalVisible ? 0 : 1,
                position: "absolute",
                right: 20,
                top: 24,
              }
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
          <Feather name="edit" color={"#244f76"} size={28} />
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
    width: windowWidth,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#5b6c8f",
    borderRadius: 20,
    paddingVertical: 50,
    paddingHorizontal: 17,
    top: 10,
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
