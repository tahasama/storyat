import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef } from "react";
import { Text, TouchableOpacity, Image, Animated, View } from "react-native";

import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getAuthData, getUser } from "../state/reducers/authSlice";
import { removeStory } from "../state/reducers/storiesSlice";
import { useRoute } from "@react-navigation/native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import StoryModal from "../StoryModal";

const HeadOfStory = ({ item }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { user } = useAppSelector(getAuthData);
  const route = useRoute();

  const handleNavigation = () => {
    setTimeout(() => {
      dispatch(getUser(item.writerId));
      navigation.navigate("profile", { notActualUser: true });
    }, 50);
  };

  const anim = useRef(new Animated.Value(0));

  const shake = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim.current, {
          toValue: -2,
          useNativeDriver: false,
          duration: 80,
        }),
        Animated.timing(anim.current, {
          toValue: 2,
          useNativeDriver: false,
          duration: 80,
        }),
        Animated.timing(anim.current, {
          toValue: 0,
          useNativeDriver: false,
          duration: 80,
        }),
      ]),
      { iterations: 2 }
    ).start();
  }, []);

  const handleRemoveStory = (item) => {
    shake();
    dispatch(removeStory({ storyId: item.id })).then(() =>
      navigation.navigate("items")
    );
  };

  const ccc = {
    reaction: "applauds",
    voteData: {
      story: {
        applauds: [Array],
        avatar:
          "https://firebasestorage.googleapis.com/v0/b/storyat-373416.appspot.com/o/psZHAC0bhIJg0ChfPe2I.jpg?alt=media&token=dbc4e4f7-61ad-45d8-ab59-356f74454958",
        brokens: [Array],
        compassions: [Array],
        content: "4",
        id: "79mjnwNUrPfx7NysQu9H",
        justNos: [Array],
        numOfComments: 0,
        timestamp: 1675873697896,
        title: "4",
        username: "Taha Sama",
        writerId: "psZHAC0bhIJg0ChfPe2I",
      },
      voter: "psZHAC0bhIJg0ChfPe2I",
    },
  };
  return (
    <TouchableOpacity
      onPress={handleNavigation}
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
          marginHorizontal: 10,
          marginVertical: 18,
        }}
      />
      <Text style={{ fontSize: 16, color: "white" }}>{item.username}</Text>
      <Text
        style={{
          color: "#476700",
          marginHorizontal: 10,
          // marginLeft: 70,
          fontSize: 12,
        }}
      >
        {new Date(item.timestamp).toDateString()}
      </Text>
      {route.name === "item" && item.writerId === user.id && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            flex: 1,
            marginHorizontal: 12,
            // backgroundColor: "red",
          }}
        >
          <View style={{ flex: 1 }}>
            {/* <StoryModal pageName={"item"} /> */}
            <StoryModal />
          </View>

          <Animated.View style={{ transform: [{ translateX: anim.current }] }}>
            <MaterialCommunityIcons
              onPress={() => handleRemoveStory(item)}
              name="delete-empty"
              color={"#669393"}
              size={28}
            />
          </Animated.View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default HeadOfStory;
