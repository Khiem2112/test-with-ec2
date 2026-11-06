"use server";

import type { ApiResponse } from "@/types";
import type { ReleaseVersion, ReleaseItem, Changelog } from "@/types/roadmap";
import {
  createReleaseVersionSchema,
  attachCompletedPostsSchema,
  createChangelogSchema,
  type CreateReleaseVersionSchemaInput,
  type AttachCompletedPostsSchemaInput,
  type CreateChangelogSchemaInput,
} from "@/schemas/roadmap.schema";
import {
  createReleaseVersion,
  attachCompletedPosts,
} from "@/services/release.service";
import {
  createChangelog,
  publishChangelog,
} from "@/services/changelog.service";

// Server action creating a new release version
export const createReleaseVersionAction = async (
  input: CreateReleaseVersionSchemaInput,
): Promise<ApiResponse<ReleaseVersion>> => {
  try {
    const validated = createReleaseVersionSchema.parse(input);
    const release = await createReleaseVersion({
      workspaceId: validated.workspaceId,
      versionName: validated.versionName,
      targetDate: validated.targetDate ? new Date(validated.targetDate) : null,
    });
    return {
      success: true,
      data: release,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the tao ban phat hanh";
    return {
      success: false,
      error: {
        code: message.includes("VERSION_ALREADY_EXISTS")
          ? "VERSION_ALREADY_EXISTS"
          : "CREATE_RELEASE_FAILED",
        message,
      },
    };
  }
};

// Server action attaching completed feedback posts to release version
export const attachCompletedPostsAction = async (
  input: AttachCompletedPostsSchemaInput,
): Promise<ApiResponse<ReleaseItem[]>> => {
  try {
    const validated = attachCompletedPostsSchema.parse(input);
    const items = await attachCompletedPosts({
      releaseVersionId: validated.releaseVersionId,
      postIds: validated.postIds,
      completedNote: validated.completedNote,
    });
    return {
      success: true,
      data: items,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the gan tinh nang vao phien ban";
    return {
      success: false,
      error: {
        code: "ATTACH_POSTS_FAILED",
        message,
      },
    };
  }
};

// Server action creating changelog entry
export const createChangelogAction = async (
  input: CreateChangelogSchemaInput,
): Promise<ApiResponse<Changelog>> => {
  try {
    const validated = createChangelogSchema.parse(input);
    const changelog = await createChangelog(validated);
    return {
      success: true,
      data: changelog,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the tao changelog";
    return {
      success: false,
      error: {
        code: "CREATE_CHANGELOG_FAILED",
        message,
      },
    };
  }
};

// Server action publishing changelog entry
export const publishChangelogAction = async (
  changelogId: string,
): Promise<ApiResponse<Changelog>> => {
  try {
    const changelog = await publishChangelog(changelogId);
    return {
      success: true,
      data: changelog,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Khong the xuat ban changelog";
    return {
      success: false,
      error: {
        code: "PUBLISH_CHANGELOG_FAILED",
        message,
      },
    };
  }
};
