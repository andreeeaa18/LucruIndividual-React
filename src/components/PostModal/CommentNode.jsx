import { useState } from "react";
import { commentsApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../Toast/Toast";
import "./PostModal.css";

function formatDate(d) {
  return new Date(d).toLocaleDateString();
}

export default function CommentNode({ comment, replies, postId, onRefresh }) {
  const { user } = useAuth();
  const showToast = useToast();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    const txt = replyText.trim();
    if (!txt) return;
    await commentsApi.add(postId, txt, comment.id);
    setReplyText("");
    setShowReply(false);
    onRefresh();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    await commentsApi.remove(postId, comment.id).catch(() => {});
    onRefresh();
    showToast("Comment deleted");
  };

  return (
    <div className="comment-item">
      <div className="comment-author">{comment.userId?.name ?? "?"}</div>
      <div className="comment-text">{comment.content}</div>
      <div className="comment-meta">{formatDate(comment.createdAt)}</div>
      {user && (
        <div className="comment-reply-toggle">
          <button
            className="comment-btn-reply"
            onClick={() => setShowReply((p) => !p)}
          >
            Reply...
          </button>
          {user.id === comment.userId?.id && (
            <button
              className="comment-btn-reply"
              onClick={handleDelete}
              style={{ marginLeft: 8 }}
            >
              Delete
            </button>
          )}
        </div>
      )}
      {showReply && (
        <div className="comment-reply-form">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply..."
          />
          <button className="btn btn-sm btn-blue" onClick={handleReply}>
            Send
          </button>
        </div>
      )}
      {replies.map((r) => (
        <div key={r.id} className="comment-item comment-reply">
          <div className="comment-author">{r.userId?.name ?? "?"}</div>
          <div className="comment-text">{r.content}</div>
          <div className="comment-meta">{formatDate(r.createdAt)}</div>
          {user?.id === r.userId?.id && (
            <div className="comment-reply-toggle">
              <button
                className="comment-btn-reply"
                onClick={async () => {
                  if (!confirm("Delete this reply?")) return;
                  await commentsApi.remove(postId, r.id).catch(() => {});
                  onRefresh();
                  showToast("Reply deleted");
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
