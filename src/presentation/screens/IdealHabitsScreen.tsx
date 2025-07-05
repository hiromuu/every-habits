import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  getUserIdealHabits,
  createUserIdealHabits,
  updateUserIdealHabits,
  addHabit,
  removeHabit,
} from "@/infrastructure/firebase/repositories/FirebaseUserHabitsRepository";
import { UserIdealHabits } from "@/domain/entities/UserIdealHabits";

interface IdealHabitsScreenProps {
  navigation: any;
}

// カスタムフック: 理想習慣の状態管理
const useIdealHabits = () => {
  const [userHabits, setUserHabits] = useState<UserIdealHabits | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [morningInput, setMorningInput] = useState("");
  const [eveningInput, setEveningInput] = useState("");

  // 仮のユーザーID（後で認証システムと連携）
  const userId = "test-user-123";

  const loadUserHabits = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUserIdealHabits(userId);
      if (result.success && result.data) {
        setUserHabits(result.data);
      } else {
        // 新規作成
        const newHabits = new UserIdealHabits(
          "",
          userId,
          [],
          [],
          new Date(),
          new Date(),
          1
        );
        setUserHabits(newHabits);
      }
    } catch (error) {
      Alert.alert("エラー", "習慣の読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleAddHabit = useCallback(
    async (timeOfDay: "morning" | "evening", habit: string) => {
      if (!habit.trim()) return;

      try {
        const result = await addHabit(userId, habit.trim(), timeOfDay);
        if (result.success && result.data) {
          setUserHabits(result.data);
          if (timeOfDay === "morning") {
            setMorningInput("");
          } else {
            setEveningInput("");
          }
        } else {
          Alert.alert("エラー", result.error || "習慣の追加に失敗しました。");
        }
      } catch (error) {
        Alert.alert("エラー", "習慣の追加に失敗しました。");
      }
    },
    [userId]
  );

  const handleRemoveHabit = useCallback(
    async (timeOfDay: "morning" | "evening", habit: string) => {
      try {
        const result = await removeHabit(userId, habit, timeOfDay);
        if (result.success && result.data) {
          setUserHabits(result.data);
        } else {
          Alert.alert("エラー", result.error || "習慣の削除に失敗しました。");
        }
      } catch (error) {
        Alert.alert("エラー", "習慣の削除に失敗しました。");
      }
    },
    [userId]
  );

  const handleSave = useCallback(async () => {
    if (!userHabits) return;

    setSaving(true);
    try {
      let result;
      if (userHabits.habitId) {
        result = await updateUserIdealHabits(userHabits);
      } else {
        result = await createUserIdealHabits(userHabits);
      }

      if (result.success) {
        Alert.alert("成功", "理想習慣を保存しました。");
      } else {
        Alert.alert("エラー", result.error || "保存に失敗しました。");
      }
    } catch (error) {
      Alert.alert("エラー", "保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  }, [userHabits]);

  useEffect(() => {
    loadUserHabits();
  }, [loadUserHabits]);

  return {
    userHabits,
    loading,
    saving,
    morningInput,
    eveningInput,
    setMorningInput,
    setEveningInput,
    handleAddHabit,
    handleRemoveHabit,
    handleSave,
  };
};

export const IdealHabitsScreen: React.FC<IdealHabitsScreenProps> = ({
  navigation,
}) => {
  const {
    userHabits,
    loading,
    saving,
    morningInput,
    eveningInput,
    setMorningInput,
    setEveningInput,
    handleAddHabit,
    handleRemoveHabit,
    handleSave,
  } = useIdealHabits();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>理想習慣設定</Text>
          <Text style={styles.subtitle}>
            あなたの理想的な朝・夜の習慣を設定しましょう
          </Text>

          {/* 朝の習慣 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌅 朝の習慣</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={morningInput}
                onChangeText={setMorningInput}
                placeholder="朝の習慣を入力..."
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddHabit("morning", morningInput)}
              >
                <Text style={styles.addButtonText}>追加</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.habitsList}>
              {userHabits?.morningHabits.map((habit, index) => (
                <View key={index} style={styles.habitItem}>
                  <Text style={styles.habitText}>{habit}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveHabit("morning", habit)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* 夜の習慣 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌙 夜の習慣</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={eveningInput}
                onChangeText={setEveningInput}
                placeholder="夜の習慣を入力..."
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddHabit("evening", eveningInput)}
              >
                <Text style={styles.addButtonText}>追加</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.habitsList}>
              {userHabits?.eveningHabits.map((habit, index) => (
                <View key={index} style={styles.habitItem}>
                  <Text style={styles.habitText}>{habit}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveHabit("evening", habit)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* 保存ボタン */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? "保存中..." : "保存"}
            </Text>
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
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  addButton: {
    backgroundColor: "#667eea",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  habitsList: {
    gap: 10,
  },
  habitItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  habitText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  removeButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 16,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#4ecdc4",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
