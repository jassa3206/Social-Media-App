import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Explore.module.css';
import PostItem from '../../components/PostItem';

const Explore = () => {
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
        console.error(err.response?.data?.msg || 'Error fetching posts');
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className={styles.exploreContainer}>
      <div className={styles.postlist}>
      <h1>Explore Posts</h1>
      <div className={styles.postsSection}>
        {posts.length > 0 ? (
          posts.map(post => <PostItem key={post._id} post={post} />)
        ) : (
          <p>No posts to display</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default Explore;

