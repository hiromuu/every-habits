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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/infrastructure/firebase/config";
import { UserIdealHabits } from "@/domain/entities/UserIdealHabits";
import { ApiResponse } from "@/shared/types";

const COLLECTION_NAME = "user_ideal_habits";

// FirestoreからUserIdealHabitsオブジェクトを作成するヘルパー関数
const createUserIdealHabitsFromFirestore = (
  doc: any,
  data: any
): UserIdealHabits => {
  return new UserIdealHabits(
    doc.id,
    data.userId,
    data.morningHabits || [],
    data.eveningHabits || [],
    data.createdAt?.toDate() || new Date(),
    data.updatedAt?.toDate() || new Date(),
    data.version || 1
  );
};

// ユーザーの理想習慣を取得する関数
export const getUserIdealHabits = async (
  userId: string
): Promise<ApiResponse<UserIdealHabits>> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      const habits = createUserIdealHabitsFromFirestore(doc, data);

      return { success: true, data: habits };
    } else {
      return { success: false, error: "User ideal habits not found" };
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to get user ideal habits: ${error}`,
    };
  }
};

// ユーザーの理想習慣を作成する関数
export const createUserIdealHabits = async (
  habits: UserIdealHabits
): Promise<ApiResponse<UserIdealHabits>> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      habitId: habits.habitId,
      userId: habits.userId,
      morningHabits: habits.morningHabits,
      eveningHabits: habits.eveningHabits,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      version: habits.version,
    });

    // 作成されたドキュメントのIDを取得
    const createdHabits = new UserIdealHabits(
      docRef.id,
      habits.userId,
      habits.morningHabits,
      habits.eveningHabits,
      new Date(),
      new Date(),
      habits.version
    );

    return { success: true, data: createdHabits };
  } catch (error) {
    return {
      success: false,
      error: `Failed to create user ideal habits: ${error}`,
    };
  }
};

// ユーザーの理想習慣を更新する関数
export const updateUserIdealHabits = async (
  habits: UserIdealHabits
): Promise<ApiResponse<UserIdealHabits>> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, habits.habitId);
    await updateDoc(docRef, {
      morningHabits: habits.morningHabits,
      eveningHabits: habits.eveningHabits,
      updatedAt: serverTimestamp(),
      version: habits.version,
    });

    return { success: true, data: habits };
  } catch (error) {
    return {
      success: false,
      error: `Failed to update user ideal habits: ${error}`,
    };
  }
};

// ユーザーの理想習慣を削除する関数
export const deleteUserIdealHabits = async (
  userId: string
): Promise<ApiResponse<boolean>> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      await deleteDoc(doc.ref);
      return { success: true, data: true };
    } else {
      return { success: false, error: "User ideal habits not found" };
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to delete user ideal habits: ${error}`,
    };
  }
};

// 朝の習慣を更新する関数
export const updateMorningHabits = async (
  userId: string,
  habits: string[]
): Promise<ApiResponse<UserIdealHabits>> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const currentData = querySnapshot.docs[0].data();

      await updateDoc(docRef, {
        morningHabits: habits,
        updatedAt: serverTimestamp(),
        version: (currentData.version || 1) + 1,
      });

      const updatedHabits = new UserIdealHabits(
        docRef.id,
        userId,
        habits,
        currentData.eveningHabits || [],
        currentData.createdAt?.toDate() || new Date(),
        new Date(),
        (currentData.version || 1) + 1
      );

      return { success: true, data: updatedHabits };
    } else {
      return { success: false, error: "User ideal habits not found" };
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to update morning habits: ${error}`,
    };
  }
};

// 夜の習慣を更新する関数
export const updateEveningHabits = async (
  userId: string,
  habits: string[]
): Promise<ApiResponse<UserIdealHabits>> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const currentData = querySnapshot.docs[0].data();

      await updateDoc(docRef, {
        eveningHabits: habits,
        updatedAt: serverTimestamp(),
        version: (currentData.version || 1) + 1,
      });

      const updatedHabits = new UserIdealHabits(
        docRef.id,
        userId,
        currentData.morningHabits || [],
        habits,
        currentData.createdAt?.toDate() || new Date(),
        new Date(),
        (currentData.version || 1) + 1
      );

      return { success: true, data: updatedHabits };
    } else {
      return { success: false, error: "User ideal habits not found" };
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to update evening habits: ${error}`,
    };
  }
};

// 習慣を追加する関数
export const addHabit = async (
  userId: string,
  habit: string,
  timeOfDay: "morning" | "evening"
): Promise<ApiResponse<UserIdealHabits>> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const currentData = querySnapshot.docs[0].data();

      const currentHabits =
        timeOfDay === "morning"
          ? currentData.morningHabits || []
          : currentData.eveningHabits || [];

      if (!currentHabits.includes(habit)) {
        const updatedHabits = [...currentHabits, habit];

        await updateDoc(docRef, {
          [timeOfDay === "morning" ? "morningHabits" : "eveningHabits"]:
            updatedHabits,
          updatedAt: serverTimestamp(),
          version: (currentData.version || 1) + 1,
        });

        const result = new UserIdealHabits(
          docRef.id,
          userId,
          timeOfDay === "morning"
            ? updatedHabits
            : currentData.morningHabits || [],
          timeOfDay === "evening"
            ? updatedHabits
            : currentData.eveningHabits || [],
          currentData.createdAt?.toDate() || new Date(),
          new Date(),
          (currentData.version || 1) + 1
        );

        return { success: true, data: result };
      } else {
        return { success: false, error: "Habit already exists" };
      }
    } else {
      return { success: false, error: "User ideal habits not found" };
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to add habit: ${error}`,
    };
  }
};

// 習慣を削除する関数
export const removeHabit = async (
  userId: string,
  habit: string,
  timeOfDay: "morning" | "evening"
): Promise<ApiResponse<UserIdealHabits>> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const currentData = querySnapshot.docs[0].data();

      const currentHabits =
        timeOfDay === "morning"
          ? currentData.morningHabits || []
          : currentData.eveningHabits || [];

      const updatedHabits = currentHabits.filter((h: string) => h !== habit);

      await updateDoc(docRef, {
        [timeOfDay === "morning" ? "morningHabits" : "eveningHabits"]:
          updatedHabits,
        updatedAt: serverTimestamp(),
        version: (currentData.version || 1) + 1,
      });

      const result = new UserIdealHabits(
        docRef.id,
        userId,
        timeOfDay === "morning"
          ? updatedHabits
          : currentData.morningHabits || [],
        timeOfDay === "evening"
          ? updatedHabits
          : currentData.eveningHabits || [],
        currentData.createdAt?.toDate() || new Date(),
        new Date(),
        (currentData.version || 1) + 1
      );

      return { success: true, data: result };
    } else {
      return { success: false, error: "User ideal habits not found" };
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to remove habit: ${error}`,
    };
  }
};

// 習慣が存在するかチェックする関数
export const habitExists = async (
  userId: string,
  habit: string,
  timeOfDay: "morning" | "evening"
): Promise<ApiResponse<boolean>> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      const habits =
        timeOfDay === "morning"
          ? data.morningHabits || []
          : data.eveningHabits || [];

      const exists = habits.includes(habit);
      return { success: true, data: exists };
    } else {
      return { success: false, error: "User ideal habits not found" };
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to check habit existence: ${error}`,
    };
  }
};
