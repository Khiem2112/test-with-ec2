import { prisma } from "@/lib/prisma";
import type { Comment, CommentTreeNode, CreateCommentInput, ReactionType } from "@/types/discussion";

// Map Prisma comment record to strict domain model
const mapCommentRecord = (record: {
  id: string;
  postId: string;
  authorUserId: string | null;
  parentId: string | null;
  authorName: string;
  content: string;
  isInternalNote: boolean;
  isPinned: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  reactions?: Array<{
    id: number;
    commentId: string;
    userId: string | null;
    voterId: string | null;
    type: ReactionType;
    createdAt: Date;
  }>;
}): Comment => {
  return {
    id: record.id,
    postId: record.postId,
    authorUserId: record.authorUserId,
    parentId: record.parentId,
    authorName: record.authorName,
    content: record.content,
    isInternalNote: record.isInternalNote,
    isPinned: record.isPinned,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

// Assemble flat comment array into recursive threaded comment tree
export const buildCommentTree = (
  flatComments: Array<Comment & { reactions?: Array<{ id: number; commentId: string; userId: string | null; voterId: string | null; type: ReactionType; createdAt: Date }> }>,
): CommentTreeNode[] => {
  const nodeMap = new Map<string, CommentTreeNode>();
  const rootNodes: CommentTreeNode[] = [];

  for (const item of flatComments) {
    nodeMap.set(item.id, {
      ...item,
      replies: [],
      reactions: item.reactions,
    });
  }

  for (const item of flatComments) {
    const currentNode = nodeMap.get(item.id)!;
    if (item.parentId && nodeMap.has(item.parentId)) {
      const parentNode = nodeMap.get(item.parentId)!;
      parentNode.replies.push(currentNode);
    } else {
      rootNodes.push(currentNode);
    }
  }

  return rootNodes;
};

// Retrieve comments for a post, strictly filtering internal notes for non-members
export const getCommentsByPost = async (
  postId: string,
  requesterUserId?: string | null,
): Promise<CommentTreeNode[]> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { board: true },
  });

  if (!post) {
    throw new Error("POST_NOT_FOUND: Bai viet khong ton tai");
  }

  let isVerifiedMember = false;
  if (requesterUserId) {
    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: post.board.workspaceId,
        userId: requesterUserId,
        isActive: true,
      },
    });
    if (membership) {
      isVerifiedMember = true;
    }
  }

  const rawComments = await prisma.comment.findMany({
    where: {
      postId,
      isActive: true,
      ...(isVerifiedMember ? {} : { isInternalNote: false }),
    },
    orderBy: [
      { isPinned: "desc" },
      { createdAt: "asc" },
    ],
    include: {
      reactions: true,
    },
  });

  const domainComments = rawComments.map((rc) => ({
    ...mapCommentRecord(rc),
    reactions: rc.reactions,
  }));

  return buildCommentTree(domainComments);
};

// Create a new comment or internal note with lock check and auto-subscription
export const createComment = async (
  input: CreateCommentInput,
): Promise<Comment> => {
  const post = await prisma.post.findUnique({
    where: { id: input.postId },
    include: { board: true },
  });

  if (!post) {
    throw new Error("POST_NOT_FOUND: Bai viet khong ton tai");
  }

  if (post.isLocked) {
    throw new Error("POST_LOCKED: Bai viet nay da bi dong bang thao luan va binh chon boi ban quan tri");
  }

  if (input.isInternalNote && input.authorUserId) {
    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: post.board.workspaceId,
        userId: input.authorUserId,
        isActive: true,
      },
    });

    if (!membership) {
      throw new Error("FORBIDDEN: Chi thanh vien workspace moi co the tao ghi chu noi bo");
    }
  }

  return await prisma.$transaction(async (tx) => {
    const commentRecord = await tx.comment.create({
      data: {
        postId: input.postId,
        authorUserId: input.authorUserId ?? null,
        parentId: input.parentId ?? null,
        authorName: input.authorName,
        content: input.content,
        isInternalNote: input.isInternalNote ?? false,
        isPinned: input.isPinned ?? false,
      },
    });

    await tx.post.update({
      where: { id: input.postId },
      data: { commentsCount: { increment: 1 } },
    });

    // Auto-subscribe commenter if user ID provided
    if (input.authorUserId) {
      const voter = await tx.voterProfile.findFirst({
        where: {
          workspaceId: post.board.workspaceId,
          externalUserId: input.authorUserId,
        },
      });

      if (voter) {
        const existingSub = await tx.postSubscription.findUnique({
          where: {
            postId_voterProfileId: {
              postId: input.postId,
              voterProfileId: voter.id,
            },
          },
        });

        if (!existingSub) {
          await tx.postSubscription.create({
            data: {
              postId: input.postId,
              voterProfileId: voter.id,
              notifyEmail: true,
              notifyInApp: true,
            },
          });
        }
      }
    }

    return mapCommentRecord(commentRecord);
  });
};
