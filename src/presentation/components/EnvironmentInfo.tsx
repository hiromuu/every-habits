import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { envInfo } from "@/infrastructure/firebase/config";

interface EnvironmentInfoProps {
  showInProduction?: boolean;
}

/**
 * 現在の環境情報を表示するコンポーネント
 */
export const EnvironmentInfo: React.FC<EnvironmentInfoProps> = ({
  showInProduction = false,
}) => {
  // 本番環境では表示しない（オプション）
  if (envInfo.isProduction && !showInProduction) {
    return null;
  }

  const getEnvironmentColor = () => {
    switch (envInfo.environment) {
      case "development":
        return "#4CAF50"; // 緑
      case "demo":
        return "#FF9800"; // オレンジ
      case "production":
        return "#F44336"; // 赤
      default:
        return "#9E9E9E"; // グレー
    }
  };

  const getEnvironmentLabel = () => {
    switch (envInfo.environment) {
      case "development":
        return "DEV";
      case "demo":
        return "DEMO";
      case "production":
        return "PROD";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: getEnvironmentColor() }]}
    >
      <Text style={styles.text}>{getEnvironmentLabel()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1000,
  },
  text: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
