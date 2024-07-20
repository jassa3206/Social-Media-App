import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/posts', { content }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setContent('');
      onPostCreated(res.data);
    } catch (err) {
      console.error(err.response?.data?.msg || err.message || 'Error creating post');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Share your quote..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default CreatePost;
