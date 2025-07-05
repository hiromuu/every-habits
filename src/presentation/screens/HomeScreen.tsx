import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { EnvironmentInfo } from "../components/EnvironmentInfo";

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
      <EnvironmentInfo />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Every Habits</Text>
          <Text style={styles.subtitle}>習慣を変えて、人生を変える</Text>

          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("IdealHabits")}
            >
              <Text style={styles.menuIcon}>🎯</Text>
              <Text style={styles.menuTitle}>理想習慣設定</Text>
              <Text style={styles.menuDescription}>
                あなたの理想的な朝・夜の習慣を設定しましょう
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Suggestion")}
            >
              <Text style={styles.menuIcon}>💡</Text>
              <Text style={styles.menuTitle}>今日の提案</Text>
              <Text style={styles.menuDescription}>
                AIがあなたに合った習慣を提案します
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Log")}
            >
              <Text style={styles.menuIcon}>📊</Text>
              <Text style={styles.menuTitle}>習慣ログ</Text>
              <Text style={styles.menuDescription}>
                習慣の実践状況を記録・確認できます
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#667eea",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 40,
  },
  menuContainer: {
    gap: 20,
  },
  menuItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }),
  },
  menuIcon: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  menuDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
