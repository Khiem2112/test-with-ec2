import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Populate baseline seed data across all 6 features and 20+ models
const seedDatabase = async (): Promise<void> => {
  // Clear existing seed data in foreign key dependency order
  await prisma.postSubscription.deleteMany({});
  await prisma.commentReaction.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.voteActivityLog.deleteMany({});
  await prisma.vote.deleteMany({});
  await prisma.postAttachment.deleteMany({});
  await prisma.postTag.deleteMany({});
  await prisma.releaseItem.deleteMany({});
  await prisma.changelog.deleteMany({});
  await prisma.releaseVersion.deleteMany({});
  await prisma.roadmapView.deleteMany({});
  await prisma.postStatusHistory.deleteMany({});
  await prisma.postMergeHistory.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.board.deleteMany({});
  await prisma.postStatus.deleteMany({});
  await prisma.voterProfile.deleteMany({});
  await prisma.userSession.deleteMany({});
  await prisma.workspaceMember.deleteMany({});
  await prisma.webhookSubscription.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.workspace.deleteMany({});
  await prisma.user.deleteMany({});

  // Feature 1: Workspace & Identity
  const user = await prisma.user.create({
    data: {
      email: "founder@roadnaphub.internal",
      fullName: "Lead Architect",
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: "RoadmapHub Core",
      slug: "roadnaphub-core",
      customDomain: "feedback.roadnaphub.internal",
      brandingConfig: { primaryColor: "#2563EB" },
      isPublicPortal: true,
    },
  });

  await prisma.workspaceMember.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      role: "OWNER",
    },
  });

  await prisma.userSession.create({
    data: {
      userId: user.id,
      tokenHash: "seed_token_hash_value_12345",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const voterProfile = await prisma.voterProfile.create({
    data: {
      workspaceId: workspace.id,
      authType: "REGISTERED",
      externalUserId: user.id,
      displayName: "Architect Voter",
      customerTier: "enterprise",
      voteWeight: 5.0,
    },
  });

  // Feature 2: Boards, Categories, Tags & Statuses
  const board = await prisma.board.create({
    data: {
      workspaceId: workspace.id,
      name: "Feature Suggestions",
      slug: "feature-suggestions",
      description: "Public feedback and feature requests for core modules",
      isPublic: true,
      isModerated: false,
    },
  });

  const category = await prisma.category.create({
    data: {
      boardId: board.id,
      name: "Authentication & Security",
      slug: "auth-security",
      description: "Single sign-on, multi-factor auth, and session controls",
    },
  });

  const tag = await prisma.tag.create({
    data: {
      name: "SSO",
      slug: "sso",
      colorHex: "#10B981",
    },
  });

  const statusUnderReview = await prisma.postStatus.create({
    data: {
      workspaceId: workspace.id,
      name: "Under Review",
      key: "under_review",
      category: "BACKLOG",
      colorHex: "#6B7280",
      showOnRoadmap: false,
      displayOrder: 0,
    },
  });

  const statusPlanned = await prisma.postStatus.create({
    data: {
      workspaceId: workspace.id,
      name: "Planned",
      key: "planned",
      category: "PLANNED",
      colorHex: "#3B82F6",
      showOnRoadmap: true,
      displayOrder: 1,
    },
  });

  const statusInProgress = await prisma.postStatus.create({
    data: {
      workspaceId: workspace.id,
      name: "In Progress",
      key: "in_progress",
      category: "IN_PROGRESS",
      colorHex: "#F59E0B",
      showOnRoadmap: true,
      displayOrder: 2,
    },
  });

  const post = await prisma.post.create({
    data: {
      boardId: board.id,
      categoryId: category.id,
      statusId: statusPlanned.id,
      authorUserId: user.id,
      voterProfileId: voterProfile.id,
      title: "Google Workspace SSO Integration",
      slug: "google-workspace-sso-integration",
      content: "Allow enterprise team members to authenticate via Google Workspace SAML and OAuth.",
      totalVotesCount: 1,
      totalScoreWeight: 5.0,
    },
  });

  await prisma.postTag.create({
    data: {
      postId: post.id,
      tagId: tag.id,
    },
  });

  await prisma.postAttachment.create({
    data: {
      postId: post.id,
      fileName: "sso-mockup.png",
      fileUrl: "https://cdn.roadnaphub.internal/sso-mockup.png",
      fileSize: 204800,
      mimeType: "image/png",
    },
  });

  // Feature 3: Smart Voting & Discussions
  await prisma.vote.create({
    data: {
      postId: post.id,
      voterProfileId: voterProfile.id,
      appliedWeight: 5.0,
    },
  });

  await prisma.voteActivityLog.create({
    data: {
      postId: post.id,
      voterProfileId: voterProfile.id,
      actionType: "UPVOTE",
    },
  });

  const rootComment = await prisma.comment.create({
    data: {
      postId: post.id,
      authorUserId: user.id,
      authorName: user.fullName,
      content: "Initial technical requirements have been scoped and approved.",
    },
  });

  await prisma.comment.create({
    data: {
      postId: post.id,
      parentId: rootComment.id,
      authorName: "Staff Engineer",
      content: "Security audit will be conducted concurrently during sprint execution.",
      isInternalNote: true,
    },
  });

  await prisma.commentReaction.create({
    data: {
      commentId: rootComment.id,
      userId: user.id,
      type: "ROCKET",
    },
  });

  // Feature 4: Post Lifecycle & Merge
  await prisma.postStatusHistory.create({
    data: {
      postId: post.id,
      oldStatusId: statusUnderReview.id,
      newStatusId: statusPlanned.id,
      changedById: user.id,
      changeNote: "Prioritized into upcoming Q4 product roadmap.",
    },
  });

  // Feature 5: Roadmap & Releases
  await prisma.roadmapView.create({
    data: {
      workspaceId: workspace.id,
      name: "Public Roadmap",
      slug: "public-roadmap",
      isDefault: true,
    },
  });

  const release = await prisma.releaseVersion.create({
    data: {
      workspaceId: workspace.id,
      versionName: "v1.2.0",
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isPublished: true,
      releasedAt: new Date(),
    },
  });

  await prisma.releaseItem.create({
    data: {
      releaseVersionId: release.id,
      postId: post.id,
      completedNote: "Fully verified on staging cluster",
    },
  });

  await prisma.changelog.create({
    data: {
      workspaceId: workspace.id,
      releaseVersionId: release.id,
      title: "RoadmapHub 1.2.0 Release",
      slug: "roadnaphub-1-2-0-release",
      summary: "Introducing Google Workspace Single Sign-On and enhanced audit trails.",
      bodyMarkdown: "### New Capabilities\n- Enterprise SSO via Google.\n- Subscriptions and notification preferences.",
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // Feature 6: Notifications, Webhooks & Audit Logging
  await prisma.postSubscription.create({
    data: {
      postId: post.id,
      voterProfileId: voterProfile.id,
      notifyEmail: true,
      notifyInApp: true,
    },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      type: "STATUS_CHANGED",
      title: "Feature Planned",
      message: "Google Workspace SSO Integration was marked as Planned.",
      actionUrl: `/${workspace.slug}/posts/${post.slug}`,
    },
  });

  await prisma.webhookSubscription.create({
    data: {
      workspaceId: workspace.id,
      targetUrl: "https://api.partner.internal/webhooks",
      secretKey: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
      events: ["POST_STATUS_CHANGED", "RELEASE_PUBLISHED"],
    },
  });

  await prisma.auditLog.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      action: "WORKSPACE_INITIALIZED",
      entityType: "WORKSPACE",
      entityId: workspace.id,
      details: { environment: "production_ready" },
    },
  });
};

seedDatabase()
  .then(async () => {
    await prisma.$disconnect();
    console.log("[SEED] Seed data successfully populated across all 20 models.");
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("[SEED_ERROR]", error);
    await prisma.$disconnect();
    process.exit(1);
  });
