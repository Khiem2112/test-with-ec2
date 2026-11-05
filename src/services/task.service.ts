import { prisma, runWithTx } from "@/lib/prisma";
import type { Prisma, PrismaClient } from "@/generated/prisma";
import type { CreateTaskInput, Task } from "@/types";

// Retrieve active tasks for a specific project
export const getActiveTasksByProject = async (
  projectId: string,
  client: Prisma.TransactionClient | PrismaClient = prisma,
): Promise<Task[]> => {
  return await runWithTx(client, async (tx) => {
    const records = await tx.task.findMany({
      where: {
        projectId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return records.map((record) => ({
      id: record.id,
      projectId: record.projectId,
      title: record.title,
      status: record.status as Task["status"],
      targetFiles: JSON.parse(record.targetFiles) as string[],
      checklist: JSON.parse(record.checklist) as string[],
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      isActive: record.isActive,
    }));
  });
};

// Create a new task within database persistence
export const createTaskRecord = async (
  input: CreateTaskInput,
  client: Prisma.TransactionClient | PrismaClient = prisma,
): Promise<Task> => {
  return await runWithTx(client, async (tx) => {
    const created = await tx.task.create({
      data: {
        projectId: input.projectId,
        title: input.title,
        status: "pending",
        targetFiles: JSON.stringify(input.targetFiles ?? []),
        checklist: JSON.stringify(input.checklist ?? []),
        isActive: true,
      },
    });

    return {
      id: created.id,
      projectId: created.projectId,
      title: created.title,
      status: created.status as Task["status"],
      targetFiles: JSON.parse(created.targetFiles) as string[],
      checklist: JSON.parse(created.checklist) as string[],
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      isActive: created.isActive,
    };
  });
};
