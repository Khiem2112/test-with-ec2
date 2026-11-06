import { prisma } from "@/lib/prisma";
import type { PostSubscription, CreateSubscriptionInput } from "@/types/notification";

// Map Prisma subscription record to domain model
const mapSubscriptionRecord = (record: {
  id: number;
  postId: string;
  voterProfileId: string;
  notifyEmail: boolean;
  notifyInApp: boolean;
  createdAt: Date;
}): PostSubscription => {
  return {
    id: record.id,
    postId: record.postId,
    voterProfileId: record.voterProfileId,
    notifyEmail: record.notifyEmail,
    notifyInApp: record.notifyInApp,
    createdAt: record.createdAt,
  };
};

// Register or upsert subscriber for a post with channel preference toggles
export const subscribeToPost = async (
  input: CreateSubscriptionInput,
): Promise<PostSubscription> => {
  const record = await prisma.postSubscription.upsert({
    where: {
      postId_voterProfileId: {
        postId: input.postId,
        voterProfileId: input.voterProfileId,
      },
    },
    update: {
      ...(input.notifyEmail !== undefined ? { notifyEmail: input.notifyEmail } : {}),
      ...(input.notifyInApp !== undefined ? { notifyInApp: input.notifyInApp } : {}),
    },
    create: {
      postId: input.postId,
      voterProfileId: input.voterProfileId,
      notifyEmail: input.notifyEmail ?? true,
      notifyInApp: input.notifyInApp ?? true,
    },
  });

  return mapSubscriptionRecord(record);
};

// Remove subscriber from following a post
export const unsubscribeFromPost = async (
  postId: string,
  voterProfileId: string,
): Promise<boolean> => {
  try {
    await prisma.postSubscription.delete({
      where: {
        postId_voterProfileId: {
          postId,
          voterProfileId,
        },
      },
    });
    return true;
  } catch {
    return false;
  }
};

// Check if a voter profile is actively subscribed to a post
export const isSubscribed = async (
  postId: string,
  voterProfileId: string,
): Promise<boolean> => {
  const existing = await prisma.postSubscription.findUnique({
    where: {
      postId_voterProfileId: {
        postId,
        voterProfileId,
      },
    },
  });

  return existing !== null;
};

// Retrieve all subscriptions for a specific post
export const getSubscriptionsByPost = async (
  postId: string,
): Promise<PostSubscription[]> => {
  const records = await prisma.postSubscription.findMany({
    where: { postId },
  });

  return records.map(mapSubscriptionRecord);
};

// Mutate subscriber delivery channel flags
export const updateSubscriptionChannels = async (
  postId: string,
  voterProfileId: string,
  notifyEmail?: boolean,
  notifyInApp?: boolean,
): Promise<PostSubscription> => {
  const record = await prisma.postSubscription.update({
    where: {
      postId_voterProfileId: {
        postId,
        voterProfileId,
      },
    },
    data: {
      ...(notifyEmail !== undefined ? { notifyEmail } : {}),
      ...(notifyInApp !== undefined ? { notifyInApp } : {}),
    },
  });

  return mapSubscriptionRecord(record);
};
