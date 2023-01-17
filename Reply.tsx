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
import { commentRoute, getHeaderData } from "./state/reducers/headerSlice";

const Reply = ({ navigation, route }) => {
  const { item } = route.params;
  const { user } = useAppSelector(getAuthData);
  const { commentRouteValue } = useAppSelector(getHeaderData);
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(commentRoute(item.id));
  }, [item.id]);

  const loadData = async () => {
    let result = [];
    const q = query(
      collection(db, "replies"),
      where("commentId", "==", item.id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc: any) =>
      result.push({ ...doc.data(), id: doc.id })
    );

    setData(result);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReply = async () => {
    try {
      await addDoc(collection(db, "replies"), {
        reply: reply,
        replier: user.username,
        timestamp: Date.now(),
        commentId: item.id,
      })
        .then(() => setStatus("success"))
        .then(() => setReply(""))
        .then(() => Keyboard.dismiss());
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("action failed please try again");
    }
  };

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
    setSelectedId(item.id);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.title}>{item.comment}</Text>
        </View>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Text style={styles.comment}>{item.reply}</Text>
            </View>
          )}
          keyExtractor={(item) => {
            return item.id;
          }}
          extraData={selectedId}
        />
      </View>
      <View style={styles.postComment}>
        <TextInput
          style={styles.input}
          multiline
          onChangeText={(text) => setReply(text)}
          // value={number}
          placeholder="Add a reply ..."
          placeholderTextColor={"#8BBCCC"}
          value={reply}
        />
        <TouchableOpacity
          onPress={handleReply}
          style={styles.button}
          disabled={reply === "" && true}
        >
          <Text style={styles.buttonText}>Reply</Text>
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
  subContainer: { marginBottom: 60 },
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
    width: "75%",
    fontSize: 17,

    // width: "90%",
    color: "#8BBCCC",
  },
  button: {
    backgroundColor: "#052821",
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
