"use client";

import React, { useState } from "react";
import { CommentThread } from "./comment-thread";
import type { Comment, CommentTreeNode } from "@/types/discussion";

export type PostDiscussionClientProps = {
  postId: string;
  initialComments: CommentTreeNode[];
  isTeamMember?: boolean;
  authorUserId?: string | null;
  className?: string;
};

// Insert newly created comment into tree structure immutably
const insertCommentIntoTree = (
  nodes: CommentTreeNode[],
  newComment: Comment
): CommentTreeNode[] => {
  if (!newComment.parentId) {
    const newRootNode: CommentTreeNode = {
      ...newComment,
      reactions: [],
      replies: [],
    };
    return [newRootNode, ...nodes];
  }

  return nodes.map((node) => {
    if (node.id === newComment.parentId) {
      const newChildNode: CommentTreeNode = {
        ...newComment,
        reactions: [],
        replies: [],
      };
      return {
        ...node,
        replies: [...(node.replies ?? []), newChildNode],
      };
    }

    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: insertCommentIntoTree(node.replies, newComment),
      };
    }

    return node;
  });
};

export const PostDiscussionClient = ({
  postId,
  initialComments,
  isTeamMember = false,
  authorUserId = null,
  className,
}: PostDiscussionClientProps): React.JSX.Element => {
  const [comments, setComments] = useState<CommentTreeNode[]>(initialComments);

  const handleCommentCreated = (created: Comment): void => {
    setComments((prev) => insertCommentIntoTree(prev, created));
  };

  return (
    <div className={className}>
      <CommentThread
        comments={comments}
        postId={postId}
        isTeamMember={isTeamMember}
        authorUserId={authorUserId}
        onCommentCreated={handleCommentCreated}
      />
    </div>
  );
};
