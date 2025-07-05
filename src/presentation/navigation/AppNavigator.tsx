import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/HomeScreen";
import { IdealHabitsScreen } from "../screens/IdealHabitsScreen";
import { SuggestionScreen } from "../screens/SuggestionScreen";

// 仮の画面
const LogScreen = () => <></>;

export type RootStackParamList = {
  Home: undefined;
  IdealHabits: undefined;
  Suggestion: undefined;
  Log: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#667eea",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Every Habits" }}
      />
      <Stack.Screen
        name="IdealHabits"
        component={IdealHabitsScreen}
        options={{ title: "理想習慣設定" }}
      />
      <Stack.Screen
        name="Suggestion"
        component={SuggestionScreen}
        options={{ title: "今日の提案" }}
      />
      <Stack.Screen
        name="Log"
        component={LogScreen}
        options={{ title: "ログ・ふりかえり" }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
