import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/infrastructure/firebase/config";
import { Suggestion } from "@/domain/entities/Suggestion";
import { TimeOfDay } from "@/shared/types";
import { ApiResponse } from "@/shared/types";

const COLLECTION_NAME = "suggestions";

// FirestoreからSuggestionオブジェクトを作成するヘルパー関数
const createSuggestionFromFirestore = (doc: any, data: any): Suggestion => {
  return new Suggestion(
    doc.id,
    data.title,
    data.description,
    data.category,
    data.timeOfDay,
    data.priority,
    data.tags || [],
    data.isActive,
    data.createdAt?.toDate() || new Date(),
    data.updatedAt?.toDate() || new Date(),
    data.acceptCount || 0,
    data.maybeCount || 0,
    data.rejectCount || 0
  );
};

// 提案を作成する関数
export const createSuggestion = async (
  suggestion: Suggestion
): Promise<ApiResponse<Suggestion>> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      timeOfDay: suggestion.timeOfDay,
      priority: suggestion.priority,
      tags: suggestion.tags,
      isActive: suggestion.isActive,
      acceptCount: suggestion.acceptCount,
      maybeCount: suggestion.maybeCount,
      rejectCount: suggestion.rejectCount,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const createdSuggestion = new Suggestion(
      docRef.id,
      suggestion.title,
      suggestion.description,
      suggestion.category,
      suggestion.timeOfDay,
      suggestion.priority,
      suggestion.tags,
      suggestion.isActive,
      suggestion.createdAt,
      suggestion.updatedAt,
      suggestion.acceptCount,
      suggestion.maybeCount,
      suggestion.rejectCount
    );

    return { success: true, data: createdSuggestion };
  } catch (error) {
    return { success: false, error: `Failed to create suggestion: ${error}` };
  }
};

// 提案を取得する関数
export const getSuggestion = async (
  suggestionId: string
): Promise<ApiResponse<Suggestion>> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, suggestionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Suggestion not found" };
    }

    const data = docSnap.data();
    const suggestion = createSuggestionFromFirestore(docSnap, data);

    return { success: true, data: suggestion };
  } catch (error) {
    return { success: false, error: `Failed to get suggestion: ${error}` };
  }
};

// ランダムな提案を取得する関数
export const getRandomSuggestion = async (
  timeOfDay?: TimeOfDay
): Promise<ApiResponse<Suggestion>> => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where("isActive", "==", true)
    );

    if (timeOfDay) {
      q = query(q, where("timeOfDay", "==", timeOfDay));
    }

    const querySnapshot = await getDocs(q);
    const suggestions: Suggestion[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      suggestions.push(createSuggestionFromFirestore(doc, data));
    });

    if (suggestions.length === 0) {
      return { success: false, error: "No suggestions found" };
    }

    // ランダムに選択
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return { success: true, data: suggestions[randomIndex] };
  } catch (error) {
    return {
      success: false,
      error: `Failed to get random suggestion: ${error}`,
    };
  }
};

// 時間帯別の提案を取得する関数
export const getSuggestionsByTimeOfDay = async (
  timeOfDay: TimeOfDay
): Promise<ApiResponse<Suggestion[]>> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("timeOfDay", "==", timeOfDay),
      where("isActive", "==", true),
      orderBy("priority", "desc")
    );

    const querySnapshot = await getDocs(q);
    const suggestions: Suggestion[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      suggestions.push(createSuggestionFromFirestore(doc, data));
    });

    return { success: true, data: suggestions };
  } catch (error) {
    return {
      success: false,
      error: `Failed to get suggestions by time of day: ${error}`,
    };
  }
};

// 高受容率の提案を取得する関数
export const getHighAcceptanceSuggestions = async (
  limitCount: number
): Promise<ApiResponse<Suggestion[]>> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("isActive", "==", true),
      orderBy("acceptCount", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const suggestions: Suggestion[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      suggestions.push(createSuggestionFromFirestore(doc, data));
    });

    return { success: true, data: suggestions };
  } catch (error) {
    return {
      success: false,
      error: `Failed to get high acceptance suggestions: ${error}`,
    };
  }
};

// 統計情報を更新する関数
export const updateSuggestionStatistics = async (
  suggestionId: string,
  feedbackType: "accept" | "maybe" | "reject"
): Promise<ApiResponse<boolean>> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, suggestionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Suggestion not found" };
    }

    const data = docSnap.data();
    const updateData: any = {
      updatedAt: serverTimestamp(),
    };

    switch (feedbackType) {
      case "accept":
        updateData.acceptCount = (data.acceptCount || 0) + 1;
        break;
      case "maybe":
        updateData.maybeCount = (data.maybeCount || 0) + 1;
        break;
      case "reject":
        updateData.rejectCount = (data.rejectCount || 0) + 1;
        break;
    }

    await updateDoc(docRef, updateData);
    return { success: true, data: true };
  } catch (error) {
    return {
      success: false,
      error: `Failed to update suggestion statistics: ${error}`,
    };
  }
};

// 提案を削除する関数
export const deleteSuggestion = async (
  suggestionId: string
): Promise<ApiResponse<boolean>> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, suggestionId);
    await deleteDoc(docRef);
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: `Failed to delete suggestion: ${error}` };
  }
};

// カテゴリ別の提案を取得する関数
export const getSuggestionsByCategory = async (
  category: string
): Promise<ApiResponse<Suggestion[]>> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("category", "==", category),
      where("isActive", "==", true),
      orderBy("priority", "desc")
    );

    const querySnapshot = await getDocs(q);
    const suggestions: Suggestion[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      suggestions.push(createSuggestionFromFirestore(doc, data));
    });

    return { success: true, data: suggestions };
  } catch (error) {
    return {
      success: false,
      error: `Failed to get suggestions by category: ${error}`,
    };
  }
};

// アクティブな提案を取得する関数
export const getActiveSuggestions = async (): Promise<
  ApiResponse<Suggestion[]>
> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("isActive", "==", true),
      orderBy("priority", "desc")
    );

    const querySnapshot = await getDocs(q);
    const suggestions: Suggestion[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      suggestions.push(createSuggestionFromFirestore(doc, data));
    });

    return { success: true, data: suggestions };
  } catch (error) {
    return {
      success: false,
      error: `Failed to get active suggestions: ${error}`,
    };
  }
};

// 提案を更新する関数
export const updateSuggestion = async (
  suggestion: Suggestion
): Promise<ApiResponse<Suggestion>> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, suggestion.suggestionId);
    await updateDoc(docRef, {
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      timeOfDay: suggestion.timeOfDay,
      priority: suggestion.priority,
      tags: suggestion.tags,
      isActive: suggestion.isActive,
      acceptCount: suggestion.acceptCount,
      maybeCount: suggestion.maybeCount,
      rejectCount: suggestion.rejectCount,
      updatedAt: serverTimestamp(),
    });

    return { success: true, data: suggestion };
  } catch (error) {
    return { success: false, error: `Failed to update suggestion: ${error}` };
  }
};
