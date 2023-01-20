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
} from "react-native";
import React, { useEffect, useState } from "react";
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
import { getHeaderData, storyRoute } from "./state/reducers/headerSlice";
import {
  getcommentsData,
  loadcomments,
  addcomments,
  removeComment,
  addCommentLike,
  isCommentLiked,
} from "./state/reducers/commentsSlice";
import { loadStories } from "./state/reducers/storiesSlice";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ComplexAnimationBuilder } from "react-native-reanimated";

const Item = ({ navigation, route }) => {
  const ccc = route.params;
  const { user } = useAppSelector(getAuthData);

  const { storyRouteValue } = useAppSelector(getHeaderData);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useAppDispatch();
  const { result, commentLiked } = useAppSelector(getcommentsData);
  console.log("ddddddddddd", commentLiked);

  useEffect(() => {
    dispatch(storyRoute(ccc.item.id));
  }, [ccc.item.id]);

  useEffect(() => {
    dispatch(loadcomments(ccc.item.id));
  }, []);

  console.log("434343", user);
  const handleComment = async () => {
    dispatch(
      addcomments({
        comment: comment,
        userId: user.id,
        storyId: ccc.item.id,
        likes: [],
        dislikes: [],
      })
    )
      .then(() => setStatus("success"))
      .then(() => setComment(""))
      .then(() => Keyboard.dismiss()),
      setTimeout(() => {
        dispatch(loadcomments(ccc.item.id));
      }, 250);
  };

  const handleOnpress = (item) => {
    navigation.navigate("reply", { item: item });
    setSelectedId(item.id);
  };

  const handleLike = (item) => {
    console.log(item.likes.filter((zzz) => zzz.liker === user.id).length === 0);
    const commentLikesData = { commentId: item.id, liker: user.id };
    const commentLikesArray = [...item.likes];
    item.likes.filter((zzz) => zzz.liker === user.id).length === 0
      ? commentLikesArray.push(commentLikesData)
      : commentLikesArray.pop();
    dispatch(
      addCommentLike({
        commentLikesData,
        commentLikesArray,
      })
    ).then(() => dispatch(isCommentLiked(!commentLiked)));
    console.log("12313123123123", commentLiked);
  };

  const handleDislike = (item) => {
    // dispatch(addCommentDislike(item.id))

    setSelectedId(item.id);
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
        <Text style={styles.title}>{ccc.item.title}</Text>
        <Text style={styles.content}>
          {"\t"}

          {ccc.item.content}
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
            marginTop: 3,
          }}
        >
          Comments :
        </Text>
      </View>
    );
  };
  const getFooter = () => {
    return (
      <View style={styles.postComment}>
        <TextInput
          style={styles.input}
          multiline
          onChangeText={(text) => setComment(text)}
          placeholder="Add a comment ..."
          placeholderTextColor={"#8BBCCC"}
          value={comment}
        />
        <TouchableOpacity
          onPress={handleComment}
          style={styles.button}
          disabled={comment === "" && true}
        >
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        style={{ marginBottom: 90 }}
        data={result}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {/* <Image
                  source={require(item.avatar !== undefined
                    ? item.avatar
                    : "https://i.pravatar.cc/300")}
                /> */}
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
            <Text style={styles.comment}>{item.comment}</Text>
            <View style={styles.commentActions}>
              <TouchableOpacity
                onPress={() => {
                  handleOnpress(item);
                }}
              >
                <Text
                  style={[
                    styles.comment,
                    { color: "#727577", margin: 5, fontSize: 15 },
                  ]}
                >
                  Reply
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // disabled={commentLiked && true}
                onPress={() => {
                  handleLike(item);
                }}
              >
                <View style={{ transform: [{ rotate: "40deg" }] }}>
                  <Entypo
                    name="arrow-bold-up"
                    color={
                      item.likes.filter((zzz) => zzz.liker === user.id)
                        .length !== 0 || commentLiked
                        ? "#9715a5"
                        : "#4d759a"
                    }
                    size={26}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleDislike(item);
                }}
              >
                <View style={{ transform: [{ rotate: "40deg" }] }}>
                  <Entypo name="arrow-bold-down" color={"#4d759a"} size={26} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  dispatch(removeComment(item.id));
                  dispatch(loadcomments(ccc.item.id));
                }}
              >
                <MaterialCommunityIcons
                  name="delete"
                  color={"#669393"}
                  size={26}
                />
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
          onChangeText={(text) => setComment(text)}
          placeholder="  Add a comment ..."
          placeholderTextColor={"#8BBCCC"}
          value={comment}
        />
        <TouchableOpacity
          onPress={handleComment}
          style={styles.button}
          disabled={comment === "" && true}
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
    paddingBottom: 20,
    minHeight: 200,
  },
  commentResponseContainer: {
    borderTopWidth: 1,
    borderTopColor: "#1E343E",
  },

  commentContainer: {
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
  comment: {
    fontSize: 18,
    color: "#9BA5A9",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  commentActions: {
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
  postComment: {
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

export default Item;
