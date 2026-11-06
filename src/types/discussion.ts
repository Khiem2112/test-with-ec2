export type ReactionType =
  | "THUMBS_UP"
  | "THUMBS_DOWN"
  | "HEART"
  | "ROCKET"
  | "INSIGHTFUL";

export type Vote = {
  id: number;
  postId: string;
  voterProfileId: string;
  appliedWeight: number;
  ipAddressHash: string | null;
  createdAt: Date;
};

export type VoteActivityLog = {
  id: number;
  postId: string;
  voterProfileId: string;
  actionType: "UPVOTE" | "UNVOTE";
  ipAddressHash: string | null;
  userAgent: string | null;
  createdAt: Date;
};

export type Comment = {
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
};

export type CommentReaction = {
  id: number;
  commentId: string;
  userId: string | null;
  voterId: string | null;
  type: ReactionType;
  createdAt: Date;
};

export type CommentTreeNode = Comment & {
  replies: CommentTreeNode[];
  reactions?: CommentReaction[];
};

export type VoteResult = {
  action: "UPVOTED" | "UNVOTED";
  postId: string;
  totalVotesCount: number;
  totalScoreWeight: number;
  userHasVoted: boolean;
};

export type CreateCommentInput = {
  postId: string;
  authorName: string;
  content: string;
  parentId?: string | null;
  isInternalNote?: boolean;
  authorUserId?: string | null;
  isPinned?: boolean;
};
