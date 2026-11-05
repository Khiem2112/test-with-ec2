import type { ApiResponse } from "../types/index.js";

export const createSuccessResponse = <T>(data: T): ApiResponse<T> => {
  return {
    success: true,
    data,
  };
};

export const createErrorResponse = (
  code: string,
  message: string,
): ApiResponse<never> => {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
};

// Evaluate fallback string using nullish coalescing to preserve empty string values
export const resolveDefaultString = (
  input: string | null | undefined,
  fallback: string,
): string => {
  return input ?? fallback;
};

// Validate that incoming payload adheres to an object shape before reading dynamic keys
export const isRecordObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

// Immutably append item to array using spread syntax
export const appendItem = <T>(list: readonly T[], item: T): readonly T[] => {
  return [...list, item];
};
