"use server";

import { z } from "zod";
import { createTaskRecord, getActiveTasksByProject } from "@/services/task.service";
import type { ApiResponse, Task } from "@/types";

const createTaskSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  title: z.string().min(3, "Title must have at least 3 characters"),
  targetFiles: z.array(z.string()).optional(),
  checklist: z.array(z.string()).optional(),
});

// Server action to create a new task with validation
export const createTaskAction = async (
  rawInput: unknown,
): Promise<ApiResponse<Task>> => {
  try {
    const validated = createTaskSchema.parse(rawInput);
    const result = await createTaskRecord(validated);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create task";
    return {
      success: false,
      error: {
        code: "TASK_CREATION_FAILED",
        message: errorMessage,
      },
    };
  }
};

// Server action to fetch active tasks
export const getTasksAction = async (
  projectId: string,
): Promise<ApiResponse<Task[]>> => {
  try {
    const tasks = await getActiveTasksByProject(projectId);
    return {
      success: true,
      data: tasks,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve tasks";
    return {
      success: false,
      error: {
        code: "TASK_RETRIEVAL_FAILED",
        message: errorMessage,
      },
    };
  }
};
