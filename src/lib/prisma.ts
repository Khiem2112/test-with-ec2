import { PrismaClient, Prisma } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Execute database operation within an existing transaction client or root client
export const runWithTx = async <T>(
  client: Prisma.TransactionClient | PrismaClient,
  operation: (txClient: Prisma.TransactionClient | PrismaClient) => Promise<T>,
): Promise<T> => {
  if ("$transaction" in client && typeof client.$transaction === "function") {
    return await (client as PrismaClient).$transaction(operation);
  }
  return await operation(client);
};
