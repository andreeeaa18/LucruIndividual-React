import { useState, useEffect } from "react";
import { postsApi } from "../../api/api";
import PostCard from "../../components/PostCard/PostCard";
import ReadPost from "../../components/PostModal/ReadPost";
import WritePost from "../../components/PostModal/WritePost";
import { useToast } from "../../components/Toast/Toast";
import "./Home.css";

export default function Home() {
  const showToast = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await postsApi.list().catch(() => []);
    setPosts(data);
    setLoading(false);
  };

  const handleCardClick = async (post) => {
    const full = await postsApi.get(post.id).catch(() => post);
    setSelectedPost(full);
  };

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1>Stories</h1>
        <button className="btn" onClick={() => setShowCreate(true)}>
          + Add Your Story
        </button>
      </div>

      {loading ? (
        <div className="spinner">Loading stories...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">No stories yet. Be the first!</div>
      ) : (
        <div className="posts-grid">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onClick={handleCardClick} />
          ))}
        </div>
      )}

      {selectedPost && (
        <ReadPost
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onUpdated={loadPosts}
        />
      )}

      {showCreate && (
        <WritePost
          post={null}
          onClose={() => setShowCreate(false)}
          onSaved={() => {
            setShowCreate(false);
            showToast("Story published!");
            loadPosts();
          }}
        />
      )}
    </div>
  );
}
