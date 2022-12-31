import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  Button,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const Splash = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimOut = useRef(new Animated.Value(1)).current;
  const moveAnim = useRef(new Animated.ValueXY({ x: 0, y: 150 })).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }),
      Animated.timing(moveAnim, {
        toValue: { x: 0, y: 0 },
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start();
    setTimeout(() => {
      Animated.timing(fadeAnimOut, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: false,
      }).start();
    }, 2000);
  }, []);

  const boxInterpolation = colorAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [
      "rgb(88, 119, 188)",
      "rgb(154, 221, 211)",
      "rgb(205, 183, 154)",
    ],
  });

  let [fontsLoaded] = useFonts({
    "IndieFlower-Regular": require("./assets/fonts/IndieFlower-Regular.ttf"),
    "RubikBubbles-Regular": require("./assets/fonts/RubikBubbles-Regular.ttf"),
    "Caramel-Regular": require("./assets/fonts/Caramel-Regular.ttf"),
    "JosefinSans-Bold": require("./assets/fonts/JosefinSans-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimOut }]}>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={[styles.container]}
      >
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: fadeAnim,
              color: boxInterpolation,
              fontFamily: "JosefinSans-Bold",
              //   transform: [
              //     {
              //       translateY: moveAnim.interpolate({
              //         inputRange: [0, 1],
              //         outputRange: [200, 0], // 0 : 150, 0.5 : 75, 1 : 0
              //       }),
              //     },
              //   ],
            },
            moveAnim.getLayout(),
          ]}
        >
          STORYAT
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#435898",
    width: "100%",
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 40,
    letterSpacing: 5,
    // fontWeight: "300",
  },
});
