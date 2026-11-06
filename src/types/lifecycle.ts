export type StatusCategory =
  | "BACKLOG"
  | "UNSCHEDULED"
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CLOSED"
  | "DECLINED";

export type PostStatus = {
  id: number;
  workspaceId: string;
  name: string;
  key: string;
  category: StatusCategory;
  colorHex: string;
  showOnRoadmap: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PostStatusHistory = {
  id: number;
  postId: string;
  oldStatusId: number | null;
  newStatusId: number;
  changedById: string | null;
  changeNote: string | null;
  createdAt: Date;
};

export type PostMergeHistory = {
  id: number;
  sourcePostId: string;
  targetPostId: string;
  performedById: string | null;
  votesTransferred: number;
  createdAt: Date;
};

export type MergePreviewResult = {
  sourcePostId: string;
  targetPostId: string;
  transferableVotesCount: number;
  duplicateVotesCount: number;
  additionalScoreWeight: number;
  transferableSubscribersCount: number;
};

export type ExecuteMergeResult = {
  sourcePostId: string;
  targetPostId: string;
  votesTransferred: number;
  subscribersTransferred: number;
  targetNewTotalVotes: number;
  targetNewScoreWeight: number;
  mergedAt: Date;
};

export type UpdatePostStatusInput = {
  postId: string;
  newStatusId: number;
  changedById?: string | null;
  changeNote?: string | null;
  notifySubscribers?: boolean;
};

export type UpdatePostStatusResult = {
  postId: string;
  oldStatusId: number | null;
  newStatusId: number;
  updatedAt: Date;
  historyId: number;
};
