import React, { useState } from "react";
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
import Menu from "./Menu";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { getAuthData } from "./state/reducers/authSlice";
// import { openAndClose, initialize } from "./state/reducers/modalSlice";

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

// function Items({ navigation }) {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Home Screen</Text>
//         <Button
//           title="Go to Details"
//           onPress={() => navigation.navigate('ItemZ')}
//         />
//       </View>
//     );
//   }

const Items = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { menuStateVakue } = useAppSelector(getAuthData);
  const [selectedId, setSelectedId] = useState(null);
  const handleOnpress = (item) => {
    navigation.navigate("item", { item: item });
    setSelectedId(item.id);
  };

  // const modal = useSelector((state) => state.modalz);
  // console.log("ffff00000", modal);

  return (
    <SafeAreaView style={styles.container}>
      {/* <AntDesign name='logout' style={styles.icon}/> */}
      <Menu navigation />
      {/* <FlatList
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
      /> */}

      {/* {modal.firstOneValue && <Modal />} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
    // opacity: 0.5,
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
    // width:'5%',

    // justifyContent:'flex-end',
    // alignItems:'center'
  },
});

export default Items;
