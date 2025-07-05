import { UserFeedback, SuggestionLog } from "@/shared/types";
import { ApiResponse } from "@/shared/types";

export interface IUserFeedbackRepository {
  // フィードバックを作成
  createFeedback(feedback: UserFeedback): Promise<ApiResponse<UserFeedback>>;

  // ユーザーのフィードバックを取得
  getUserFeedbacks(userId: string): Promise<ApiResponse<UserFeedback[]>>;

  // 提案のフィードバックを取得
  getSuggestionFeedbacks(
    suggestionId: string
  ): Promise<ApiResponse<UserFeedback[]>>;

  // フィードバックを更新
  updateFeedback(feedback: UserFeedback): Promise<ApiResponse<UserFeedback>>;

  // フィードバックを削除
  deleteFeedback(feedbackId: string): Promise<ApiResponse<boolean>>;

  // 提案履歴を作成
  createSuggestionLog(log: SuggestionLog): Promise<ApiResponse<SuggestionLog>>;

  // ユーザーの提案履歴を取得
  getUserSuggestionLogs(userId: string): Promise<ApiResponse<SuggestionLog[]>>;

  // 日付別の提案履歴を取得
  getSuggestionLogsByDate(
    userId: string,
    date: Date
  ): Promise<ApiResponse<SuggestionLog[]>>;

  // 時間帯別の提案履歴を取得
  getSuggestionLogsByTimeOfDay(
    userId: string,
    timeOfDay: "morning" | "evening"
  ): Promise<ApiResponse<SuggestionLog[]>>;

  // 統計情報を取得
  getFeedbackStatistics(userId: string): Promise<
    ApiResponse<{
      totalFeedbacks: number;
      acceptCount: number;
      maybeCount: number;
      rejectCount: number;
      acceptanceRate: number;
      maybeRate: number;
      rejectionRate: number;
    }>
  >;
}
