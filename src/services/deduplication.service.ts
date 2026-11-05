import { prisma } from "@/lib/prisma";
import type { SimilarPostResult } from "@/types/post";

// Normalize text for comparison by stripping special characters and collapsing whitespace
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim()
    .replace(/\s+/g, " ");
};

// Calculate Levenshtein distance between two strings using dynamic programming
export const calculateLevenshteinDistance = (a: string, b: string): number => {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix: number[][] = [];
  for (let i = 0; i <= bn; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= an; j++) {
    matrix[0]![j] = j;
  }

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!;
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j - 1]! + 1,
          matrix[i]![j - 1]! + 1,
          matrix[i - 1]![j]! + 1,
        );
      }
    }
  }

  return matrix[bn]![an]!;
};

// Calculate token intersection similarity (Jaccard index) between two text strings
export const calculateTokenSimilarity = (a: string, b: string): number => {
  const tokensA = new Set(a.split(" ").filter((t) => t.length > 0));
  const tokensB = new Set(b.split(" ").filter((t) => t.length > 0));
  if (tokensA.size === 0 || tokensB.size === 0) {
    return 0;
  }

  let intersectionCount = 0;
  tokensA.forEach((token) => {
    if (tokensB.has(token)) {
      intersectionCount += 1;
    }
  });

  const unionCount = new Set([...tokensA, ...tokensB]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
};

// Compute composite similarity score combining edit distance, token overlap, and substring containment
export const computeTextSimilarity = (query: string, target: string): number => {
  const normQuery = normalizeText(query);
  const normTarget = normalizeText(target);

  if (normQuery === normTarget) {
    return 1.0;
  }
  if (normTarget.includes(normQuery) || normQuery.includes(normTarget)) {
    return 0.85;
  }

  const maxLen = Math.max(normQuery.length, normTarget.length);
  if (maxLen === 0) {
    return 0;
  }

  const levDist = calculateLevenshteinDistance(normQuery, normTarget);
  const levRatio = Math.max(0, 1 - levDist / maxLen);
  const tokenSim = calculateTokenSimilarity(normQuery, normTarget);

  return Number(Math.max(levRatio, tokenSim).toFixed(2));
};

// Search for similar posts within a board to prevent duplicate submissions
export const findSimilarPosts = async (
  boardId: string,
  query: string,
  threshold: number = 0.3,
): Promise<SimilarPostResult[]> => {
  const posts = await prisma.post.findMany({
    where: {
      boardId,
      isActive: true,
      mergedIntoPostId: null,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      totalVotesCount: true,
      totalScoreWeight: true,
      status: {
        select: {
          id: true,
          name: true,
          colorHex: true,
        },
      },
    },
    take: 50,
  });

  const scoredPosts: SimilarPostResult[] = [];

  for (const post of posts) {
    const score = computeTextSimilarity(query, post.title);
    if (score >= threshold) {
      scoredPosts.push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        totalVotesCount: post.totalVotesCount,
        totalScoreWeight: Number(post.totalScoreWeight),
        status: {
          id: post.status.id,
          name: post.status.name,
          colorHex: post.status.colorHex,
        },
        similarityScore: score,
      });
    }
  }

  return scoredPosts.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, 5);
};
