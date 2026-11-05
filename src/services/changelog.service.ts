import { prisma } from "@/lib/prisma";
import type { Changelog, CreateChangelogInput } from "@/types/roadmap";

// Generate unique kebab-case slug for changelog entries
const generateChangelogSlug = (title: string): string => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]+/gu, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
};

// Map Prisma changelog record to strict domain model
const mapChangelogRecord = (record: {
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
}): Changelog => {
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    releaseVersionId: record.releaseVersionId,
    title: record.title,
    slug: record.slug,
    summary: record.summary,
    bodyMarkdown: record.bodyMarkdown,
    isPublished: record.isPublished,
    publishedAt: record.publishedAt,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

// Create or draft a new changelog entry with release version synchronization
export const createChangelog = async (
  input: CreateChangelogInput,
): Promise<Changelog> => {
  const slug = input.slug ? input.slug : generateChangelogSlug(input.title);
  const now = new Date();
  const isPublished = input.isPublished ?? false;
  const publishedAt = isPublished ? now : null;

  return await prisma.$transaction(async (tx) => {
    const created = await tx.changelog.create({
      data: {
        workspaceId: input.workspaceId,
        releaseVersionId: input.releaseVersionId ?? null,
        title: input.title,
        slug,
        summary: input.summary,
        bodyMarkdown: input.bodyMarkdown,
        isPublished,
        publishedAt,
      },
    });

    if (isPublished && input.releaseVersionId) {
      await tx.releaseVersion.update({
        where: { id: input.releaseVersionId },
        data: {
          isPublished: true,
          releasedAt: now,
        },
      });
    }

    return mapChangelogRecord(created);
  });
};

// Publish existing changelog and synchronize release version status
export const publishChangelog = async (
  id: string,
): Promise<Changelog> => {
  const now = new Date();

  return await prisma.$transaction(async (tx) => {
    const changelog = await tx.changelog.findUnique({
      where: { id },
    });

    if (!changelog) {
      throw new Error("CHANGELOG_NOT_FOUND: Bai viet changelog khong ton tai");
    }

    const updated = await tx.changelog.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: now,
      },
    });

    if (changelog.releaseVersionId) {
      await tx.releaseVersion.update({
        where: { id: changelog.releaseVersionId },
        data: {
          isPublished: true,
          releasedAt: now,
        },
      });
    }

    return mapChangelogRecord(updated);
  });
};

// Retrieve published changelogs with optional draft inclusion for administrators
export const getChangelogsByWorkspace = async (
  workspaceId: string,
  includeDrafts: boolean = false,
): Promise<Changelog[]> => {
  const records = await prisma.changelog.findMany({
    where: {
      workspaceId,
      isActive: true,
      ...(includeDrafts ? {} : { isPublished: true }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return records.map(mapChangelogRecord);
};

// Retrieve single changelog by unique slug within workspace
export const getChangelogBySlug = async (
  workspaceId: string,
  slug: string,
): Promise<Changelog | null> => {
  const record = await prisma.changelog.findUnique({
    where: {
      workspaceId_slug: {
        workspaceId,
        slug,
      },
    },
  });

  if (!record) {
    return null;
  }

  return mapChangelogRecord(record);
};
