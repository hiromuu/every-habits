import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  getRandomSuggestion,
  updateSuggestionStatistics,
} from "@/application/services/SuggestionService";
import { Suggestion } from "@/domain/entities/Suggestion";

interface SuggestionScreenProps {
  navigation: any;
}

// カスタムフック: 提案の状態管理
const useSuggestion = () => {
  const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "evening">("morning");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  // 仮のユーザーID（後で認証システムと連携）
  const userId = "test-user-123";

  const loadSuggestion = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getRandomSuggestion(userId, timeOfDay);
      if (result.success && result.data) {
        setCurrentSuggestion(result.data);
      } else {
        Alert.alert("エラー", "提案の取得に失敗しました。");
      }
    } catch (error) {
      Alert.alert("エラー", `提案の取得に失敗しました: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [timeOfDay]);

  const handleFeedback = useCallback(
    async (feedbackType: "accept" | "maybe" | "reject") => {
      if (!currentSuggestion) return;

      setFeedbackSubmitting(true);
      try {
        // 統計情報を更新
        await updateSuggestionStatistics(
          currentSuggestion.suggestionId,
          feedbackType
        );

        // 次の提案を読み込み
        await loadSuggestion();

        Alert.alert("ありがとうございます", "フィードバックを記録しました。");
      } catch (error) {
        Alert.alert("エラー", "フィードバックの送信に失敗しました。");
      } finally {
        setFeedbackSubmitting(false);
      }
    },
    [currentSuggestion, loadSuggestion]
  );

  const handleTimeOfDayChange = useCallback(
    (newTimeOfDay: "morning" | "evening") => {
      setTimeOfDay(newTimeOfDay);
    },
    []
  );

  const handleRefresh = useCallback(() => {
    loadSuggestion();
  }, [loadSuggestion]);

  useEffect(() => {
    loadSuggestion();
  }, [loadSuggestion]);

  return {
    currentSuggestion,
    loading,
    timeOfDay,
    feedbackSubmitting,
    handleFeedback,
    handleTimeOfDayChange,
    handleRefresh,
  };
};

export const SuggestionScreen: React.FC<SuggestionScreenProps> = ({
  navigation,
}) => {
  const {
    currentSuggestion,
    loading,
    timeOfDay,
    feedbackSubmitting,
    handleFeedback,
    handleTimeOfDayChange,
    handleRefresh,
  } = useSuggestion();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>提案を生成中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>今日の提案</Text>

          {/* 時間帯選択 */}
          <View style={styles.timeSelector}>
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeOfDay === "morning" && styles.timeButtonActive,
              ]}
              onPress={() => handleTimeOfDayChange("morning")}
            >
              <Text
                style={[
                  styles.timeButtonText,
                  timeOfDay === "morning" && styles.timeButtonTextActive,
                ]}
              >
                🌅 朝
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeOfDay === "evening" && styles.timeButtonActive,
              ]}
              onPress={() => handleTimeOfDayChange("evening")}
            >
              <Text
                style={[
                  styles.timeButtonText,
                  timeOfDay === "evening" && styles.timeButtonTextActive,
                ]}
              >
                🌙 夜
              </Text>
            </TouchableOpacity>
          </View>

          {/* 提案カード */}
          {currentSuggestion && (
            <View style={styles.suggestionCard}>
              <Text style={styles.suggestionTitle}>
                {currentSuggestion.title}
              </Text>
              <Text style={styles.suggestionDescription}>
                {currentSuggestion.description}
              </Text>

              <View style={styles.suggestionMeta}>
                <Text style={styles.suggestionCategory}>
                  {currentSuggestion.category}
                </Text>
                <Text style={styles.suggestionPriority}>
                  優先度: {currentSuggestion.priority}/10
                </Text>
              </View>

              <View style={styles.tagsContainer}>
                {currentSuggestion.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* フィードバックボタン */}
          {currentSuggestion && (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackTitle}>
                この提案についてどう思いますか？
              </Text>

              <View style={styles.feedbackButtons}>
                <TouchableOpacity
                  style={[styles.feedbackButton, styles.acceptButton]}
                  onPress={() => handleFeedback("accept")}
                  disabled={feedbackSubmitting}
                >
                  <Text style={styles.feedbackButtonText}>✅ する</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.feedbackButton, styles.maybeButton]}
                  onPress={() => handleFeedback("maybe")}
                  disabled={feedbackSubmitting}
                >
                  <Text style={styles.feedbackButtonText}>🤔 してもいい</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.feedbackButton, styles.rejectButton]}
                  onPress={() => handleFeedback("reject")}
                  disabled={feedbackSubmitting}
                >
                  <Text style={styles.feedbackButtonText}>✖️ したくない</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* リフレッシュボタン */}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Text style={styles.refreshButtonText}>🔄 別の提案を見る</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  timeSelector: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  timeButtonActive: {
    backgroundColor: "#667eea",
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  timeButtonTextActive: {
    color: "white",
  },
  suggestionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  suggestionDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 16,
  },
  suggestionMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  suggestionCategory: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },
  suggestionPriority: {
    fontSize: 14,
    color: "#999",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: "#666",
  },
  feedbackContainer: {
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  feedbackButtons: {
    flexDirection: "row",
    gap: 12,
  },
  feedbackButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4ecdc4",
  },
  maybeButton: {
    backgroundColor: "#ffd93d",
  },
  rejectButton: {
    backgroundColor: "#ff6b6b",
  },
  feedbackButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  refreshButton: {
    backgroundColor: "#667eea",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
  },
  refreshButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
