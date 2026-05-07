import { useState, useEffect } from "react";
import { postsApi, commentsApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../Toast/Toast";
import CommentNode from "./CommentNode";
import WritePost from "./WritePost";
import heartThin from "../../assets/icons/heart-thin-icon.webp";
import heartRed from "../../assets/icons/red-heart-icon.png";
import commentIcon from "../../assets/icons/comment-o-svgrepo-com.svg";
import trashIcon from "../../assets/icons/trash-bin-minimalistic-2-svgrepo-com.svg";
import "./PostModal.css";

function formatDate(d) {
  return new Date(d).toLocaleDateString();
}

export default function ReadPost({ post: initialPost, onClose, onUpdated }) {
  const { user } = useAuth();
  const showToast = useToast();
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const isOwner = user && post && user.id === post.authorId?.id;

  const topLevel = comments.filter((c) => !c.parentId);
  const repliesBag = {};

  comments.forEach((c) => {
    if (!c.parentId) return;

    if (!repliesBag[c.parentId]) {
      repliesBag[c.parentId] = [];
    }

    repliesBag[c.parentId].push(c);
  });

  const loadComments = async () => {
    const data = await commentsApi.list(post.id).catch(() => []);
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const refreshPost = async () => {
    const data = await postsApi.get(post.id).catch(() => null);
    if (data) setPost(data);
  };

  const handleLike = async () => {
    const data = await postsApi.toggleLike(post.id).catch(() => null);
    if (data)
      setPost((p) => ({ ...p, likeCount: data.likeCount, liked: data.liked }));
  };

  const handleAddComment = async () => {
    const txt = commentText.trim();
    if (!txt) return;
    await commentsApi.add(post.id, txt, null);
    setCommentText("");
    loadComments();

    setPost((p) => ({
      ...p,
      commentCount: p.commentCount + 1,
    }));
  };

  const handleDeletePost = async () => {
    if (!confirm("Delete this post permanently?")) return;
    await postsApi.remove(post.id);
    showToast("Post deleted!");
    onClose();
    onUpdated();
  };

  if (showEdit) {
    return (
      <WritePost
        post={post}
        onClose={() => setShowEdit(false)}
        onSaved={(updated) => {
          setPost(updated);
          setShowEdit(false);
          onUpdated();
        }}
      />
    );
  }

  return (
    <div className="post-overlay">
      <div className="post-modal">
        <div className="post-modal-header">
          <h2>{post.title}</h2>
          <button className="post-modal-close" onClick={onClose}>
            x
          </button>
        </div>
        {post.image && (
          <img src={post.image} className="post-modal-img" alt="" />
        )}
        <div className="post-modal-body">
          <p className="post-modal-meta">
            By {post.authorId.name} - {formatDate(post.createdAt)}
          </p>
          <p>{post.description}</p>
        </div>
        <div className="post-modal-actions">
          <button className="post-like-btn" onClick={handleLike}>
            <img
              src={post.liked ? heartRed : heartThin}
              className={`post-icon-heart${post.liked ? " liked" : ""}`}
              alt="like"
            />
            <span>{post.likeCount ?? 0}</span>
          </button>
          <span className="post-comment-display">
            <img
              src={commentIcon}
              className="post-icon-comment"
              alt="comments"
            />
            <span>{post.commentCount ?? 0}</span>
          </span>
          <div className="post-modal-actions-right">
            {isOwner && (
              <>
                <button
                  className="post-trash-btn"
                  onClick={handleDeletePost}
                  title="Delete"
                >
                  <img src={trashIcon} alt="delete" />
                </button>
                <button
                  className="btn btn-sm btn-blue"
                  onClick={() => setShowEdit(true)}
                >
                  Edit
                </button>
              </>
            )}
            <button
              className="btn btn-red btn-sm"
              onClick={() => showToast("Post reported. Thank you!")}
            >
              Report
            </button>
          </div>
        </div>
        <div className="post-comments-section">
          <h3>Comments</h3>

          <div className="post-comment-form">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave a comment..."
            />
            <button className="btn btn-sm btn-blue" onClick={handleAddComment}>
              Send
            </button>
          </div>

          <div className="post-comment-list">
            {topLevel.map((c) => (
              <CommentNode
                key={c.id}
                comment={c}
                replies={repliesBag[c.id] ?? []}
                postId={post.id}
                onRefresh={() => {
                  loadComments();
                  refreshPost();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
