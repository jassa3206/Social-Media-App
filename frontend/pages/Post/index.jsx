import React, { useState } from 'react';
import axios from 'axios';
import styles from './Post.module.css';

export default function Post() {
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Split hashtags by space, add # if missing, and limit to 10
    const hashtagArray = hashtags.split(' ')
      .filter(tag => tag.trim() !== '') // Remove empty tags
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`) // Ensure each tag starts with #
      .slice(0, 10); // Limit to 10 hashtags

    console.log('Hashtags input:', hashtags);
    console.log('Processed hashtag array:', hashtagArray);

    try {
      const res = await axios.post('http://localhost:5000/api/posts', { content, hashtags: hashtagArray }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setContent('');
      setHashtags('');
      console.log('Post created:', res.data); // Log the created post data
    } catch (err) {
      console.error(err.response?.data?.msg || err.message || 'Error creating post');
    }
  };

  return (
    <div className={styles.Post}>
      <div className={styles.box}>
        <div>
          <h2>Create a Post</h2>
        </div>
        <div >
          <form className={styles.postBody} onSubmit={handleSubmit}>
            <input
              type="text"
              maxLength={400}
              placeholder="Share your quote..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              height={200}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Add hashtags separated by space (e.g. #quote #life)"
              value={hashtags}
              className={styles.hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
            <p>Hashtags: {hashtags}</p>
            <button type="submit" className={styles.button}>Post</button>
          </form>
        </div>
      </div>
    </div>
  );
}
