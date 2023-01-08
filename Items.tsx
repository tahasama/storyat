import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData, menuState } from "./state/reducers/authSlice";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
    content:
      "I'm using react-navigation's DrawerNavigator in my app. I would like to detect when a user drags open the side menu so that i can perform a certain action, e.g dismiss an opened Keyboard. How can i do this? i can't seem to find a solution in the docs. Thank you.I'm using react-navigation's DrawerNavigator in my app. I would like to detect when a user drags open the side menu so that i can perform a certain action, e.g dismiss an opened Keyboard. How can i do this? i can't seem to find a solution in the docs. Thank you.I'm using react-navigation's DrawerNavigator in my app. I would like to detect when a user drags open the side menu so that i can perform a certain action, e.g dismiss an opened Keyboard. How can i do this? i can't seem to find a solution in the docs. Thank you.I'm using react-navigation's DrawerNavigator in my app. I would like to detect when a user drags open the side menu so that i can perform a certain action, e.g dismiss an opened Keyboard. How can i do this? i can't seem to find a solution in the docs. Thank you.",
    commentSection: [
      {
        id: "111-111-111",
        comment: "duuuuude",
        user: {
          id: "222-222-222",
          avatar:
            "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/00/001c85b938e44244325b1e6f250ea09d7e54ba94_full.jpg",
        },
        response: [
          {
            id: "333-333-333",
            comment: "yeah!",
            user: {
              id: "444-444-444",
              avatar:
                "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/a1/a19399f731e7e7c074be5859cbd0bf556ecd62fc.jpg",
            },
          },
        ],
      },
      {
        id: "555-555-555",
        comment: "nah!",
        user: {
          id: "666-666-666",
          avatar:
            "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/f9/f9b9f1f4e60f87455a921fc184246a2205ca5c2a_full.jpg",
        },
        response: [
          {
            id: "777-777-777",
            comment: "WTF",
            user: {
              id: "999-999-999",
              avatar:
                "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/4c/4c9bf68297cd582c81f6f96a2fe3c59952b4b92c_full.jpg",
            },
          },
          {
            id: "888-888-888",
            comment: "hhhhhhhhh",
            user: {
              id: "000-000-000",
              avatar:
                "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/7d/7dcc45ac6c3e6340f5f212f5df0c250f11fb47ae_full.jpg",
            },
          },
        ],
      },
    ],
  },

  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
    content:
      "I have a simple project where it's using vite + react + typescript, in order to minimize the import text, I implemented module alias and it's working properly but the VScode throws an error that I cannot solve.",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    content:
      "The following modal contains bookmarks added by the user. The user can delete unwanted bookmarks. Upon delete, the underlying component data is refreshed accordingly but the modal still shows the same data. If one out of three rows is deleted by the user, for instance, the modal still shows three rows even though the refrehsed component now has two rows.",
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
    // backgroundColor: "#333333",
    backgroundColor: "#051e28",
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
