import { TimeOfDay as TimeOfDayType } from "@/shared/types";

export class TimeOfDay {
  private constructor(private readonly value: TimeOfDayType) {}

  // ファクトリメソッド
  static create(value: string): TimeOfDay {
    if (value !== "morning" && value !== "evening") {
      throw new Error('TimeOfDay must be either "morning" or "evening"');
    }
    return new TimeOfDay(value as TimeOfDayType);
  }

  // 朝かどうか
  isMorning(): boolean {
    return this.value === "morning";
  }

  // 夜かどうか
  isEvening(): boolean {
    return this.value === "evening";
  }

  // 値を取得
  getValue(): TimeOfDayType {
    return this.value;
  }

  // 文字列表現
  toString(): string {
    return this.value;
  }

  // 等価性チェック
  equals(other: TimeOfDay): boolean {
    return this.value === other.value;
  }

  // 現在の時間帯を判定
  static getCurrentTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();
    return hour >= 5 && hour < 18
      ? TimeOfDay.create("morning")
      : TimeOfDay.create("evening");
  }

  // 表示名を取得
  getDisplayName(): string {
    return this.value === "morning" ? "朝" : "夜";
  }

  // 英語表示名を取得
  getEnglishDisplayName(): string {
    return this.value === "morning" ? "Morning" : "Evening";
  }
}
