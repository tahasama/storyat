import "react-native-gesture-handler";
import { store } from "./state/store";
import { Provider } from "react-redux";
import Index from "./Index";
import React, { useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import {
  closedApp,
  getstoriesData,
  getStory,
} from "./state/reducers/storiesSlice";
import * as Notificationz from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";

function App() {
  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
}

export default App;
