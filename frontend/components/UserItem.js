import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserItem.module.css';

const UserItem = ({ user, currentUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (currentUser.following.includes(user._id)) {
      setIsFollowing(true);
    }
  }, [currentUser, user]);

  const handleFollow = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/users/follow/${user._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIsFollowing(true);
      // Optionally update currentUser's following list in the parent component
    } catch (err) {
      console.error('Error following user:', err.response?.data?.msg || err.message);
    }
  };

  const handleUnfollow = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/users/unfollow/${user._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIsFollowing(false);
      // Optionally update currentUser's following list in the parent component
    } catch (err) {
      console.error('Error unfollowing user:', err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className={styles.userItem}>
      <div className={styles.profileImageContainer}>
        <img src={user.profilePicture} alt="Profile" className={styles.profileImage} />
      </div>
      <div className={styles.userInfo}>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Bio:</strong> {user.bio}</p>
        {isFollowing ? (
          <button onClick={handleUnfollow} className={styles.unfollowButton}>Unfollow</button>
        ) : (
          <button onClick={handleFollow} className={styles.followButton}>Follow</button>
        )}
      </div>
    </div>
  );
};

export default UserItem;
