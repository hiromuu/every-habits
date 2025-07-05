import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/infrastructure/firebase/config";
import { ISuggestionRepository } from "@/domain/repositories/ISuggestionRepository";
import { Suggestion } from "@/domain/entities/Suggestion";
import { TimeOfDay } from "@/domain/valueObjects/TimeOfDay";
import { ApiResponse } from "@/shared/types";

export class FirebaseSuggestionRepository implements ISuggestionRepository {
  private readonly collectionName = "suggestions";

  async getSuggestion(suggestionId: string): Promise<ApiResponse<Suggestion>> {
    try {
      const docRef = doc(db, this.collectionName, suggestionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const suggestion = new Suggestion(
          data.suggestionId,
          data.title,
          data.description,
          data.category,
          data.timeOfDay,
          data.priority,
          data.tags || [],
          data.isActive,
          data.createdAt.toDate(),
          data.updatedAt.toDate(),
          data.acceptCount || 0,
          data.rejectCount || 0,
          data.maybeCount || 0,
          data.totalFeedback || 0
        );
        return { success: true, data: suggestion };
      } else {
        return { success: false, error: "Suggestion not found" };
      }
    } catch (error) {
      return { success: false, error: `Failed to get suggestion: ${error}` };
    }
  }

  async getSuggestionsByTimeOfDay(
    timeOfDay: TimeOfDay
  ): Promise<ApiResponse<Suggestion[]>> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where("timeOfDay", "==", timeOfDay.getValue()),
        where("isActive", "==", true),
        orderBy("priority", "desc")
      );

      const querySnapshot = await getDocs(q);
      const suggestions: Suggestion[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        suggestions.push(
          new Suggestion(
            data.suggestionId,
            data.title,
            data.description,
            data.category,
            data.timeOfDay,
            data.priority,
            data.tags || [],
            data.isActive,
            data.createdAt.toDate(),
            data.updatedAt.toDate(),
            data.acceptCount || 0,
            data.rejectCount || 0,
            data.maybeCount || 0,
            data.totalFeedback || 0
          )
        );
      });

      return { success: true, data: suggestions };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get suggestions by time of day: ${error}`,
      };
    }
  }

  async getSuggestionsByCategory(
    category: string
  ): Promise<ApiResponse<Suggestion[]>> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where("category", "==", category),
        where("isActive", "==", true),
        orderBy("priority", "desc")
      );

      const querySnapshot = await getDocs(q);
      const suggestions: Suggestion[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        suggestions.push(
          new Suggestion(
            data.suggestionId,
            data.title,
            data.description,
            data.category,
            data.timeOfDay,
            data.priority,
            data.tags || [],
            data.isActive,
            data.createdAt.toDate(),
            data.updatedAt.toDate(),
            data.acceptCount || 0,
            data.rejectCount || 0,
            data.maybeCount || 0,
            data.totalFeedback || 0
          )
        );
      });

      return { success: true, data: suggestions };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get suggestions by category: ${error}`,
      };
    }
  }

  async getActiveSuggestions(): Promise<ApiResponse<Suggestion[]>> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where("isActive", "==", true),
        orderBy("priority", "desc")
      );

      const querySnapshot = await getDocs(q);
      const suggestions: Suggestion[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        suggestions.push(
          new Suggestion(
            data.suggestionId,
            data.title,
            data.description,
            data.category,
            data.timeOfDay,
            data.priority,
            data.tags || [],
            data.isActive,
            data.createdAt.toDate(),
            data.updatedAt.toDate(),
            data.acceptCount || 0,
            data.rejectCount || 0,
            data.maybeCount || 0,
            data.totalFeedback || 0
          )
        );
      });

      return { success: true, data: suggestions };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get active suggestions: ${error}`,
      };
    }
  }

  async createSuggestion(
    suggestion: Suggestion
  ): Promise<ApiResponse<Suggestion>> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        suggestionId: suggestion.suggestionId,
        title: suggestion.title,
        description: suggestion.description,
        category: suggestion.category,
        timeOfDay: suggestion.timeOfDay,
        priority: suggestion.priority,
        tags: suggestion.tags,
        isActive: suggestion.isActive,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        acceptCount: suggestion.acceptCount,
        rejectCount: suggestion.rejectCount,
        maybeCount: suggestion.maybeCount,
        totalFeedback: suggestion.totalFeedback,
      });

      return { success: true, data: suggestion };
    } catch (error) {
      return { success: false, error: `Failed to create suggestion: ${error}` };
    }
  }

  async updateSuggestion(
    suggestion: Suggestion
  ): Promise<ApiResponse<Suggestion>> {
    try {
      const docRef = doc(db, this.collectionName, suggestion.suggestionId);
      await updateDoc(docRef, {
        title: suggestion.title,
        description: suggestion.description,
        category: suggestion.category,
        timeOfDay: suggestion.timeOfDay,
        priority: suggestion.priority,
        tags: suggestion.tags,
        isActive: suggestion.isActive,
        updatedAt: serverTimestamp(),
        acceptCount: suggestion.acceptCount,
        rejectCount: suggestion.rejectCount,
        maybeCount: suggestion.maybeCount,
        totalFeedback: suggestion.totalFeedback,
      });

      return { success: true, data: suggestion };
    } catch (error) {
      return { success: false, error: `Failed to update suggestion: ${error}` };
    }
  }

  async deleteSuggestion(suggestionId: string): Promise<ApiResponse<boolean>> {
    try {
      const docRef = doc(db, this.collectionName, suggestionId);
      await deleteDoc(docRef);
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: `Failed to delete suggestion: ${error}` };
    }
  }

  async updateSuggestionStatistics(
    suggestionId: string,
    feedbackType: "accept" | "maybe" | "reject"
  ): Promise<ApiResponse<boolean>> {
    try {
      const docRef = doc(db, this.collectionName, suggestionId);
      const updateData: any = {
        totalFeedback: increment(1),
        updatedAt: serverTimestamp(),
      };

      switch (feedbackType) {
        case "accept":
          updateData.acceptCount = increment(1);
          break;
        case "maybe":
          updateData.maybeCount = increment(1);
          break;
        case "reject":
          updateData.rejectCount = increment(1);
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
  }

  async getHighAcceptanceSuggestions(
    limitCount: number = 10
  ): Promise<ApiResponse<Suggestion[]>> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where("isActive", "==", true),
        where("totalFeedback", ">", 0),
        orderBy("totalFeedback", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const suggestions: Suggestion[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        suggestions.push(
          new Suggestion(
            data.suggestionId,
            data.title,
            data.description,
            data.category,
            data.timeOfDay,
            data.priority,
            data.tags || [],
            data.isActive,
            data.createdAt.toDate(),
            data.updatedAt.toDate(),
            data.acceptCount || 0,
            data.rejectCount || 0,
            data.maybeCount || 0,
            data.totalFeedback || 0
          )
        );
      });

      return { success: true, data: suggestions };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get high acceptance suggestions: ${error}`,
      };
    }
  }

  async getRandomSuggestion(
    timeOfDay?: TimeOfDay
  ): Promise<ApiResponse<Suggestion>> {
    try {
      let q = query(
        collection(db, this.collectionName),
        where("isActive", "==", true)
      );

      if (timeOfDay) {
        q = query(q, where("timeOfDay", "==", timeOfDay.getValue()));
      }

      const querySnapshot = await getDocs(q);
      const suggestions: Suggestion[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        suggestions.push(
          new Suggestion(
            data.suggestionId,
            data.title,
            data.description,
            data.category,
            data.timeOfDay,
            data.priority,
            data.tags || [],
            data.isActive,
            data.createdAt.toDate(),
            data.updatedAt.toDate(),
            data.acceptCount || 0,
            data.rejectCount || 0,
            data.maybeCount || 0,
            data.totalFeedback || 0
          )
        );
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
  }
}
