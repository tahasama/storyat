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

import { storyRoute } from "./state/reducers/headerSlice";
import {
  getcommentsData,
  loadcomments,
  addcomments,
  removeComment,
  addCommentLike,
  addCommentDislike,
} from "./state/reducers/commentsSlice";
import Entypo from "@expo/vector-icons/Entypo";
import {} from "./state/reducers/repliesSlice";
import {
  addCommentNumberToStory,
  getStory,
  substractCommentNumberToStory,
  updateApplaudState,
  updateBrokenState,
  updateCompassionState,
  updateNumOfCommentState,
  updateWowState,
  voteApplaud,
  voteBroken,
  voteCompassion,
  voteWow,
} from "./state/reducers/storiesSlice";

import { useSelector, useDispatch } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import StoryModal from "./StoryModal";
import { getDocs } from "@firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "./firebase";
import { getHeaderData, menuState } from "./state/reducers/headerSlice";
import { getstoriesData, loadStories } from "./state/reducers/storiesSlice";
import { useIsFocused } from "@react-navigation/native";

const GetHeader = ({ navigation, route }) => {
  const ccc = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getAuthData);
  const [selectedId, setSelectedId] = useState(null);
  const {
    applaudState,
    compassionState,
    brokenState,
    wowState,
    NumOfCommentState,
  } = useAppSelector(getstoriesData);
  const isFocused = useIsFocused();

  useEffect(() => {
    dispatch(menuState(false));
    isFocused && dispatch(updateApplaudState([]));
    isFocused && dispatch(updateCompassionState([]));
    isFocused && dispatch(updateBrokenState([]));
    isFocused && dispatch(updateWowState([]));
  }, [isFocused]);

  useEffect(() => {
    dispatch(
      updateApplaudState(
        ccc.item.applauds.filter((zzz) => zzz.voter === user.id).length === 0
      )
    );
    dispatch(
      updateCompassionState(
        ccc.item.compassions.filter((zzz) => zzz.voter === user.id).length === 0
      )
    );
    dispatch(
      updateBrokenState(
        ccc.item.brokens.filter((zzz) => zzz.voter === user.id).length === 0
      )
    );
    dispatch(
      updateWowState(
        ccc.item.justNos.filter((zzz) => zzz.voter === user.id).length === 0
      )
    );
    dispatch(updateNumOfCommentState(ccc.item.numOfComments));
  }, []);

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
    setSelectedId(item.id);
  };

  const handleApplauded = (item) => {
    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.applauds];
    applaudState ? voteArray.push(voteData) : voteArray.pop();
    dispatch(
      voteApplaud({
        voteData,
        voteArray,
      })
    ).then(() => dispatch(updateApplaudState(!applaudState)));
  };
  const handleFeelingIt = (item) => {
    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.compassions];
    compassionState ? voteArray.push(voteData) : voteArray.pop();

    dispatch(
      voteCompassion({
        voteData,
        voteArray,
      })
    ).then(() => dispatch(updateCompassionState(!compassionState)));
  };
  const handleHeartBreaking = (item) => {
    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.brokens];
    brokenState ? voteArray.push(voteData) : voteArray.pop();
    dispatch(
      voteBroken({
        voteData,
        voteArray,
      })
    ).then(() => dispatch(updateBrokenState(!brokenState)));
  };
  const handleCantDealWithThis = (item) => {
    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.justNos];
    wowState ? voteArray.push(voteData) : voteArray.pop();
    dispatch(
      voteWow({
        voteData,
        voteArray,
      })
    ).then(() => dispatch(updateWowState(!wowState)));
  };

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
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: 15,
        }}
      >
        <TouchableOpacity onPress={() => handleApplauded(ccc.item)}>
          <MaterialCommunityIcons
            name="hand-clap"
            color={!applaudState ? "#73481c" : "#707070"}
            size={28}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFeelingIt(ccc.item)}>
          <MaterialCommunityIcons
            name="heart"
            color={!compassionState ? "#4c0000" : "#707070"}
            size={28}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleHeartBreaking(ccc.item)}>
          <MaterialCommunityIcons
            name="heart-broken"
            color={!brokenState ? "#5900b2" : "#707070"}
            size={28}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCantDealWithThis(ccc.item)}>
          <Feather
            name="trending-down"
            color={!wowState ? "#305a63" : "#707070"}
            size={28}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleOnpress(ccc.item)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: "space-between",
          }}
        >
          <FontAwesome name="comments" color={"#707070"} size={28} />

          {NumOfCommentState !== 0 && (
            <Text
              style={{
                color: "white",
                padding: 0,
                marginHorizontal: 5,
              }}
            >
              {NumOfCommentState}
            </Text>
          )}
        </TouchableOpacity>
      </View>
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

export default GetHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#051e28",
    // color: "yellow",
  },
  subContainer: { marginBottom: 7 },
  title: {
    fontSize: 28,
    color: "#CDD2D4",
    padding: 16,
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
