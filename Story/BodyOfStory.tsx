import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const BodyOfStory = ({ item }: any) => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const [isPending, setIsPending] = useState(false);
  const [heightImage, setHeightImage] = useState(0);

  useEffect(() => {
    item &&
      item.storyImage &&
      Image.getSize(item.storyImage, (width, height) => {
        setHeightImage(height * (windowWidth / width));
      });
  }, [item.storyImage]);

  const handleOnpress = (item) => {
    if (isPending) return;
    setIsPending(true);
    navigation.navigate("item", { item: item });
    setIsPending(false);
  };

  const MemoizedImage = React.memo(({ uri }: any) => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={{
            uri: uri,
          }}
          style={{
            marginBottom: 20,
            width: windowWidth,
            height: heightImage,
          }}
        />
      </View>
    );
  });
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          handleOnpress(item);
        }}
      >
        <Text style={[styles.title]}>{item.title}</Text>
        {item.storyImage && <MemoizedImage uri={item.storyImage} />}
        <Text
          style={[styles.content, {}]}
          numberOfLines={route.name !== "item" ? 2 : 250}
        >
          {"\t"} {item.content}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default BodyOfStory;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    color: "#bcbcbc",
    marginTop: 22,
    marginBottom: 20,
    marginHorizontal: 32,
    // minHeight: 70,
  },
  content: {
    marginTop: 0,
    marginBottom: 25,
    minHeight: 80,
    marginHorizontal: 10,
    color: "#9fa3a7",
    fontSize: 19,
  },
});
