import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import type { AuditLog, CreateAuditLogInput } from "@/types/notification";

// Map Prisma audit log record to domain model
const mapAuditLogRecord = (record: {
  id: number;
  workspaceId: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  details: Prisma.JsonValue;
  ipAddress: string | null;
  createdAt: Date;
}): AuditLog => {
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    userId: record.userId,
    action: record.action,
    entityType: record.entityType,
    entityId: record.entityId,
    details: (record.details as Record<string, unknown>) ?? {},
    ipAddress: record.ipAddress,
    createdAt: record.createdAt,
  };
};

// Record immutable audit log entry
export const recordAuditLog = async (
  input: CreateAuditLogInput,
): Promise<AuditLog> => {
  const record = await prisma.auditLog.create({
    data: {
      workspaceId: input.workspaceId,
      userId: input.userId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      details: (input.details as Prisma.InputJsonValue) ?? {},
      ipAddress: input.ipAddress ?? null,
    },
  });

  return mapAuditLogRecord(record);
};

// Query audit log history within workspace boundary
export const getAuditLogsByWorkspace = async (
  workspaceId: string,
  filter?: { entityType?: string; entityId?: string },
): Promise<AuditLog[]> => {
  const records = await prisma.auditLog.findMany({
    where: {
      workspaceId,
      ...(filter?.entityType ? { entityType: filter.entityType } : {}),
      ...(filter?.entityId ? { entityId: filter.entityId } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return records.map(mapAuditLogRecord);
};
