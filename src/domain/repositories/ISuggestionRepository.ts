import { Suggestion } from "@/domain/entities/Suggestion";
import { TimeOfDay } from "@/domain/valueObjects/TimeOfDay";
import { ApiResponse } from "@/shared/types";

export interface ISuggestionRepository {
  // 提案を取得
  getSuggestion(suggestionId: string): Promise<ApiResponse<Suggestion>>;

  // 時間帯別の提案を取得
  getSuggestionsByTimeOfDay(
    timeOfDay: TimeOfDay
  ): Promise<ApiResponse<Suggestion[]>>;

  // カテゴリ別の提案を取得
  getSuggestionsByCategory(
    category: string
  ): Promise<ApiResponse<Suggestion[]>>;

  // アクティブな提案を取得
  getActiveSuggestions(): Promise<ApiResponse<Suggestion[]>>;

  // 提案を作成
  createSuggestion(suggestion: Suggestion): Promise<ApiResponse<Suggestion>>;

  // 提案を更新
  updateSuggestion(suggestion: Suggestion): Promise<ApiResponse<Suggestion>>;

  // 提案を削除
  deleteSuggestion(suggestionId: string): Promise<ApiResponse<boolean>>;

  // 統計情報を更新
  updateSuggestionStatistics(
    suggestionId: string,
    feedbackType: "accept" | "maybe" | "reject"
  ): Promise<ApiResponse<boolean>>;

  // 受容率の高い提案を取得
  getHighAcceptanceSuggestions(
    limit?: number
  ): Promise<ApiResponse<Suggestion[]>>;

  // ランダムな提案を取得
  getRandomSuggestion(timeOfDay?: TimeOfDay): Promise<ApiResponse<Suggestion>>;
}
