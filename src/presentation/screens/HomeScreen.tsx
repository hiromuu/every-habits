import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleNavigateToIdealHabits = () => {
    navigation.navigate("IdealHabits");
  };

  const handleNavigateToSuggestion = () => {
    navigation.navigate("Suggestion");
  };

  const handleNavigateToLog = () => {
    navigation.navigate("Log");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.title}>Every Habits</Text>
          <Text style={styles.subtitle}>理想的な習慣を身につけよう</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleNavigateToIdealHabits}
            >
              <Text style={styles.buttonText}>理想習慣設定</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleNavigateToSuggestion}
            >
              <Text style={styles.buttonText}>今日の提案</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleNavigateToLog}
            >
              <Text style={styles.buttonText}>ログ・ふりかえり</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 50,
    textAlign: "center",
    opacity: 0.9,
  },
  buttonContainer: {
    width: "100%",
    gap: 20,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
