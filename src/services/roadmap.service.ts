import { prisma } from "@/lib/prisma";
import type { RoadmapData, RoadmapColumn, RoadmapCard } from "@/types/roadmap";

// Retrieve Kanban columns for statuses with showOnRoadmap = true, ordered by score descending
export const getRoadmapColumns = async (
  workspaceId: string,
): Promise<RoadmapData> => {
  const statuses = await prisma.postStatus.findMany({
    where: {
      workspaceId,
      showOnRoadmap: true,
      isActive: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  const columns: RoadmapColumn[] = [];

  for (const status of statuses) {
    const posts = await prisma.post.findMany({
      where: {
        statusId: status.id,
        isActive: true,
        mergedIntoPostId: null,
      },
      orderBy: [
        { totalScoreWeight: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    });

    const cards: RoadmapCard[] = posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      totalVotesCount: p.totalVotesCount,
      totalScoreWeight: Number(p.totalScoreWeight),
      commentsCount: p.commentsCount,
      categoryName: p.category?.name,
      tagNames: p.tags.map((pt) => pt.tag.name),
    }));

    columns.push({
      statusId: status.id,
      name: status.name,
      colorHex: status.colorHex,
      category: status.category,
      displayOrder: status.displayOrder,
      posts: cards,
    });
  }

  return { columns };
};
