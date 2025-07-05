import { Suggestion as SuggestionType, TimeOfDay } from "@/shared/types";

export class Suggestion implements SuggestionType {
  constructor(
    public readonly suggestionId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly category: string,
    public readonly timeOfDay: "morning" | "evening",
    public readonly priority: number,
    public readonly tags: string[],
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly acceptCount: number = 0,
    public readonly maybeCount: number = 0,
    public readonly rejectCount: number = 0
  ) {}

  get acceptanceRate(): number {
    const total = this.acceptCount + this.maybeCount + this.rejectCount;
    if (total === 0) return 0;
    return (this.acceptCount + this.maybeCount * 0.5) / total;
  }

  get totalFeedback(): number {
    return this.acceptCount + this.maybeCount + this.rejectCount;
  }

  static create(
    title: string,
    description: string,
    category: string,
    timeOfDay: "morning" | "evening",
    priority: number,
    tags: string[]
  ): Suggestion {
    return new Suggestion(
      "", // IDは自動生成
      title,
      description,
      category,
      timeOfDay,
      priority,
      tags,
      true,
      new Date(),
      new Date()
    );
  }

  updateFeedback(feedbackType: "accept" | "maybe" | "reject"): Suggestion {
    const newAcceptCount =
      feedbackType === "accept" ? this.acceptCount + 1 : this.acceptCount;
    const newMaybeCount =
      feedbackType === "maybe" ? this.maybeCount + 1 : this.maybeCount;
    const newRejectCount =
      feedbackType === "reject" ? this.rejectCount + 1 : this.rejectCount;

    return new Suggestion(
      this.suggestionId,
      this.title,
      this.description,
      this.category,
      this.timeOfDay,
      this.priority,
      this.tags,
      this.isActive,
      this.createdAt,
      new Date(),
      newAcceptCount,
      newMaybeCount,
      newRejectCount
    );
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
