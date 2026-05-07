const BASE = ""; // vite proxy handles /api → http://localhost:4000

async function apiFetch(path, { headers: extraHeaders, ...rest } = {}) {
  const hasBody = rest.body !== undefined;
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...extraHeaders,
    },
    ...rest,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || `HTTP ${res.status}`);
  }
  return data;
}

// Auth
export const authApi = {
  login: (email, password) =>
    apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, password) =>
    apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  logout: () => apiFetch("/api/auth/logout", { method: "POST" }),
};

// Posts
export const postsApi = {
  list: () => apiFetch("/api/posts"),
  get: (id) => apiFetch(`/api/posts/${id}`),
  create: (title, description, image) =>
    apiFetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, description, image: image || undefined }),
    }),
  update: (id, title, description, image) =>
    apiFetch(`/api/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, description, image: image || undefined }),
    }),
  remove: (id) => apiFetch(`/api/posts/${id}`, { method: "DELETE" }),
  toggleLike: (id) => apiFetch(`/api/posts/${id}/like`, { method: "POST" }),
};

// Comments
export const commentsApi = {
  list: (postId) => apiFetch(`/api/posts/${postId}/comments`),
  add: (postId, content, parentId = null) =>
    apiFetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content, parentId }),
    }),
  remove: (postId, commentId) =>
    apiFetch(`/api/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    }),
};

// Users
export const usersApi = {
  get: (id) => apiFetch(`/api/users/${id}`),
  update: (id, fields) =>
    apiFetch(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(fields),
    }),
  remove: (id) => apiFetch(`/api/users/${id}`, { method: "DELETE" }),
};
