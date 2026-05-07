import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { postsApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import PostCard from "../../components/PostCard/PostCard";
import { useToast } from "../../components/Toast/Toast";
import profileIcon from "../../assets/icons/profile-svgrepo-com (2).svg";
import "./Profile.css";
import ReadPost from "../../components/PostModal/ReadPost";
import WritePost from "../../components/PostModal/WritePost";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyPosts();
  }, [user?.id]);

  const loadMyPosts = async () => {
    setLoading(true);
    const all = await postsApi.list().catch(() => []);
    const mine = all.filter((p) => p.authorId?.id === user?.id);
    setPosts(mine);
    setLoading(false);
  };

  const handleDelete = async (post) => {
    if (!confirm("Delete this story permanently?")) return;
    try {
      await postsApi.remove(post.id);
      showToast("Story deleted!");
      loadMyPosts();
    } catch {
      showToast("Error deleting story");
    }
  };

  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleCardClick = async (post) => {
    const full = await postsApi.get(post.id).catch(() => post);
    setSelectedPost(full);
  };

  return (
    <>
      <div className="user-banner">
        <div className="user-banner-inner">
          <h2>
            <img src={profileIcon} alt="" />
            {user?.name}
          </h2>
          <p>Your published stories</p>
        </div>
      </div>

      <div className="page-wrap">
        <div className="page-header" style={{ marginBottom: "1rem" }}>
          <h1>My Stories</h1>
          <button className="btn" onClick={() => navigate("/")}>
            + Add New Story
          </button>
        </div>

        {loading ? (
          <div className="spinner">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            No stories yet.
            <br />
            <br />
          </div>
        ) : (
          <div className="profile-posts-grid">
            {posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                onClick={handleCardClick}
                showDelete
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {selectedPost && (
        <ReadPost
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onUpdated={loadMyPosts}
        />
      )}

      {showCreate && (
        <WritePost
          post={null}
          onClose={() => setShowCreate(false)}
          onSaved={() => {
            setShowCreate(false);
            showToast("Story published!");
            loadMyPosts();
          }}
        />
      )}
    </>
  );
}
