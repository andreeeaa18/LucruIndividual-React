import { useState } from "react";
import { postsApi } from "../../api/api";
import heartThin from "../../assets/icons/heart-thin-icon.webp";
import heartRed from "../../assets/icons/red-heart-icon.png";
import commentIcon from "../../assets/icons/comment-o-svgrepo-com.svg";
import trashIcon from "../../assets/icons/trash-bin-minimalistic-2-svgrepo-com.svg";
import "./PostCard.css";

function formatDate(d) {
  return new Date(d).toLocaleDateString();
}

function PostRead({ post, onLike }) {
  return (
    <button
      className={`action-btn${post.liked ? " liked" : ""}`}
      onClick={onLike}
      title="Like"
    >
      <img
        src={post.liked ? heartRed : heartThin}
        className="icon-heart"
        alt="likes"
      />
      <span>{post.likeCount ?? 0}</span>
    </button>
  );
}

function CommentPost({ count }) {
  return (
    <button className="action-btn" title="Comment">
      <img src={commentIcon} className="icon-comment" alt="comments" />
      <span>{count ?? 0}</span>
    </button>
  );
}

function PostWrite({ onDelete }) {
  return (
    <button
      className="trash-btn"
      title="Delete"
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
    >
      <img src={trashIcon} alt="delete" />
    </button>
  );
}

function PostEdit({ onEdit }) {
  return (
    <button
      className="edit-btn"
      title="Edit"
      onClick={(e) => {
        e.stopPropagation();
        onEdit();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
  );
}

export default function PostCard({
  post: initialPost,
  onClick,
  onDelete,
  showDelete,
  onEdit,
  showEdit,
}) {
  const [post, setPost] = useState(initialPost);

  const handleLike = async (e) => {
    e.stopPropagation();
    const data = await postsApi.toggleLike(post.id).catch(() => null);
    if (data)
      setPost((p) => ({ ...p, likeCount: data.likeCount, liked: data.liked }));
  };

  return (
    <div className="post-card" onClick={() => onClick(post)}>
      {post.image ? (
        <img
          src={post.image}
          alt=""
          onError={(e) => (e.target.style.display = "none")}
        />
      ) : (
        <div className="card-placeholder" />
      )}
      <div className="card-body">
        <h3>{post.title}</h3>
        <div className="card-meta">
          By {post.authorId.name} - {formatDate(post.createdAt)}
        </div>
        <div className="card-excerpt">
          {post.description?.substring(0, 80)}
          {post.description?.length > 80 ? "…" : ""}
        </div>
      </div>
      <div className="card-footer">
        <PostRead post={post} onLike={handleLike} />
        <CommentPost count={post.commentCount} />
        {(showEdit || showDelete) && (
          <div className="card-actions">
            {showEdit && <PostEdit onEdit={() => onEdit(post)} />}
            {showDelete && <PostWrite onDelete={() => onDelete(post)} />}
          </div>
        )}
      </div>
    </div>
  );
}
