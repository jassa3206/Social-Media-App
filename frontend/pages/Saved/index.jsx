import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Saved.module.css';
import PostItem from '../../components/PostItem';

const Saved = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/posts/saved', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setPosts(res.data);
            } catch (err) {
                console.error(err.response?.data?.msg || 'Error fetching saved posts');
            }
        };

        fetchSavedPosts();
    }, []);

    return (
        <div className={styles.exploreContainer}>
            <div className={styles.postlist}>
                <h1>Explore Posts</h1>
                <div className={styles.postsSection}>
                    {posts.length > 0 ? (
                        posts.map(post => <PostItem key={post._id} post={post} />)
                    ) : (
                        <p>No Post is Saved to display</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Saved;

