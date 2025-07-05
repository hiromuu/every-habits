import { firebaseConfig as devConfig } from "./development";
import { firebaseConfig as demoConfig } from "./demo";
import { firebaseConfig as prodConfig } from "./production";

export type Environment = "development" | "demo" | "production";

/**
 * 現在の環境を取得
 */
export const getCurrentEnvironment = (): Environment => {
  const env = process.env.EXPO_PUBLIC_ENVIRONMENT || "development";

  switch (env) {
    case "demo":
      return "demo";
    case "production":
      return "production";
    default:
      return "development";
  }
};

/**
 * 環境に応じたFirebase設定を取得
 */
export const getFirebaseConfig = (environment?: Environment) => {
  const currentEnv = environment || getCurrentEnvironment();

  switch (currentEnv) {
    case "demo":
      return demoConfig;
    case "production":
      return prodConfig;
    default:
      return devConfig;
  }
};

/**
 * 環境情報を取得
 */
export const getEnvironmentInfo = () => {
  const env = getCurrentEnvironment();
  return {
    environment: env,
    isDevelopment: env === "development",
    isDemo: env === "demo",
    isProduction: env === "production",
  };
};
