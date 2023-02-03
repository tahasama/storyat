import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  Button,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, updateUserImage } from "./state/reducers/authSlice";
import { getstoriesData } from "./state/reducers/storiesSlice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getcommentsData } from "./state/reducers/commentsSlice";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

const Profile = () => {
  const { user } = useAppSelector(getAuthData);
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [image, setImage] = useState(user.avatar);
  const { result, resultReactions } = useAppSelector(getstoriesData);
  const { resultComments } = useAppSelector(getcommentsData);
  const dispatch = useAppDispatch();

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      const storageRef = ref(storage, user.id + ".jpg");

      uploadBytesResumable(storageRef, blob)
        .then(async () => {
          const res = await getDownloadURL(storageRef);
          console.log("res", res);
          dispatch(updateUserImage({ userImage: res, userId: user.id }));
          setImage(res);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // const joined1 = new DateFormat

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <View>
          <Image
            source={{
              uri: image,
            }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              margin: 20,
            }}
          />
        </View>
        <View style={{ justifyContent: "space-around" }}>
          <Text style={{ color: "white" }}>Uesrmame : {user.username}</Text>
          <Text style={{ color: "white" }}>
            joined on : {new Date(user.timestamp).toDateString()}
          </Text>
          <Text style={{ color: "white" }}>
            No of Stories : {result.length}
          </Text>
          <Text style={{ color: "white" }}>
            No of Stories Reacted to : {resultReactions.length}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Pressable
          onPress={() => pickImageAsync()}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Feather
            name="camera"
            size={20}
            color={"white"}
            style={{ marginHorizontal: 10 }}
          />
          <Text style={{ color: "white" }}>Update image</Text>
        </Pressable>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            color={"white"}
            size={20}
            style={{ color: "white", marginHorizontal: 10 }}
          />
          <Text style={{ color: "white" }}>Update Username</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          color: "grey",
          fontSize: 18,
          marginTop: 40,
          marginBottom: 20,
          marginHorizontal: 15,
        }}
      >
        My Reactions :{" "}
      </Text>
      <View>
        <View
          style={{
            flexDirection: "row",
            margin: 25,
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="hand-clap"
            color={"#73481c"}
            size={36}
          />
          <Text style={styles.text}> Applauded / Respected Stories : </Text>

          <Text style={{ color: "white" }}>
            {resultReactions.filter((x) => x.applauds.length !== 0).length}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", margin: 25, alignItems: "center" }}
        >
          <MaterialCommunityIcons name="heart" color={"#4c0000"} size={36} />
          <Text style={styles.text}> Liked / Loved Stories : </Text>

          <Text style={{ color: "white" }}>
            {resultReactions.filter((x) => x.compassions.length !== 0).length}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", margin: 25, alignItems: "center" }}
        >
          <MaterialCommunityIcons
            name="heart-broken"
            color={"#5900b2"}
            size={36}
          />
          <Text style={styles.text}> Heart breaking Stories : </Text>
          <Text style={{ color: "white" }}>
            {resultReactions.filter((x) => x.brokens.length !== 0).length}
          </Text>
          <Pressable
            style={styles.button}
            // onPress={onPress}
          ></Pressable>
        </View>
        <View
          style={{ flexDirection: "row", margin: 25, alignItems: "center" }}
        >
          <Feather name="trending-down" color={"#305a63"} size={36} />
          <Text style={styles.text}> Cant't deal with / Wow Stories : </Text>

          <Text style={{ color: "white" }}>
            {resultReactions.filter((x) => x.justNos.length !== 0).length}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", margin: 25, alignItems: "center" }}
        >
          <FontAwesome name="comments" color={"#707070"} size={36} />
          <Text style={styles.text}> Comemnts of Stories : </Text>
          <Text style={{ color: "white" }}>{resultComments.length}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#051e28",
  },

  item: {
    padding: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 22,
    color: "#bcbcbc",
    marginBottom: 25,
    marginHorizontal: 12,
  },

  icon: {
    position: "absolute",
    display: "flex",
    flexDirection: "column-reverse",
    backgroundColor: "#0782F9",
  },
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
    // alignItems: "center",
    // justifyContent: "center",
    // paddingVertical: 12,
    // paddingHorizontal: 32,
    // borderRadius: 4,
    // elevation: 3,
    // backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "300",
    letterSpacing: 0.25,
    color: "white",
  },
});
