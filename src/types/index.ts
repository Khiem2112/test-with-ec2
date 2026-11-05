export type UserRole = "admin" | "operator" | "viewer";

export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export type User = BaseEntity & {
  username: string;
  email: string;
  role: UserRole;
};

export type Project = BaseEntity & {
  name: string;
  slug: string;
  description?: string;
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

export type UserSummaryDTO = Pick<User, "id" | "username" | "email" | "role">;

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
