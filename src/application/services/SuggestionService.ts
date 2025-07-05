import { Suggestion } from "@/domain/entities/Suggestion";
import { UserIdealHabits } from "@/domain/entities/UserIdealHabits";
import {
  generateSuggestion,
  generatePersonalizedSuggestion,
} from "@/infrastructure/openai/services/OpenAISuggestionService";
import {
  createSuggestion as createSuggestionInFirestore,
  getRandomSuggestion as getRandomSuggestionFromFirestore,
  updateSuggestionStatistics as updateSuggestionStatisticsInFirestore,
  getSuggestionsByTimeOfDay as getSuggestionsByTimeOfDayFromFirestore,
  getHighAcceptanceSuggestions as getHighAcceptanceSuggestionsFromFirestore,
} from "@/infrastructure/firebase/repositories/FirebaseSuggestionRepository";
import { getUserIdealHabits } from "@/infrastructure/firebase/repositories/FirebaseUserHabitsRepository";
import { ApiResponse } from "@/shared/types";

// 現在の時間帯を取得する関数
const getCurrentTimeOfDay = (): "morning" | "evening" => {
  const hour = new Date().getHours();
  return hour >= 5 && hour < 18 ? "morning" : "evening";
};

// 提案を生成して保存する関数
export const generateAndSaveSuggestion = async (
  userId: string,
  timeOfDay: "morning" | "evening"
): Promise<ApiResponse<Suggestion>> => {
  try {
    // ユーザーの理想習慣を取得
    const userHabitsResult = await getUserIdealHabits(userId);
    if (!userHabitsResult.success || !userHabitsResult.data) {
      return { success: false, error: "User habits not found" };
    }

    // OpenAIで提案を生成
    const generatedSuggestion = await generateSuggestion(
      userHabitsResult.data,
      timeOfDay
    );

    if (!generatedSuggestion.success || !generatedSuggestion.data) {
      return { success: false, error: "Failed to generate suggestion" };
    }

    // Firestoreに保存
    const suggestion = new Suggestion(
      "", // IDは自動生成
      generatedSuggestion.data.title,
      generatedSuggestion.data.description,
      generatedSuggestion.data.category,
      timeOfDay,
      generatedSuggestion.data.priority,
      generatedSuggestion.data.tags,
      true,
      new Date(),
      new Date()
    );

    const saveResult = await createSuggestionInFirestore(suggestion);
    return saveResult;
  } catch (error) {
    return {
      success: false,
      error: `Failed to generate and save suggestion: ${error}`,
    };
  }
};

// ランダムな提案を取得する関数
export const getRandomSuggestion = async (
  userId: string,
  timeOfDay?: "morning" | "evening"
): Promise<ApiResponse<Suggestion>> => {
  try {
    // 既存の提案からランダムに選択
    const existingSuggestion =
      await getRandomSuggestionFromFirestore(timeOfDay);

    if (existingSuggestion.success && existingSuggestion.data) {
      return existingSuggestion;
    }

    // 既存の提案がない場合は新しく生成
    const actualTimeOfDay = timeOfDay || getCurrentTimeOfDay();
    return await generateAndSaveSuggestion(userId, actualTimeOfDay);
  } catch (error) {
    return {
      success: false,
      error: `Failed to get random suggestion: ${error}`,
    };
  }
};

// パーソナライズされた提案を取得する関数
export const getPersonalizedSuggestion = async (
  userId: string,
  timeOfDay: "morning" | "evening",
  userPreferences?: string[]
): Promise<ApiResponse<Suggestion>> => {
  try {
    // ユーザーの理想習慣を取得
    const userHabitsResult = await getUserIdealHabits(userId);
    if (!userHabitsResult.success || !userHabitsResult.data) {
      return { success: false, error: "User habits not found" };
    }

    // パーソナライズされた提案を生成
    const generatedSuggestion = await generatePersonalizedSuggestion(
      userHabitsResult.data,
      timeOfDay,
      userPreferences
    );

    if (!generatedSuggestion.success || !generatedSuggestion.data) {
      return {
        success: false,
        error: "Failed to generate personalized suggestion",
      };
    }

    // Firestoreに保存
    const suggestion = new Suggestion(
      "",
      generatedSuggestion.data.title,
      generatedSuggestion.data.description,
      generatedSuggestion.data.category,
      timeOfDay,
      generatedSuggestion.data.priority,
      generatedSuggestion.data.tags,
      true,
      new Date(),
      new Date()
    );

    const saveResult = await createSuggestionInFirestore(suggestion);
    return saveResult;
  } catch (error) {
    return {
      success: false,
      error: `Failed to get personalized suggestion: ${error}`,
    };
  }
};

// 時間帯別の提案を取得する関数
export const getSuggestionsByTimeOfDay = async (
  timeOfDay: "morning" | "evening"
): Promise<ApiResponse<Suggestion[]>> => {
  try {
    return await getSuggestionsByTimeOfDayFromFirestore(timeOfDay);
  } catch (error) {
    return {
      success: false,
      error: `Failed to get suggestions by time of day: ${error}`,
    };
  }
};

// 高受容率の提案を取得する関数
export const getHighAcceptanceSuggestions = async (
  limit: number = 10
): Promise<ApiResponse<Suggestion[]>> => {
  try {
    return await getHighAcceptanceSuggestionsFromFirestore(limit);
  } catch (error) {
    return {
      success: false,
      error: `Failed to get high acceptance suggestions: ${error}`,
    };
  }
};

// 統計情報を更新する関数
export const updateSuggestionStatistics = async (
  suggestionId: string,
  feedbackType: "accept" | "maybe" | "reject"
): Promise<ApiResponse<boolean>> => {
  try {
    return await updateSuggestionStatisticsInFirestore(
      suggestionId,
      feedbackType
    );
  } catch (error) {
    return {
      success: false,
      error: `Failed to update suggestion statistics: ${error}`,
    };
  }
};
