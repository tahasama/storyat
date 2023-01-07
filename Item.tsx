import { View, Text, Button, StyleSheet } from "react-native";
import React from "react";
import { useAppDispatch } from "./state/hooks";
import { itemRoute } from "./state/reducers/authSlice";

const Item = ({ navigation, route }) => {
  const { item } = route.params;
  const dispatch = useAppDispatch();
  dispatch(itemRoute(item.id));

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("items")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default Item;
