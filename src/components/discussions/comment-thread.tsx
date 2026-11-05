"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";
import { CommentComposer } from "./comment-composer";
import type { Comment, CommentTreeNode } from "@/types/discussion";

export type CommentThreadProps = {
  comments: CommentTreeNode[];
  postId: string;
  isTeamMember?: boolean;
  authorUserId?: string | null;
  onCommentCreated?: (comment: Comment) => void;
  className?: string;
};

type CommentItemProps = {
  node: CommentTreeNode;
  postId: string;
  isTeamMember?: boolean;
  authorUserId?: string | null;
  onCommentCreated?: (comment: Comment) => void;
};

const CommentItem = ({
  node,
  postId,
  isTeamMember = false,
  authorUserId = null,
  onCommentCreated,
}: CommentItemProps): React.JSX.Element => {
  const [isReplying, setIsReplying] = useState<boolean>(false);

  const handleReplyCreated = (created: Comment): void => {
    setIsReplying(false);
    onCommentCreated?.(created);
  };

  return (
    <div
      className={cn(
        "rounded-lg p-3 transition-colors",
        node.isInternalNote
          ? "border-2 border-amber-400 bg-amber-50/70"
          : "border border-gray-200 bg-white",
      )}
    >
      {/* Internal Note Banner Pill */}
      {node.isInternalNote && (
        <div className="mb-2 px-2.5 py-1 bg-amber-200/80 text-amber-900 font-bold text-[11px] rounded flex items-center justify-between">
          <span>GHI CHU NOI BO</span>
          <span className="font-normal text-[10px]">Chi thanh vien doi ngu moi nhin thay</span>
        </div>
      )}

      {/* Header: Author and timestamp */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">{node.authorName}</span>
          {node.isPinned && (
            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-semibold rounded">
              Ghim
            </span>
          )}
          {node.authorUserId && (
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">
              Doi Ngu
            </span>
          )}
        </div>
        <span className="text-[11px] text-gray-400">
          {new Date(node.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Content */}
      <div className="mt-1.5 text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
        {node.content}
      </div>

      {/* Actions toolbar */}
      <div className="mt-2.5 flex items-center gap-3 text-[11px]">
        <button
          type="button"
          onClick={() => setIsReplying(!isReplying)}
          className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
        >
          {isReplying ? "Huy tra loi" : "Tra loi"}
        </button>

        {node.reactions && node.reactions.length > 0 && (
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="font-mono">+{node.reactions.length} phan ung</span>
          </div>
        )}
      </div>

      {/* Inline Reply Composer */}
      {isReplying && (
        <div className="mt-3 pl-3 border-l-2 border-blue-400">
          <CommentComposer
            postId={postId}
            parentId={node.id}
            isTeamMember={isTeamMember}
            authorUserId={authorUserId}
            onCommentCreated={handleReplyCreated}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {/* Nested Replies Tree */}
      {node.replies && node.replies.length > 0 && (
        <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-2">
          {node.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              node={reply}
              postId={postId}
              isTeamMember={isTeamMember}
              authorUserId={authorUserId}
              onCommentCreated={onCommentCreated}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CommentThread = ({
  comments,
  postId,
  isTeamMember = false,
  authorUserId = null,
  onCommentCreated,
  className,
}: CommentThreadProps): React.JSX.Element => {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
        Thao Luan ({comments.length})
      </h3>

      {comments.length === 0 ? (
        <p className="text-xs text-gray-500 italic p-4 bg-gray-50 rounded border border-gray-200">
          Chua co binh luan nao. Hay tro thanh nguoi dau tien dong gop y kien.
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((rootComment) => (
            <CommentItem
              key={rootComment.id}
              node={rootComment}
              postId={postId}
              isTeamMember={isTeamMember}
              authorUserId={authorUserId}
              onCommentCreated={onCommentCreated}
            />
          ))}
        </div>
      )}
    </div>
  );
};
