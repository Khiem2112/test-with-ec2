export type AppEnvironment = "development" | "production" | "test";

export type ServiceConfig = {
  environment: AppEnvironment;
  databaseUrl: string;
  isProduction: boolean;
};

// Resolve application environment safely with fallback to development
export const resolveEnvironment = (): AppEnvironment => {
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === "production" || nodeEnv === "test") {
    return nodeEnv;
  }
  return "development";
};

// Retrieve loaded service configuration
export const getServiceConfig = (): ServiceConfig => {
  const environment = resolveEnvironment();
  const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";

  return {
    environment,
    databaseUrl,
    isProduction: environment === "production",
  };
};
