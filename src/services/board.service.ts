import { prisma } from "@/lib/prisma";
import type { Board, Category, Tag, BoardHierarchy } from "@/types/post";

// Retrieve active boards along with nested categories ordered by display hierarchy
export const getBoardsByWorkspace = async (
  workspaceId: string,
): Promise<BoardHierarchy[]> => {
  const boards = await prisma.board.findMany({
    where: {
      workspaceId,
      isActive: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  return boards.map((b) => ({
    id: b.id,
    workspaceId: b.workspaceId,
    name: b.name,
    slug: b.slug,
    description: b.description,
    isPublic: b.isPublic,
    isModerated: b.isModerated,
    displayOrder: b.displayOrder,
    isActive: b.isActive,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    categories: b.categories.map((c) => ({
      id: c.id,
      boardId: c.boardId,
      name: c.name,
      slug: c.slug,
      description: c.description,
      displayOrder: c.displayOrder,
      isActive: c.isActive,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
  }));
};

// Retrieve single board by slug within workspace boundary
export const getBoardBySlug = async (
  workspaceId: string,
  slug: string,
): Promise<Board | null> => {
  const board = await prisma.board.findFirst({
    where: {
      workspaceId,
      slug,
      isActive: true,
    },
  });

  if (!board) {
    return null;
  }

  return {
    id: board.id,
    workspaceId: board.workspaceId,
    name: board.name,
    slug: board.slug,
    description: board.description,
    isPublic: board.isPublic,
    isModerated: board.isModerated,
    displayOrder: board.displayOrder,
    isActive: board.isActive,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
  };
};

// Retrieve single board by unique ID
export const getBoardById = async (
  boardId: string,
): Promise<Board | null> => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!board) {
    return null;
  }

  return {
    id: board.id,
    workspaceId: board.workspaceId,
    name: board.name,
    slug: board.slug,
    description: board.description,
    isPublic: board.isPublic,
    isModerated: board.isModerated,
    displayOrder: board.displayOrder,
    isActive: board.isActive,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
  };
};

// Retrieve active categories for a specific board
export const getCategoriesByBoard = async (
  boardId: string,
): Promise<Category[]> => {
  const categories = await prisma.category.findMany({
    where: {
      boardId,
      isActive: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  return categories.map((c) => ({
    id: c.id,
    boardId: c.boardId,
    name: c.name,
    slug: c.slug,
    description: c.description,
    displayOrder: c.displayOrder,
    isActive: c.isActive,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
};

// Retrieve all active tags across the system
export const getAllTags = async (): Promise<Tag[]> => {
  const tags = await prisma.tag.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return tags.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    colorHex: t.colorHex,
    isActive: t.isActive,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));
};
