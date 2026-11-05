export type AppConfig = {
  appName: string;
  version: string;
  environment: "development" | "production" | "test";
};

export const defaultConfig: AppConfig = {
  appName: "auto-flow-mock-proj-1",
  version: "1.0.0",
  environment: "development",
};

export const initializeApp = (config: AppConfig = defaultConfig): string => {
  return `Application ${config.appName} initialized successfully in ${config.environment} mode.`;
};
