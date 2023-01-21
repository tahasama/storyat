import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
  Animated,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";
import {
  addDoc,
  arrayUnion,
  collection,
  collectionGroup,
  doc,
  FieldValue,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { getHeaderData, commentRoute } from "./state/reducers/headerSlice";
import {
  getrepliesData,
  loadreplies,
  addreplies,
  removereply,
  addreplyLike,
  isreplyLiked,
  isreplyDisliked,
  addreplyDislike,
  getreply,
} from "./state/reducers/repliesSlice";
import { loadStories } from "./state/reducers/storiesSlice";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Reply = ({ navigation, route }) => {
  const ccc = route.params;
  const { user } = useAppSelector(getAuthData);

  const { commentRouteValue } = useAppSelector(getHeaderData);
  const [status, setStatus] = useState("");
  const [replyIdLoading, setreplyIdLoading] = useState("");

  const [replyIdDelete, setreplyIdDelete] = useState(false);
  const [reply, setreply] = useState("");
  const [deletereply, setDeletereply] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [disLikeLoading, setDisLikeLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useAppDispatch();
  const { result, replyLiked, replyDisliked, likes, dislikes } =
    useAppSelector(getrepliesData);

  useEffect(() => {
    dispatch(commentRoute(ccc.item.id));
  }, [ccc.item.id]);

  useEffect(() => {
    dispatch(loadreplies(ccc.item.id));
  }, []);

  const handlereply = async () => {
    dispatch(
      addreplies({
        reply: reply,
        userId: user.id,
        commentId: ccc.item.id,
        likes: [],
        dislikes: [],
      })
    )
      .then(() => setStatus("success"))
      .then(() => setreply(""))
      .then(() => Keyboard.dismiss()),
      setTimeout(() => {
        dispatch(loadreplies(ccc.item.id));
      }, 250);
  };

  const handleOnpress = (item) => {
    navigation.navigate("reply", { item: item });
    setSelectedId(item.id);
  };

  const handleLike = (item) => {
    setreplyIdLoading(item.id);
    setLikeLoading(true);
    console.log(item.likes.filter((zzz) => zzz.liker === user.id).length === 0);
    const replyLikesData = { replyId: item.id, liker: user.id };
    const replyLikesArray = [...item.likes];
    const replyDislikesData = { replyId: item.id, liker: user.id };
    const replyDislikesArray = [...item.dislikes];

    item.likes.filter((zzz) => zzz.liker === user.id).length === 0
      ? replyLikesArray.push(replyLikesData)
      : replyLikesArray.pop();

    item.dislikes.filter((zzz) => zzz.liker === user.id).length !== 0 &&
      replyDislikesArray.pop();
    dispatch(
      addreplyDislike({
        replyDislikesData,
        replyDislikesArray,
      })
    ).then(() =>
      dispatch(
        addreplyLike({
          replyLikesData,
          replyLikesArray,
        })
      )
        .then(() => dispatch(loadreplies(ccc.item.id)))
        .then(() => setLikeLoading(false))
    );
  };

  const handleDislike = (item) => {
    setDisLikeLoading(true);
    setreplyIdLoading(item.id);
    const replyDislikesData = { replyId: item.id, liker: user.id };
    const replyDislikesArray = [...item.dislikes];
    const replyLikesData = { replyId: item.id, liker: user.id };
    const replyLikesArray = [...item.likes];

    item.likes.filter((zzz) => zzz.liker === user.id).length !== 0 &&
      replyLikesArray.pop();

    item.dislikes.filter((zzz) => zzz.liker === user.id).length === 0
      ? replyDislikesArray.push(replyDislikesData)
      : replyDislikesArray.pop();
    dispatch(
      addreplyLike({
        replyLikesData,
        replyLikesArray,
      })
    ).then(() =>
      dispatch(
        addreplyDislike({
          replyDislikesData,
          replyDislikesArray,
        })
      )
        .then(() => dispatch(loadreplies(ccc.item.id)))
        .then(() => setDisLikeLoading(false))
    );
  };

  const anim = useRef(new Animated.Value(0));

  const shake = useCallback(() => {
    // makes the sequence loop
    Animated.loop(
      // runs the animation array in sequence
      Animated.sequence([
        // shift element to the left by 2 units
        Animated.timing(anim.current, {
          toValue: -2,
          useNativeDriver: false,
          duration: 80,
        }),
        // shift element to the right by 2 units
        Animated.timing(anim.current, {
          toValue: 2,
          useNativeDriver: false,
          duration: 80,
        }),
        // bring the element back to its original position
        Animated.timing(anim.current, {
          toValue: 0,
          useNativeDriver: false,
          duration: 80,
        }),
      ]),
      // loops the above animation config 2 times
      { iterations: 2 }
    ).start();
  }, []);

  const handleRemove = (item) => {
    setreplyIdDelete(item.id);
    shake();
    console.log("rrrrrrrrrrrr", item.id);
    setDeletereply(true);
    dispatch(removereply(item.id));

    dispatch(loadreplies(ccc.item.id)).then(() => setDeletereply(false));
  };

  const getHeader = () => {
    return (
      <View style={styles.subContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: ccc.item.avatar,
            }}
            style={{
              width: 30,
              height: 30,
              borderRadius: 50,
              marginHorizontal: 10,
              marginVertical: 18,
            }}
          />
          <Text style={{ fontSize: 16, color: "white" }}>
            {ccc.item.username}
          </Text>
        </View>
        <Text style={styles.content}>
          {"\t"}

          {ccc.item.comment}
        </Text>
        <View
          style={{
            borderBottomColor: "grey",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text
          style={{
            color: "#7f6c33",
            fontSize: 14,
            marginLeft: 5,
            marginTop: 10,
          }}
        >
          Replies :
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ marginBottom: 90 }}
        data={result}
        renderItem={({ item }) => (
          <View style={styles.replyContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: item.avatar,
                }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  marginHorizontal: 0,
                  marginVertical: 0,
                }}
              />
              <Text style={{ fontSize: 16, color: "white", marginLeft: 8 }}>
                {item.username}
              </Text>
            </View>
            <Text style={styles.reply}>{item.reply}</Text>
            <View style={styles.replyActions}>
              <TouchableOpacity
                onPress={() => {
                  handleOnpress(item);
                }}
              >
                <Text
                  style={[
                    styles.reply,
                    { color: "#727577", margin: 5, fontSize: 15 },
                  ]}
                >
                  Reply
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // disabled={replyLiked && true}
                onPress={() => {
                  handleLike(item);
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {likeLoading && item.id === replyIdLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Entypo
                      name="arrow-bold-up"
                      color={
                        item.likes.filter((zzz) => zzz.liker === user.id)
                          .length !== 0
                          ? "#6a4e7e"
                          : "#3d4c57"
                      }
                      size={26}
                      style={{ transform: [{ rotate: "40deg" }] }}
                    />
                  )}
                  <Text style={{ color: "white" }}>{item.likes.length}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleDislike(item);
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {disLikeLoading && item.id === replyIdLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Entypo
                      name="arrow-bold-down"
                      color={
                        item.dislikes.filter((zzz) => zzz.liker === user.id)
                          .length === 0
                          ? "#3d4c57"
                          : "#6a4e7e"
                      }
                      size={26}
                      style={{ transform: [{ rotate: "40deg" }] }}
                    />
                  )}
                  <Text style={{ color: "white" }}>{item.dislikes.length}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRemove(item)}
                style={{ opacity: user.id === item.replier ? 1 : 0 }}
                disabled={user.id !== item.replier && true}
              >
                {deletereply && item.id === replyIdDelete ? (
                  <Animated.View
                    style={{ transform: [{ translateX: anim.current }] }}
                  >
                    <MaterialCommunityIcons
                      name="delete-empty"
                      color={"#669393"}
                      size={26}
                    />
                  </Animated.View>
                ) : (
                  <MaterialCommunityIcons
                    name="delete"
                    color={"#669393"}
                    size={26}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderBottomColor: "grey",
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
          </View>
        )}
        keyExtractor={(item) => {
          return item.id;
        }}
        extraData={selectedId}
        ListHeaderComponent={getHeader}
        // ListFooterComponent={getFooter}
        // ListFooterComponentStyle={{
        //   backgroundColor: "#495C83",
        //   borderRadius: 50,
        //   padding: 26,
        //   elevation: 4,
        //   position: "absolute",
        //   right: 20,
        //   bottom: 60,
        // }}
      />
      <View
        style={{
          // backgroundColor: "#002626",
          // borderRadius: 50,
          padding: 6,
          elevation: 4,
          position: "absolute",
          right: 0,
          bottom: 0,
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          style={styles.input}
          multiline
          onChangeText={(text) => setreply(text)}
          placeholder="  Add a reply ..."
          placeholderTextColor={"#8BBCCC"}
          value={reply}
        />
        <TouchableOpacity
          onPress={handlereply}
          style={styles.button}
          disabled={reply === "" && true}
        >
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#051e28",
    // color: "yellow",
  },
  subContainer: { marginBottom: 10 },
  title: {
    fontSize: 32,
    color: "#CDD2D4",
    padding: 27,
    textAlign: "center",
  },
  content: {
    fontSize: 20,
    color: "#9BA5A9",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    // padding: 40,
    // minHeight: 200,
  },
  replyResponseContainer: {
    borderTopWidth: 1,
    borderTopColor: "#1E343E",
  },

  replyContainer: {
    flexDirection: "column",
    // paddingHorizontal: 20,
    // paddingBottom: 20,
    // marginTop: 20,
    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "red",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  reply: {
    fontSize: 18,
    color: "#9BA5A9",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  replyActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  responseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 40,
    marginTop: 10,
  },
  response: {
    fontSize: 20,
    color: "#9BA5A9",
    paddingHorizontal: 20,
    paddingVertical: 12,
    // backgroundColor: "green",
  },
  miniLogo: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  postreply: {
    // // flex: 0,
    // flexDirection: "row",
    // // position: "absolute",
    // // bottom: 10,
    // alignItems: "center",
    // justifyContent: "space-around",
    // // width: "100%",
    // // marginHorizontal: -10,
    // backgroundColor: "#051E28",
  },
  input: {
    height: 44,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "#828E94",
    backgroundColor: "#051E28 ",
    borderRadius: 5,
    width: "75%",
    fontSize: 17,

    // width: "90%",
    color: "#8BBCCC",
  },
  button: {
    // backgroundColor: "#052821",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  buttonText: {
    color: "#c5765c",
    borderWidth: 2,
    borderColor: "#c5765c",
    padding: 8,
    borderRadius: 7,
  },
});

export default Reply;
