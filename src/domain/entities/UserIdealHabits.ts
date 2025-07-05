import { UserIdealHabits as UserIdealHabitsType } from "@/shared/types";

export class UserIdealHabits implements UserIdealHabitsType {
  constructor(
    public habitId: string,
    public userId: string,
    public morningHabits: string[],
    public eveningHabits: string[],
    public createdAt: Date,
    public updatedAt: Date,
    public version: number = 1
  ) {}

  // 朝の習慣を追加
  addMorningHabit(habit: string): void {
    if (!this.morningHabits.includes(habit)) {
      this.morningHabits.push(habit);
      this.updatedAt = new Date();
      this.version++;
    }
  }

  // 夜の習慣を追加
  addEveningHabit(habit: string): void {
    if (!this.eveningHabits.includes(habit)) {
      this.eveningHabits.push(habit);
      this.updatedAt = new Date();
      this.version++;
    }
  }

  // 朝の習慣を削除
  removeMorningHabit(habit: string): void {
    const index = this.morningHabits.indexOf(habit);
    if (index > -1) {
      this.morningHabits.splice(index, 1);
      this.updatedAt = new Date();
      this.version++;
    }
  }

  // 夜の習慣を削除
  removeEveningHabit(habit: string): void {
    const index = this.eveningHabits.indexOf(habit);
    if (index > -1) {
      this.eveningHabits.splice(index, 1);
      this.updatedAt = new Date();
      this.version++;
    }
  }

  // 朝の習慣を更新
  updateMorningHabits(habits: string[]): void {
    this.morningHabits = habits;
    this.updatedAt = new Date();
    this.version++;
  }

  // 夜の習慣を更新
  updateEveningHabits(habits: string[]): void {
    this.eveningHabits = habits;
    this.updatedAt = new Date();
    this.version++;
  }

  // 習慣が空かチェック
  isEmpty(): boolean {
    return this.morningHabits.length === 0 && this.eveningHabits.length === 0;
  }

  // 朝の習慣数
  get morningHabitsCount(): number {
    return this.morningHabits.length;
  }

  // 夜の習慣数
  get eveningHabitsCount(): number {
    return this.eveningHabits.length;
  }

  // 総習慣数
  get totalHabitsCount(): number {
    return this.morningHabitsCount + this.eveningHabitsCount;
  }

  // 習慣が有効かチェック
  isValid(): boolean {
    return this.userId.length > 0 && this.habitId.length > 0;
  }
}
