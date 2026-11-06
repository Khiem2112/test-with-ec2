export type UserRole = "admin" | "operator" | "viewer";

export type BaseEntity = {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isActive: boolean;
};

export type User = BaseEntity & {
  email: string;
  name: string;
  role: UserRole;
};

export type Project = BaseEntity & {
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
};

export type TaskStatus = "pending" | "in_progress" | "completed" | "failed";

export type Task = BaseEntity & {
  projectId: string;
  title: string;
  status: TaskStatus;
  targetFiles: readonly string[];
  checklist: readonly string[];
};

export type UserSummaryDTO = Pick<User, "id" | "name" | "email" | "role">;

export type CreateTaskInput = {
  projectId: string;
  title: string;
  targetFiles?: readonly string[];
  checklist?: readonly string[];
};

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

export * from "./workspace";
export * from "./post";
export * from "./discussion";
export * from "./lifecycle";
export * from "./roadmap";
export * from "./notification";
