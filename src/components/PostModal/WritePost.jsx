import { useState } from "react";
import { postsApi } from "../../api/api";
import "./PostModal.css";

export default function WritePost({ post, onClose, onSaved }) {
  const [title, setTitle] = useState(post && post.title ? post.title : "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [image, setImage] = useState(post && post.image ? post.image : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = post ? true : false;

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Title and content are required.");
      return;
    }
    setError("");
    setLoading(true);

    const result = isEdit
      ? await postsApi.update(
          post.id,
          title.trim(),
          description.trim(),
          image || undefined,
        )
      : await postsApi.create(
          title.trim(),
          description.trim(),
          image || undefined,
        );
    onSaved(result);

    setLoading(false);
  };

  return (
    <div className="post-overlay">
      <div className="post-modal">
        <div className="post-modal-header">
          <h2>{isEdit ? "Edit Story" : "New Story"}</h2>
          <button className="post-modal-close" onClick={onClose}>
            x
          </button>
        </div>
        <div className="post-modal-body">
          {error && <div className="post-auth-error">{error}</div>}
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your story a title..."
            />
          </div>
          <div className="form-group">
            <label>Story Content</label>
            <textarea
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your story here..."
            />
          </div>
          <div className="form-group">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleImageFile} />
            {image && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={image}
                  alt="preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    borderRadius: 6,
                    display: "block",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-red"
                  style={{ marginTop: 6 }}
                  onClick={() => setImage("")}
                >
                  Remove image
                </button>
              </div>
            )}
          </div>
          <button
            className="btn btn-green"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving…" : isEdit ? "Update Story" : "Publish Story"}
          </button>
        </div>
      </div>
    </div>
  );
}
