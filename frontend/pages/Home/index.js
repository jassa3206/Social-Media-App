import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Home.module.css';
import PostItem from '../../components/PostItem';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFollowingPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts/following', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPosts(res.data);
      } catch (err) {
        console.error(err.response?.data?.msg || 'Error fetching posts');
      }
    };

    fetchFollowingPosts();
  }, []);

  return (
    <div className={styles.homeContainer}>
      <h1>Posts from Users You Follow</h1>
      <div className={styles.postsSection}>
        {posts.length > 0 ? (
          posts.map(post => <PostItem key={post._id} post={post} />)
        ) : (
          <p style={{ textAlign: 'center' }}>Follow some users to see posts</p>
        )}
      </div>
    </div>
  );
};

export default Home;
