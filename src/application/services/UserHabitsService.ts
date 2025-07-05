import { IUserIdealHabitsRepository } from "@/domain/repositories/IUserIdealHabitsRepository";
import { UserIdealHabits } from "@/domain/entities/UserIdealHabits";
import { ApiResponse } from "@/shared/types";

export class UserHabitsService {
  constructor(private userHabitsRepository: IUserIdealHabitsRepository) {}

  async saveUserHabits(
    userId: string,
    morningHabits: string[],
    eveningHabits: string[]
  ): Promise<ApiResponse<UserIdealHabits>> {
    try {
      // 既存の習慣データを取得
      const existingHabits = await this.userHabitsRepository.getUserIdealHabits(
        userId
      );

      if (existingHabits.success && existingHabits.data) {
        // 既存データがある場合は更新
        const updatedHabits = new UserIdealHabits(
          existingHabits.data.habitId,
          userId,
          morningHabits,
          eveningHabits,
          existingHabits.data.createdAt,
          new Date(),
          existingHabits.data.version + 1
        );
        return await this.userHabitsRepository.updateUserIdealHabits(
          updatedHabits
        );
      } else {
        // 新規作成
        const newHabits = new UserIdealHabits(
          "", // IDはFirestoreで自動生成
          userId,
          morningHabits,
          eveningHabits,
          new Date(),
          new Date(),
          1
        );
        return await this.userHabitsRepository.createUserIdealHabits(newHabits);
      }
    } catch (error) {
      return { success: false, error: `Failed to save user habits: ${error}` };
    }
  }

  async getUserHabits(userId: string): Promise<ApiResponse<UserIdealHabits>> {
    try {
      return await this.userHabitsRepository.getUserIdealHabits(userId);
    } catch (error) {
      return { success: false, error: `Failed to get user habits: ${error}` };
    }
  }

  async updateMorningHabits(
    userId: string,
    habits: string[]
  ): Promise<ApiResponse<UserIdealHabits>> {
    try {
      return await this.userHabitsRepository.updateMorningHabits(
        userId,
        habits
      );
    } catch (error) {
      return {
        success: false,
        error: `Failed to update morning habits: ${error}`,
      };
    }
  }

  async updateEveningHabits(
    userId: string,
    habits: string[]
  ): Promise<ApiResponse<UserIdealHabits>> {
    try {
      return await this.userHabitsRepository.updateEveningHabits(
        userId,
        habits
      );
    } catch (error) {
      return {
        success: false,
        error: `Failed to update evening habits: ${error}`,
      };
    }
  }

  async addHabit(
    userId: string,
    habit: string,
    timeOfDay: "morning" | "evening"
  ): Promise<ApiResponse<UserIdealHabits>> {
    try {
      return await this.userHabitsRepository.addHabit(userId, habit, timeOfDay);
    } catch (error) {
      return { success: false, error: `Failed to add habit: ${error}` };
    }
  }

  async removeHabit(
    userId: string,
    habit: string,
    timeOfDay: "morning" | "evening"
  ): Promise<ApiResponse<UserIdealHabits>> {
    try {
      return await this.userHabitsRepository.removeHabit(
        userId,
        habit,
        timeOfDay
      );
    } catch (error) {
      return { success: false, error: `Failed to remove habit: ${error}` };
    }
  }

  async deleteUserHabits(userId: string): Promise<ApiResponse<boolean>> {
    try {
      return await this.userHabitsRepository.deleteUserIdealHabits(userId);
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete user habits: ${error}`,
      };
    }
  }
}
