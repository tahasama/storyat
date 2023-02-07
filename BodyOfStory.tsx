import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, getUser } from "./state/reducers/authSlice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import StoryModal from "./StoryModal";
import { getHeaderData, menuState } from "./state/reducers/headerSlice";
import { getstoriesData } from "./state/reducers/storiesSlice";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FooterOfStory from "./FooterOfStory";

const BodyOfStory = ({ item }: any) => {
  const navigation = useNavigation<any>();
  const { user } = useAppSelector(getAuthData);
  const { menuStateValue } = useAppSelector(getHeaderData);
  const { resultInitial } = useAppSelector(getstoriesData);
  const [selectedId, setSelectedId] = useState(null);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pageName = useRoute().name;

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
    setSelectedId(item.id);
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          handleOnpress(item);
        }}
      >
        <Text style={[styles.title, { textAlign: "center" }]}>
          {item.title}
        </Text>
        <Text
          style={[
            styles.title,
            { marginHorizontal: 10, color: "#9fa3a7", fontSize: 20 },
          ]}
          numberOfLines={2}
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
    marginBottom: 25,
    marginHorizontal: 32,
    minHeight: 80,
  },
});
