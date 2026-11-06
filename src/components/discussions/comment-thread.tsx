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
        "rounded-xl p-4 transition-colors",
        node.isInternalNote
          ? "border border-amber-500/40 bg-amber-950/20"
          : "border border-[#23252a] bg-[#0f1011]"
      )}
    >
      {node.isInternalNote && (
        <div className="mb-2 px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-[10px] rounded flex items-center justify-between">
          <span>GHI CHU NOI BO</span>
          <span className="font-normal text-[10px] text-amber-400">Chi thanh vien doi ngu moi nhin thay</span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#f7f8f8]">{node.authorName}</span>
          {node.isPinned && (
            <span className="px-1.5 py-0.5 bg-[#5e6ad2]/20 text-[#828fff] text-[10px] font-semibold rounded border border-[#5e6ad2]/30">
              Ghim
            </span>
          )}
          {node.authorUserId && (
            <span className="px-1.5 py-0.5 bg-[#18191a] text-[#828fff] text-[10px] font-medium rounded border border-[#23252a]">
              Doi Ngu
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#62666d]">
          {new Date(node.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-2 text-xs text-[#d0d6e0] whitespace-pre-wrap leading-relaxed">
        {node.content}
      </div>

      <div className="mt-3 flex items-center gap-3 text-[11px]">
        <button
          type="button"
          onClick={() => setIsReplying(!isReplying)}
          className="text-[#5e6ad2] hover:text-[#828fff] font-medium cursor-pointer transition-colors"
        >
          {isReplying ? "Huy tra loi" : "Tra loi"}
        </button>

        {node.reactions && node.reactions.length > 0 && (
          <div className="flex items-center gap-1.5 text-[#62666d]">
            <span>+{node.reactions.length} phan ung</span>
          </div>
        )}
      </div>

      {isReplying && (
        <div className="mt-3 pl-3 border-l-2 border-[#5e6ad2]">
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

      {node.replies && node.replies.length > 0 && (
        <div className="mt-3 pl-4 border-l border-[#23252a] space-y-3">
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
      <CommentComposer
        postId={postId}
        isTeamMember={isTeamMember}
        authorUserId={authorUserId}
        onCommentCreated={onCommentCreated}
      />

      {comments.length === 0 ? (
        <div className="p-8 text-center bg-[#0f1011] border border-[#23252a] rounded-xl">
          <p className="text-xs text-[#8a8f98]">
            Chua co binh luan nao. Hay la nguoi dau tien dong gop y kien cho chu de nay.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((node) => (
            <CommentItem
              key={node.id}
              node={node}
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
