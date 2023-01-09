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
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, itemRoute } from "./state/reducers/authSlice";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  FieldValue,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const Item = ({ navigation, route }) => {
  const { item } = route.params;
  const { user } = useAppSelector(getAuthData);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  console.log(
    "4444444",
    item.commentSection.map((x) => x)
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(itemRoute(item.id));
  }, [item.id]);

  const handlePost = () => {
    console.log("Posted!");
  };

  const handleComment = async () => {
    try {
      await updateDoc(doc(db, "stories", item.id), {
        commentSection: arrayUnion({ comment: comment }),
      }).then(() => setStatus("success"));
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.content}>
            {"\t"}

            {item.content}
          </Text>

          {item.commentSection.map((comment: any) => (
            <View style={styles.commentResponseContainer}>
              <View style={styles.commentContainer} key={comment.id}>
                {/* <Image
                  style={styles.logo}
                  source={{
                    uri: comment.user.avatar,
                  }}
                /> */}
                <Text style={styles.comment}>{comment.comment}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <replyModal />
              </View>
              {/* <View style={styles.commentContainer}> */}
              {/* {comment.response.map((response: any) => {
                return (
                  <View style={styles.responseContainer} key={response.id}>
                    <Image
                      style={styles.miniLogo}
                      source={{
                        uri: response.user.avatar,
                      }}
                    />
                    <Text style={styles.response}>{response.comment}</Text>
                  </View>
                );
              })} */}
            </View>
          ))}
        </View>

        {/* <Button title="Go to Home" onPress={() => navigation.navigate("items")} /> */}
      </ScrollView>
      <View style={styles.postComment}>
        <TextInput
          style={styles.input}
          multiline
          // onChangeText={onChangeNumber}
          // value={number}
          placeholder="Add a comment ..."
          placeholderTextColor={"#8BBCCC"}
        />
        <TouchableOpacity onPress={handlePost} style={styles.button}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#051e28",
    color: "yellow",
  },
  subContainer: { flex: 1, marginBottom: 80 },
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
  },
  commentResponseContainer: {
    borderTopWidth: 1,
    borderTopColor: "#1E343E",
  },

  commentContainer: {
    flexDirection: "row",
    // paddingHorizontal: 20,
    // paddingBottom: 20,
    // marginTop: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    // backgroundColor: "red",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  comment: {
    fontSize: 20,
    color: "#9BA5A9",
    paddingHorizontal: 20,
    // paddingVertical: 10,
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
    // flex: 0,
    flexDirection: "row",
    // position: "absolute",
    // bottom: 10,
    alignItems: "center",
    justifyContent: "space-around",
    // width: "100%",
    // marginHorizontal: -10,
    backgroundColor: "#051E28",
  },
  input: {
    height: 44,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "#828E94",
    backgroundColor: "#051E28 ",
    borderRadius: 5,
    width: "60%",

    // width: "90%",
    color: "#8BBCCC",
  },
  button: {
    backgroundColor: "#052821",
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
