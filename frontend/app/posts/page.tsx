"use client";

import { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
// サーバー側で返されるPostの型
interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  flyer_image?: string;  // 保存される画像パス (例: flyer_images/xxx.jpg)
  location_id: number;
  location?: {
    id: number;
    name: string;
  };
}

// サーバー側で返されるLocationの型
interface Location {
  id: number;
  name: string;
}

export default function PostsPage() {
  // 一覧取得用
  const [posts, setPosts] = useState<Post[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // 新規投稿用
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newLocationId, setNewLocationId] = useState(0);
  const [newFlyerImage, setNewFlyerImage] = useState<File | null>(null);

  // 編集用
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [editingDate, setEditingDate] = useState("");
  const [editingLocationId, setEditingLocationId] = useState(0);
  const [editingFlyerImage, setEditingFlyerImage] = useState<File | null>(null);

  // トークンが必要なら使用。不要なら削除
  const getToken = () => localStorage.getItem("token");

 
  // ===============================
  //  GET: Posts 一覧取得
  // ===============================
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${getToken()}`, // 認証が必要な場合
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      // 例: サーバーは { posts: [...], totalPages: number } を返す
      const data = await response.json();
      setPosts(data.posts); // data.posts
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  },[]);

  // ===============================
  //  GET: Locations 一覧取得
  // ===============================
  const fetchLocations = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      const data = await response.json();
      setLocations(data); // [ { id, name }, ... ]
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  },[]);
  useEffect(() => {
    fetchPosts();
    fetchLocations();
  }, [fetchPosts, fetchLocations]);

  // ===============================
  //  CREATE: 新規投稿
  // ===============================
  const handleAddPost = async () => {
    if (!newTitle.trim() || !newContent.trim() || !newDate || !newLocationId) {
      return;
    }

    // FormData を使って multipart/form-data で送信
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("content", newContent);
    formData.append("date", newDate);
    formData.append("location_id", String(newLocationId));
    if (newFlyerImage) {
      formData.append("flyer_image", newFlyerImage);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        headers: {
          // Content-Type は指定しない: fetch が自動で付与 (boundary含む)
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const created: Post = await response.json();
      // posts に新しい投稿を追加
      setPosts([...posts, created]);

      // フィールドクリア
      setNewTitle("");
      setNewContent("");
      setNewDate("");
      setNewLocationId(0);
      setNewFlyerImage(null);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // ===============================
  //  DELETE: 投稿削除
  // ===============================
  const handleDeletePost = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // 削除成功: ローカルステートから除去
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // ===============================
  //  編集開始
  // ===============================
  const startEditing = (post: Post) => {
    setEditingId(post.id);
    setEditingTitle(post.title);
    setEditingContent(post.content);
    setEditingDate(post.date);
    setEditingLocationId(post.location_id);
    setEditingFlyerImage(null); // 新しい画像を選ぶまでnull
  };

  // ===============================
  //  UPDATE: 投稿編集
  // ===============================
  const handleUpdatePost = async (id: number) => {
    if (
      !editingTitle.trim() ||
      !editingContent.trim() ||
      !editingDate ||
      !editingLocationId
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("title", editingTitle);
    formData.append("content", editingContent);
    formData.append("date", editingDate);
    formData.append("location_id", String(editingLocationId));
    if (editingFlyerImage) {
      formData.append("flyer_image", editingFlyerImage);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updated = await response.json();
      setPosts(posts.map((p) => (p.id === id ? updated : p)));

      // 編集解除 & フィールド初期化
      setEditingId(null);
      setEditingTitle("");
      setEditingContent("");
      setEditingDate("");
      setEditingLocationId(0);
      setEditingFlyerImage(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  // ===============================
  //  JSX描画
  // ===============================
  return (
    <div>
      <h1>Posts</h1>

      {/* =====================
          新規投稿フォーム
         ===================== */}
      <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "2rem" }}>
        <h2>Create New Post</h2>

        {/* Title */}
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>

        {/* Content */}
        <div>
          <label>Content:</label>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
        </div>

        {/* Date */}
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </div>

        {/* Location */}
        <div>
          <label>Location:</label>
          <select
            value={newLocationId}
            onChange={(e) => setNewLocationId(Number(e.target.value))}
          >
            <option value={0}>Select Location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Flyer Image */}
        <div>
          <label>Flyer Image:</label>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setNewFlyerImage(e.target.files[0]);
              }
            }}
          />
        </div>

        <button onClick={handleAddPost}>Add Post</button>
      </div>

      {/* =====================
          投稿リスト
         ===================== */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: "1rem" }}>
            {editingId === post.id ? (
              // 編集モード
              <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
                <h3>Edit Post #{post.id}</h3>

                {/* Title */}
                <div>
                  <label>Title:</label>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  />
                </div>

                {/* Content */}
                <div>
                  <label>Content:</label>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                </div>

                {/* Date */}
                <div>
                  <label>Date:</label>
                  <input
                    type="date"
                    value={editingDate}
                    onChange={(e) => setEditingDate(e.target.value)}
                  />
                </div>

                {/* Location */}
                <div>
                  <label>Location:</label>
                  <select
                    value={editingLocationId}
                    onChange={(e) => setEditingLocationId(Number(e.target.value))}
                  >
                    <option value={0}>Select Location</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Flyer Image (If changing) */}
                <div>
                  <label>Flyer Image (If changing):</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setEditingFlyerImage(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                {/* Buttons */}
                <button onClick={() => handleUpdatePost(post.id)}>Save</button>
                <button
                  onClick={() => {
                    // キャンセル時、編集解除 + 状態リセット
                    setEditingId(null);
                    setEditingTitle("");
                    setEditingContent("");
                    setEditingDate("");
                    setEditingLocationId(0);
                    setEditingFlyerImage(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              // 通常表示モード
              <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p>Date: {post.date}</p>
                <p>
                  Location:{" "}
                  {post.location ? post.location.name : `ID: ${post.location_id}`}
                </p>
                {/* 画像パスがある場合に表示 */}
                {post.flyer_image && (
                  <Image
                    src={`https://stackedstate.com/storage/${post.flyer_image}`}
                    alt="Flyer"
                    style={{ maxWidth: "200px", marginTop: "0.5rem" }}
                  />
                )}
                <button onClick={() => startEditing(post)}>Edit</button>
                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
