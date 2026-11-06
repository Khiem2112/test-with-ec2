export type Board = {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string | null;
  isPublic: boolean;
  isModerated: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: number;
  boardId: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
  colorHex: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PostTag = {
  postId: string;
  tagId: number;
  createdAt: Date;
};

export type PostAttachment = {
  id: string;
  postId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
};

export type Post = {
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
  totalScoreWeight: number;
  commentsCount: number;
  isPinned: boolean;
  isLocked: boolean;
  mergedIntoPostId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags?: Tag[];
  attachments?: PostAttachment[];
};

export type SimilarPostResult = {
  id: string;
  title: string;
  slug: string;
  totalVotesCount: number;
  totalScoreWeight: number;
  status: {
    id: number;
    name: string;
    colorHex: string;
  };
  similarityScore: number;
};

export type CreatePostAttachmentInput = {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
};

export type CreatePostInput = {
  boardId: string;
  categoryId?: number | null;
  authorUserId?: string | null;
  voterProfileId?: string | null;
  title: string;
  content: string;
  tagIds?: number[];
  attachments?: CreatePostAttachmentInput[];
};

export type BoardHierarchy = Board & {
  categories: Category[];
};
