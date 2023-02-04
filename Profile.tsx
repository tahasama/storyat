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
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import {
  getAuthData,
  getUser,
  updateUserImage,
  updateUserImageState,
} from "./state/reducers/authSlice";
import {
  getstoriesData,
  myStories,
  ReactedToStories,
} from "./state/reducers/storiesSlice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  getcommentsData,
  loadAllComments,
} from "./state/reducers/commentsSlice";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import { useNavigation } from "@react-navigation/native";
import { menuState } from "./state/reducers/headerSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import UsernameModal from "./UsernameModal";

const Profile = ({ route }: any) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  // const [image, setImage] = useState(user.avatar);
  const { result, resultReactions, myReactedToStories } =
    useAppSelector(getstoriesData);
  const { resultComments } = useAppSelector(getcommentsData);
  const { image, user, newuser, username } = useAppSelector(getAuthData);
  // const [userId, setuserId] = useState<any>();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  // console.log("resultReactions", resultReactions);
  // console.log("userId", route.params.theUser, "user", user.id);
  // const userId =
  //   route.params.theUser === undefined ? user.id : route.params.theUser.id;
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    dispatch(updateUserImageState(result.assets[0].uri));

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      const storageRef = ref(storage, user.id + ".jpg");

      uploadBytesResumable(storageRef, blob)
        .then(async () => {
          const res = await getDownloadURL(storageRef);
          setTimeout(() => {
            dispatch(updateUserImage({ userImage: res, userId: user.id }));
          }, 2000);
          // dispatch(updateUserImage({ userImage: res, userId: user.id }));
        })

        .catch((error) => {
          console.error(error);
        });
    }
  };
  // const userId = user.id !== route.params.theUser ? newuser : user;
  useEffect(() => {
    // !newuser ? setuserId(user) : setuserId(newuser);
  }, []);

  const userId = route.params.notActualUser !== true ? user : newuser;

  // const joined1 = new DateFormat

  // console.log("user infos", userId.id);

  const handleOnpress = () => {
    navigation.navigate("actions", { userId: userId });
  };

  // const HandleUsername = () => {
  //   dispatch(updateUsername(userId.id));
  // };

  useEffect(() => {
    dispatch(menuState(false)),
      // setLoading(true),
      dispatch(myStories({ pageName: userId.id }));
    dispatch(ReactedToStories({ userId: userId.id }));
    dispatch(loadAllComments({ userId: userId.id }));

    // dispatch(ReactedToStories({ pageName: user.id })),
    // setLoading(false);
  }, [userId.id]);

  console.log("username", username);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <View>
          <Image
            source={{
              uri: !image ? userId.avatar : image,
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
          <Text style={{ color: "white" }}>
            Username : {username !== "" ? username : userId.username}
          </Text>
          <Text style={{ color: "white" }}>
            joined on : {new Date(userId.timestamp).toDateString()}
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
          justifyContent: "space-between",
          marginHorizontal: 18,
        }}
      >
        <Pressable
          onPress={() => pickImageAsync()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#7f724c",
            paddingRight: 22,
            paddingLeft: 0,
            paddingVertical: 5,
            borderRadius: 5,
          }}
        >
          <Feather
            name="camera"
            size={20}
            color={"white"}
            style={{ marginHorizontal: 10 }}
          />
          <Text style={{ color: "white" }}>Update image</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <UsernameModal />
        </View>
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
            margin: 20,
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="hand-clap"
            color={"#73481c"}
            size={34}
          />
          <Text style={styles.text}> Applauded / Respected Stories : </Text>

          <Text style={{ color: "white" }}>
            {
              resultReactions.filter((x) => x.applauds.includes(userId.id))
                .length
            }
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", margin: 20, alignItems: "center" }}
        >
          <MaterialCommunityIcons name="heart" color={"#4c0000"} size={34} />
          <Text style={styles.text}> Liked / Loved Stories : </Text>

          <Text style={{ color: "white" }}>
            {
              resultReactions.filter((x) => x.compassions.includes(userId.id))
                .length
            }
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", margin: 20, alignItems: "center" }}
        >
          <MaterialCommunityIcons
            name="heart-broken"
            color={"#5900b2"}
            size={34}
          />
          <Text style={styles.text}> Heart breaking Stories : </Text>
          <Text style={{ color: "white" }}>
            {
              resultReactions.filter((x) => x.brokens.includes(userId.id))
                .length
            }
          </Text>
          <Pressable
            style={styles.button}
            // onPress={onPress}
          ></Pressable>
        </View>
        <View
          style={{ flexDirection: "row", margin: 20, alignItems: "center" }}
        >
          <Feather name="trending-down" color={"#305a63"} size={34} />
          <Text style={styles.text}> Cant't deal with / Wow Stories : </Text>

          <Text style={{ color: "white" }}>
            {
              resultReactions.filter((x) => x.justNos.includes(userId.id))
                .length
            }
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", margin: 20, alignItems: "center" }}
        >
          <FontAwesome name="comments" color={"#707070"} size={34} />
          <Text style={styles.text}> Comments of Stories : </Text>
          <Text style={{ color: "white" }}>{resultComments.length}</Text>
        </View>
      </View>
      <Pressable onPress={handleOnpress} style={styles.buttonBottom}>
        <Text
          style={{
            color: "white",
            marginHorizontal: 10,
            fontSize: 14,
            fontFamily: "monospace",
          }}
        >
          See Collections
        </Text>
        <AntDesign name="arrowright" color="grey" size={20} />
      </Pressable>
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
    marginHorizontal: 5,
  },
  buttonBottom: {
    flexDirection: "row",
    backgroundColor: "#38314e",
    bottom: 0,
    position: "absolute",
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    elevation: 20,
  },
});
