// 基本データ型
export type TimeOfDay = "morning" | "evening";
export type FeedbackType = "accept" | "maybe" | "reject";
export type Theme = "light" | "dark";
export type Language = "ja" | "en";

// ユーザー関連
export interface User {
  userId: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  preferences: {
    notificationEnabled: boolean;
    theme: Theme;
    language: Language;
  };
}

// 習慣関連
export interface UserIdealHabits {
  habitId: string;
  userId: string;
  morningHabits: string[];
  eveningHabits: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// 提案関連
export interface Suggestion {
  suggestionId: string;
  title: string;
  description: string;
  category: string;
  timeOfDay: TimeOfDay;
  priority: number;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // 統計情報
  acceptCount: number;
  rejectCount: number;
  maybeCount: number;
  totalFeedback: number;
}

// フィードバック関連
export interface UserFeedback {
  feedbackId: string;
  userId: string;
  suggestionId: string;
  feedbackType: FeedbackType;
  comment?: string;
  timestamp: Date;
  metadata: {
    userAgent: string;
    appVersion: string;
    timeOfDay: TimeOfDay;
  };
}

// 提案履歴
export interface SuggestionLog {
  logId: string;
  userId: string;
  suggestionId: string;
  feedbackId: string;
  date: Date;
  timeOfDay: TimeOfDay;
  createdAt: Date;
}

// API レスポンス型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 統計情報
export interface Statistics {
  totalSuggestions: number;
  totalFeedback: number;
  acceptanceRate: number;
  rejectionRate: number;
  maybeRate: number;
}
