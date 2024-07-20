import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostItem from './PostItem';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPosts(res.data);
      } catch (err) {
        console.error(err.response?.data?.msg || err.message || 'Error fetching posts');
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPosts(posts.map(post => post._id === postId ? { ...post, likes: res.data } : post));
    } catch (err) {
      console.error(err.response?.data?.msg || err.message || 'Error liking post');
    }
  };

  const handleSave = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/save`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPosts(posts.map(post => post._id === postId ? { ...post, saves: res.data } : post));
    } catch (err) {
      console.error(err.response?.data?.msg || err.message || 'Error saving post');
    }
  };

  const handleComment = async (e, postId) => {
    e.preventDefault();
    const content = e.target[0].value;
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, { content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPosts(posts.map(post => post._id === postId ? { ...post, comments: res.data } : post));
      e.target[0].value = '';
    } catch (err) {
      console.error(err.response?.data?.msg || err.message || 'Error commenting on post');
    }
  };

  return (
    <div>
      {posts.map(post => (
        <PostItem key={post._id} post={post} onLike={handleLike} onSave={handleSave} onComment={handleComment} />
      ))}
    </div>
  );
};

export default PostList;
