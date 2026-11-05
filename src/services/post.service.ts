import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import type { Post, CreatePostInput } from "@/types/post";

// Format text into unique kebab-case slug for posts
const generatePostSlug = (title: string): string => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]+/gu, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${randomSuffix}`;
};

// Map Prisma post record to strict domain model
const mapPostRecord = (record: {
  id: string;
  boardId: string;
  categoryId: number | null;
  statusId: number;
  authorUserId: string | null;
  voterProfileId: string | null;
  title: string;
  slug: string;
  content: string;
  totalVotesCount: number;
  totalScoreWeight: Prisma.Decimal | number;
  commentsCount: number;
  isPinned: boolean;
  isLocked: boolean;
  mergedIntoPostId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags?: Array<{ tag: { id: number; name: string; slug: string; colorHex: string; isActive: boolean; createdAt: Date; updatedAt: Date } }>;
  attachments?: Array<{ id: string; postId: string; fileName: string; fileUrl: string; fileSize: number; mimeType: string; createdAt: Date }>;
}): Post => {
  return {
    id: record.id,
    boardId: record.boardId,
    categoryId: record.categoryId,
    statusId: record.statusId,
    authorUserId: record.authorUserId,
    voterProfileId: record.voterProfileId,
    title: record.title,
    slug: record.slug,
    content: record.content,
    totalVotesCount: record.totalVotesCount,
    totalScoreWeight: Number(record.totalScoreWeight),
    commentsCount: record.commentsCount,
    isPinned: record.isPinned,
    isLocked: record.isLocked,
    mergedIntoPostId: record.mergedIntoPostId,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    tags: record.tags?.map((pt) => pt.tag),
    attachments: record.attachments,
  };
};

// Resolve or initialize default initial status for a workspace
const resolveInitialStatusId = async (workspaceId: string): Promise<number> => {
  const existingStatus = await prisma.postStatus.findFirst({
    where: { workspaceId, isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  if (existingStatus) {
    return existingStatus.id;
  }

  const createdStatus = await prisma.postStatus.create({
    data: {
      workspaceId,
      name: "Under Review",
      key: "under_review",
      category: "BACKLOG",
      colorHex: "#3B82F6",
      showOnRoadmap: false,
      displayOrder: 0,
    },
  });

  return createdStatus.id;
};

// Create a feedback post with attachments, tags, moderation state, and auto-subscription
export const createPost = async (
  input: CreatePostInput,
): Promise<Post> => {
  const board = await prisma.board.findUnique({
    where: { id: input.boardId },
  });

  if (!board) {
    throw new Error("Bang phan hoi khong ton tai");
  }

  const statusId = await resolveInitialStatusId(board.workspaceId);
  const slug = generatePostSlug(input.title);
  const isActive = !board.isModerated;

  let subscriberVoterProfileId = input.voterProfileId ?? null;

  if (!subscriberVoterProfileId && input.authorUserId) {
    const voter = await prisma.voterProfile.findFirst({
      where: {
        workspaceId: board.workspaceId,
        externalUserId: input.authorUserId,
      },
    });
    if (voter) {
      subscriberVoterProfileId = voter.id;
    } else {
      const newVoter = await prisma.voterProfile.create({
        data: {
          workspaceId: board.workspaceId,
          authType: "REGISTERED",
          externalUserId: input.authorUserId,
          displayName: "Tac Gia",
          customerTier: "standard",
          voteWeight: 1.0,
        },
      });
      subscriberVoterProfileId = newVoter.id;
    }
  }

  const created = await prisma.$transaction(async (tx) => {
    const postRecord = await tx.post.create({
      data: {
        boardId: input.boardId,
        categoryId: input.categoryId ?? null,
        statusId,
        authorUserId: input.authorUserId ?? null,
        voterProfileId: subscriberVoterProfileId,
        title: input.title,
        slug,
        content: input.content,
        isActive,
      },
    });

    if (input.tagIds && input.tagIds.length > 0) {
      for (const tagId of input.tagIds) {
        await tx.postTag.create({
          data: {
            postId: postRecord.id,
            tagId,
          },
        });
      }
    }

    if (input.attachments && input.attachments.length > 0) {
      for (const att of input.attachments) {
        await tx.postAttachment.create({
          data: {
            postId: postRecord.id,
            fileName: att.fileName,
            fileUrl: att.fileUrl,
            fileSize: att.fileSize,
            mimeType: att.mimeType,
          },
        });
      }
    }

    if (subscriberVoterProfileId) {
      await tx.postSubscription.create({
        data: {
          postId: postRecord.id,
          voterProfileId: subscriberVoterProfileId,
          notifyEmail: true,
          notifyInApp: true,
        },
      });
    }

    return postRecord;
  });

  return getPostById(created.id) as Promise<Post>;
};

// Retrieve single post by unique ID with tags and attachments
export const getPostById = async (
  postId: string,
): Promise<Post | null> => {
  const record = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      tags: {
        include: { tag: true },
      },
      attachments: true,
    },
  });

  if (!record) {
    return null;
  }

  return mapPostRecord(record);
};

// Retrieve single post by slug and board
export const getPostBySlug = async (
  boardId: string,
  slug: string,
): Promise<Post | null> => {
  const record = await prisma.post.findUnique({
    where: {
      boardId_slug: {
        boardId,
        slug,
      },
    },
    include: {
      tags: {
        include: { tag: true },
      },
      attachments: true,
    },
  });

  if (!record) {
    return null;
  }

  return mapPostRecord(record);
};

// Retrieve posts belonging to a board with optional unmoderated filtering
export const getPostsByBoard = async (
  boardId: string,
  includeUnmoderated: boolean = false,
): Promise<Post[]> => {
  const records = await prisma.post.findMany({
    where: {
      boardId,
      ...(includeUnmoderated ? {} : { isActive: true }),
      mergedIntoPostId: null,
    },
    orderBy: [
      { isPinned: "desc" },
      { totalScoreWeight: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      tags: {
        include: { tag: true },
      },
      attachments: true,
    },
  });

  return records.map(mapPostRecord);
};
