import { prisma } from "@/lib/prisma";
import type {
  ReleaseVersion,
  ReleaseItem,
  CreateReleaseVersionInput,
  AttachCompletedPostsInput,
} from "@/types/roadmap";

// Map Prisma release record to strict domain model
const mapReleaseRecord = (record: {
  id: string;
  workspaceId: string;
  versionName: string;
  targetDate: Date | null;
  releasedAt: Date | null;
  isPublished: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  items?: Array<{
    id: number;
    releaseVersionId: string;
    postId: string;
    completedNote: string | null;
    createdAt: Date;
    post?: { id: string; title: string };
  }>;
  changelog?: {
    id: string;
    workspaceId: string;
    releaseVersionId: string | null;
    title: string;
    slug: string;
    summary: string;
    bodyMarkdown: string;
    isPublished: boolean;
    publishedAt: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}): ReleaseVersion => {
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    versionName: record.versionName,
    targetDate: record.targetDate,
    releasedAt: record.releasedAt,
    isPublished: record.isPublished,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    items: record.items?.map((item) => ({
      id: item.id,
      releaseVersionId: item.releaseVersionId,
      postId: item.postId,
      completedNote: item.completedNote,
      createdAt: item.createdAt,
      postTitle: item.post?.title,
    })),
    changelog: record.changelog ?? null,
  };
};

// Create a new release version enforcing unique versionName within workspace
export const createReleaseVersion = async (
  input: CreateReleaseVersionInput,
): Promise<ReleaseVersion> => {
  const existing = await prisma.releaseVersion.findUnique({
    where: {
      workspaceId_versionName: {
        workspaceId: input.workspaceId,
        versionName: input.versionName,
      },
    },
  });

  if (existing) {
    throw new Error("VERSION_ALREADY_EXISTS: Ten phien ban da ton tai trong khong gian lam viec");
  }

  const created = await prisma.releaseVersion.create({
    data: {
      workspaceId: input.workspaceId,
      versionName: input.versionName,
      targetDate: input.targetDate ?? null,
    },
  });

  return mapReleaseRecord(created);
};

// Attach completed feedback posts to a release version via release_items
export const attachCompletedPosts = async (
  input: AttachCompletedPostsInput,
): Promise<ReleaseItem[]> => {
  const release = await prisma.releaseVersion.findUnique({
    where: { id: input.releaseVersionId },
  });

  if (!release) {
    throw new Error("RELEASE_NOT_FOUND: Phien ban phat hanh khong ton tai");
  }

  const createdItems: ReleaseItem[] = [];

  for (const postId of input.postIds) {
    const item = await prisma.releaseItem.upsert({
      where: {
        releaseVersionId_postId: {
          releaseVersionId: input.releaseVersionId,
          postId,
        },
      },
      update: {
        completedNote: input.completedNote ?? null,
      },
      create: {
        releaseVersionId: input.releaseVersionId,
        postId,
        completedNote: input.completedNote ?? null,
      },
      include: {
        post: {
          select: { id: true, title: true },
        },
      },
    });

    createdItems.push({
      id: item.id,
      releaseVersionId: item.releaseVersionId,
      postId: item.postId,
      completedNote: item.completedNote,
      createdAt: item.createdAt,
      postTitle: item.post.title,
    });
  }

  return createdItems;
};

// Retrieve all release versions for a workspace
export const getReleasesByWorkspace = async (
  workspaceId: string,
): Promise<ReleaseVersion[]> => {
  const releases = await prisma.releaseVersion.findMany({
    where: {
      workspaceId,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          post: { select: { id: true, title: true } },
        },
      },
      changelog: true,
    },
  });

  return releases.map(mapReleaseRecord);
};

// Retrieve single release version by ID
export const getReleaseById = async (
  id: string,
): Promise<ReleaseVersion | null> => {
  const release = await prisma.releaseVersion.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          post: { select: { id: true, title: true } },
        },
      },
      changelog: true,
    },
  });

  if (!release) {
    return null;
  }

  return mapReleaseRecord(release);
};
