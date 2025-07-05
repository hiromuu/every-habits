import { Suggestion as SuggestionType, TimeOfDay } from "@/shared/types";

export class Suggestion implements SuggestionType {
  constructor(
    public suggestionId: string,
    public title: string,
    public description: string,
    public category: string,
    public timeOfDay: TimeOfDay,
    public priority: number,
    public tags: string[],
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public acceptCount: number = 0,
    public rejectCount: number = 0,
    public maybeCount: number = 0,
    public totalFeedback: number = 0
  ) {}

  // 受容率を計算
  get acceptanceRate(): number {
    return this.totalFeedback > 0 ? this.acceptCount / this.totalFeedback : 0;
  }

  // 拒否率を計算
  get rejectionRate(): number {
    return this.totalFeedback > 0 ? this.rejectCount / this.totalFeedback : 0;
  }

  // どちらでもいい率を計算
  get maybeRate(): number {
    return this.totalFeedback > 0 ? this.maybeCount / this.totalFeedback : 0;
  }

  // フィードバックを追加
  addFeedback(feedbackType: "accept" | "maybe" | "reject"): void {
    this.totalFeedback++;
    switch (feedbackType) {
      case "accept":
        this.acceptCount++;
        break;
      case "maybe":
        this.maybeCount++;
        break;
      case "reject":
        this.rejectCount++;
        break;
    }
    this.updatedAt = new Date();
  }

  // 提案が有効かチェック
  isValid(): boolean {
    return (
      this.isActive && this.title.length > 0 && this.description.length > 0
    );
  }

  // 時間帯に合致するかチェック
  matchesTimeOfDay(timeOfDay: TimeOfDay): boolean {
    return this.timeOfDay === timeOfDay;
  }

  // カテゴリに合致するかチェック
  matchesCategory(category: string): boolean {
    return this.category === category;
  }

  // タグに合致するかチェック
  hasTag(tag: string): boolean {
    return this.tags.includes(tag);
  }
}
