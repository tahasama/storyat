import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, menuState } from "./state/reducers/authSlice";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

const Items = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { menuStateVakue } = useAppSelector(getAuthData);
  const [selectedId, setSelectedId] = useState(null);

  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
    setSelectedId(item.id);
  };
  useEffect(() => {
    dispatch(menuState(!menuStateVakue));
  }, []);

  useEffect(() => {
    menuStateVakue ? navigation.openDrawer() : navigation.closeDrawer();
    // navigation.toggleDrawer();
  }, [menuStateVakue]);

  return (
    <SafeAreaView style={styles.container}>
      {/* <AntDesign name='logout' style={styles.icon}/> */}
      {/* <Menu navigation /> */}
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              onPress={() => {
                handleOnpress(item);
              }}
            >
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
  },

  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    color: "#bcbcbc",
  },

  icon: {
    position: "absolute",
    display: "flex",
    flexDirection: "column-reverse",
    backgroundColor: "#0782F9",
  },
});

export default Items;
