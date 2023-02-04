import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, getUser } from "./state/reducers/authSlice";
import {} from "./state/reducers/repliesSlice";
import {
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

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { menuState } from "./state/reducers/headerSlice";
import { getstoriesData } from "./state/reducers/storiesSlice";

const GetHeader = ({ navigation, route, storyId }) => {
  const ccc = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(getAuthData);
  const [selectedId, setSelectedId] = useState(null);
  const [voteArray, setvoteArray] = useState(ccc.item.applauds);
  const {
    applaudState,
    compassionState,
    brokenState,
    wowState,
    NumOfCommentState,
  } = useAppSelector(getstoriesData);

  useEffect(() => {
    dispatch(menuState(false));
    dispatch(
      updateApplaudState(ccc.item.applauds.filter((zzz) => zzz === user.id))
    );
    dispatch(
      updateCompassionState(
        ccc.item.compassions.filter((zzz) => zzz === user.id).length !== 0
      )
    );
    dispatch(
      updateBrokenState(
        ccc.item.brokens.filter((zzz) => zzz === user.id).length !== 0
      )
    );
    dispatch(
      updateWowState(
        ccc.item.justNos.filter((zzz) => zzz === user.id).length !== 0
      )
    );
    dispatch(updateNumOfCommentState(ccc.item.numOfComments));
  }, [ccc.item.applauds]);

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
    setSelectedId(item.id);
  };

  const handleApplauded = () => {
    const voteData = {
      voter: user.id,
      storyId: ccc.item.id,
    };
    const voteArray = [...ccc.item.applauds];

    const xxx = () => {
      return voteArray.push(user.id);
    };

    const yyy = () => {
      return voteArray.pop();
    };
    applaudState.length === 0 ? xxx() : yyy();

    const outputArray = voteArray.reduce((acc, curr) => {
      if (!acc.find((obj) => obj === curr)) {
        acc.push(curr);
      }
      return acc;
    }, []);

    dispatch(updateApplaudState(outputArray));
    setTimeout(() => {
      dispatch(
        voteApplaud({
          voteData,
          outputArray,
        })
      );
    }, 450);
  };
  const handleFeelingIt = (item) => {
    const voteData = {
      voter: user.id,
      storyId: item.id,
    };
    const voteArray = [...item.compassions];
    !compassionState
      ? voteArray.push(voteData.voter)
      : voteArray.filter((x) => x.voter !== user.id);
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
    !brokenState
      ? voteArray.push(voteData.voter)
      : voteArray.filter((x) => x.voter !== user.id);
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
    !wowState
      ? voteArray.push(voteData.voter)
      : voteArray.filter((x) => x.voter !== user.id);
    dispatch(
      voteWow({
        voteData,
        voteArray,
      })
    ).then(() => dispatch(updateWowState(!wowState)));
  };

  return (
    <View style={styles.subContainer}>
      <TouchableOpacity
        onPress={() => (
          dispatch(getUser(ccc.item.writerId)),
          navigation.navigate("profile", { notActualUser: true })
        )}
      />
      <Text style={styles.title}>{ccc.item.title}</Text>
      <Text style={styles.content}>
        {"\t"}

        {ccc.item.content}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <TouchableOpacity
          onPress={handleApplauded}
          style={{ flexDirection: "row" }}
        >
          <MaterialCommunityIcons
            name="hand-clap"
            color={applaudState.length === 0 ? "#707070" : "#73481c"}
            size={28}
          />
          {ccc.item.applauds.length !== 0 && (
            <Text style={{ color: "#9db0c0", fontSize: 11 }}>
              {ccc.item.applauds.length}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleFeelingIt(ccc.item)}
          style={{ flexDirection: "row" }}
        >
          <MaterialCommunityIcons
            name="heart"
            color={!compassionState ? "#707070" : "#4c0000"}
            size={28}
          />
          {ccc.item.compassions.length !== 0 && (
            <Text style={{ color: "#9db0c0", fontSize: 11 }}>
              {ccc.item.compassions.length}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleHeartBreaking(ccc.item)}
          style={{ flexDirection: "row" }}
        >
          <MaterialCommunityIcons
            name="heart-broken"
            color={!brokenState ? "#707070" : "#5900b2"}
            size={28}
          />
          {ccc.item.brokens.length !== 0 && (
            <Text style={{ color: "#9db0c0", fontSize: 11 }}>
              {ccc.item.brokens.length}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCantDealWithThis(ccc.item)}
          style={{ flexDirection: "row" }}
        >
          <Feather
            name="trending-down"
            color={!wowState ? "#707070" : "#305a63"}
            size={28}
          />
          {ccc.item.justNos.length !== 0 && (
            <Text style={{ color: "#9db0c0", fontSize: 11 }}>
              {ccc.item.justNos.length}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOnpress(ccc.item)}
          style={{
            flexDirection: "row",
            // alignItems: "center",
          }}
        >
          <FontAwesome name="comments" color={"#707070"} size={28} />

          {ccc.item.numOfComments !== 0 && (
            <Text style={{ color: "#9db0c0", fontSize: 11 }}>
              {ccc.item.numOfComments}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingTop: 10,
          // paddingBottom: 10,
          borderBottomColor: "grey",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <Text
        style={{
          color: "#7f6c33",
          fontSize: 14,
          marginLeft: 5,
          marginTop: 5,
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
    backgroundColor: "#051e28",
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
  },
  miniLogo: {
    width: 40,
    height: 40,
    borderRadius: 50,
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
    color: "#8BBCCC",
  },
  button: {
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
