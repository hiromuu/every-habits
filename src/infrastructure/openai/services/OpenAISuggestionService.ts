import OpenAI from "openai";
import { z } from "zod";
import { ApiResponse } from "@/shared/types";
import { UserIdealHabits } from "@/domain/entities/UserIdealHabits";

// Zodスキーマで型安全性を確保
const GeneratedSuggestionSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().min(10, "説明は10文字以上で入力してください"),
  category: z.string().min(1, "カテゴリは必須です"),
  priority: z.number().min(1).max(10, "優先度は1-10の範囲で入力してください"),
  tags: z.array(z.string()).min(1, "少なくとも1つのタグが必要です"),
});

export interface GeneratedSuggestion {
  title: string;
  description: string;
  category: string;
  timeOfDay: "morning" | "evening";
  priority: number;
  tags: string[];
}

// OpenAIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // 注意: 本番環境ではサーバーサイドで実行すべき
});

// プロンプトを構築する関数
const buildPrompt = (
  habits: string[],
  timeOfDay: "morning" | "evening",
  context?: string
): string => {
  const timeLabel = timeOfDay === "morning" ? "朝" : "夜";
  const habitsText =
    habits.length > 0 ? habits.join("、") : "特に設定されていない";

  return `
ユーザーの理想的な${timeLabel}の習慣: ${habitsText}

${context ? `現在の状況: ${context}` : ""}

以下の形式で${timeLabel}の時間に実践できる健康的な活動を1つ提案してください。
必ず以下のJSON形式で回答し、他のテキストは含めないでください:

{
  "title": "提案のタイトル（30文字以内）",
  "description": "具体的な説明（100文字程度）",
  "category": "カテゴリ（健康、学習、趣味、仕事、生活のいずれか）",
  "priority": 1-10の優先度（数値のみ）,
  "tags": ["タグ1", "タグ2", "タグ3"]
}`;
};

// レスポンスをパースする関数
const parseSuggestionResponse = (
  content: string,
  timeOfDay: "morning" | "evening"
): GeneratedSuggestion => {
  try {
    // JSONを抽出（```json で囲まれている場合がある）
    const jsonMatch =
      content.match(/```json\s*([\s\S]*?)\s*```/) ||
      content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;

    const parsed = JSON.parse(jsonString);

    // Zodでバリデーション
    const validationResult = GeneratedSuggestionSchema.safeParse(parsed);

    if (!validationResult.success) {
      console.error("Validation errors:", validationResult.error.errors);
      throw new Error(
        `Validation failed: ${validationResult.error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    const validatedData = validationResult.data;

    return {
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      timeOfDay,
      priority: validatedData.priority,
      tags: validatedData.tags,
    };
  } catch (error) {
    console.error("Failed to parse suggestion response:", error);

    // フォールバック用のデフォルト提案
    return {
      title: "新しい習慣を始めよう",
      description: "健康的な活動を提案します。今日から始めてみませんか？",
      category: "健康",
      timeOfDay,
      priority: 5,
      tags: ["習慣", "健康"],
    };
  }
};

// メインの提案生成関数
export const generateSuggestion = async (
  userHabits: UserIdealHabits,
  timeOfDay: "morning" | "evening",
  context?: string
): Promise<ApiResponse<GeneratedSuggestion>> => {
  try {
    const habits =
      timeOfDay === "morning"
        ? userHabits.morningHabits
        : userHabits.eveningHabits;

    const prompt = buildPrompt(habits, timeOfDay, context);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "あなたは健康的な生活習慣を提案するアシスタントです。ユーザーの理想習慣を参考に、実践的で魅力的な提案を提供してください。必ず指定されたJSON形式で回答してください。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { success: false, error: "No response from OpenAI" };
    }

    const suggestion = parseSuggestionResponse(content, timeOfDay);
    return { success: true, data: suggestion };
  } catch (error) {
    return {
      success: false,
      error: `Failed to generate suggestion: ${error}`,
    };
  }
};

// 複数の提案を生成する関数
export const generateMultipleSuggestions = async (
  userHabits: UserIdealHabits,
  timeOfDay: "morning" | "evening",
  count: number = 3
): Promise<ApiResponse<GeneratedSuggestion[]>> => {
  try {
    const suggestions: GeneratedSuggestion[] = [];

    for (let i = 0; i < count; i++) {
      const result = await generateSuggestion(userHabits, timeOfDay);
      if (result.success && result.data) {
        suggestions.push(result.data);
      }
    }

    return { success: true, data: suggestions };
  } catch (error) {
    return {
      success: false,
      error: `Failed to generate multiple suggestions: ${error}`,
    };
  }
};

// パーソナライズされた提案を生成する関数
export const generatePersonalizedSuggestion = async (
  userHabits: UserIdealHabits,
  timeOfDay: "morning" | "evening",
  userPreferences?: string[]
): Promise<ApiResponse<GeneratedSuggestion>> => {
  try {
    const context =
      userPreferences && userPreferences.length > 0
        ? `ユーザーの好み: ${userPreferences.join("、")}`
        : undefined;

    return await generateSuggestion(userHabits, timeOfDay, context);
  } catch (error) {
    return {
      success: false,
      error: `Failed to generate personalized suggestion: ${error}`,
    };
  }
};
