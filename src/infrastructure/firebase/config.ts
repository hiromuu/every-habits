import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirebaseConfig, getEnvironmentInfo } from "./configs";

/**
 * Firebase設定を環境に応じて取得
 */
const firebaseConfig = getFirebaseConfig();

/**
 * 環境情報を取得
 */
const envInfo = getEnvironmentInfo();

// 開発環境の場合はコンソールに環境情報を出力
if (envInfo.isDevelopment) {
  console.log("🔥 Firebase Environment:", envInfo.environment);
  console.log("📁 Project ID:", firebaseConfig.projectId);
}

/**
 * Firebaseアプリを初期化
 */
const app = initializeApp(firebaseConfig);

/**
 * Firestoreデータベースを取得
 */
export const db = getFirestore(app);

/**
 * Firebase認証を取得
 */
export const auth = getAuth(app);

/**
 * Firebaseストレージを取得
 */
export const storage = getStorage(app);

/**
 * Firebaseアプリインスタンスをエクスポート
 */
export default app;

/**
 * 環境情報をエクスポート
 */
export { envInfo };
