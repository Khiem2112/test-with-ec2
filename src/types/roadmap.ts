export type RoadmapCard = {
  id: string;
  title: string;
  slug: string;
  totalVotesCount: number;
  totalScoreWeight: number;
  commentsCount: number;
  categoryName?: string;
  tagNames?: string[];
};

export type RoadmapColumn = {
  statusId: number;
  name: string;
  colorHex: string;
  category: string;
  displayOrder: number;
  posts: RoadmapCard[];
};

export type RoadmapData = {
  columns: RoadmapColumn[];
};

export type RoadmapView = {
  id: number;
  workspaceId: string;
  name: string;
  slug: string;
  isDefault: boolean;
  columnConfig: Record<string, unknown>[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ReleaseItem = {
  id: number;
  releaseVersionId: string;
  postId: string;
  completedNote: string | null;
  createdAt: Date;
  postTitle?: string;
};

export type Changelog = {
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
};

export type ReleaseVersion = {
  id: string;
  workspaceId: string;
  versionName: string;
  targetDate: Date | null;
  releasedAt: Date | null;
  isPublished: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  items?: ReleaseItem[];
  changelog?: Changelog | null;
};

export type CreateReleaseVersionInput = {
  workspaceId: string;
  versionName: string;
  targetDate?: Date | null;
};

export type AttachCompletedPostsInput = {
  releaseVersionId: string;
  postIds: string[];
  completedNote?: string;
};

export type CreateChangelogInput = {
  workspaceId: string;
  releaseVersionId?: string | null;
  title: string;
  slug?: string;
  summary: string;
  bodyMarkdown: string;
  isPublished?: boolean;
};
