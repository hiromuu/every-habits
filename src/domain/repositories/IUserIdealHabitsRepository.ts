import { UserIdealHabits } from "@/domain/entities/UserIdealHabits";
import { ApiResponse } from "@/shared/types";

export interface IUserIdealHabitsRepository {
  // ユーザーの理想習慣を取得
  getUserIdealHabits(userId: string): Promise<ApiResponse<UserIdealHabits>>;

  // 理想習慣を作成
  createUserIdealHabits(
    habits: UserIdealHabits
  ): Promise<ApiResponse<UserIdealHabits>>;

  // 理想習慣を更新
  updateUserIdealHabits(
    habits: UserIdealHabits
  ): Promise<ApiResponse<UserIdealHabits>>;

  // 理想習慣を削除
  deleteUserIdealHabits(userId: string): Promise<ApiResponse<boolean>>;

  // 朝の習慣を更新
  updateMorningHabits(
    userId: string,
    habits: string[]
  ): Promise<ApiResponse<UserIdealHabits>>;

  // 夜の習慣を更新
  updateEveningHabits(
    userId: string,
    habits: string[]
  ): Promise<ApiResponse<UserIdealHabits>>;

  // 習慣を追加
  addHabit(
    userId: string,
    habit: string,
    timeOfDay: "morning" | "evening"
  ): Promise<ApiResponse<UserIdealHabits>>;

  // 習慣を削除
  removeHabit(
    userId: string,
    habit: string,
    timeOfDay: "morning" | "evening"
  ): Promise<ApiResponse<UserIdealHabits>>;

  // 習慣が存在するかチェック
  habitExists(
    userId: string,
    habit: string,
    timeOfDay: "morning" | "evening"
  ): Promise<ApiResponse<boolean>>;
}
