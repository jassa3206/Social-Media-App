import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegHeart } from "react-icons/fa";
import { IoIosHeart } from "react-icons/io";
import { formatDistanceToNow } from 'date-fns';
import styles from './PostItem.module.css';
import { BiComment } from "react-icons/bi";
import { HiMiniHashtag } from "react-icons/hi2";
import { RiSave2Line } from "react-icons/ri";
import { RiSave2Fill } from "react-icons/ri";
const PostItem = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [saves, setSaves] = useState(post.saves);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) {
      if (likes.includes(userId)) {
        setLiked(true);
      }
      if (saves.includes(userId)) {
        setSaved(true);
      }
    }
  }, [likes, saves]);

  const handleLike = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${post._id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // console.log('Response data:', res.data);
      setLikes(res.data);
      setLiked(res.data.includes(userId));
    } catch (err) {
      console.error('Error liking post:', err.response?.data?.msg || err.message);
    }
  };
  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${post._id}/save`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSaves(res.data);
      setSaved(res.data.includes(userId));
    } catch (err) {
      console.error('Error saving post:', err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className={styles.postItem}>
      <div className={styles.hover_main}></div>
      <div className={`${styles.postHeader} w-100`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={post.user.profilePicture} alt="pic" className={styles.profileImage} />
          <p>{post.user.username}</p>
        </div>
        <div className={styles.postDate}>
          <p>{formatDistanceToNow(new Date(post.createdAt))} ago</p>
        </div>
      </div>
      <div className={styles.postContent}>
        <p>{post.content}</p>
      </div>
      {post.hashtags.length > 0 && (
        <div className={`${styles.hashtags} w-100 border-top`}>
          {post.hashtags.map((tag, index) => (
            <span key={index} className={styles.hashtag}>{tag}</span>
          ))}
        </div>
      )}
      <div className={`${styles.postActions} w-100 border-top`}>
        <button onClick={handleLike} className={liked ? styles.liked : ''}>
          {liked ? <IoIosHeart size={27} /> : <FaRegHeart size={27} />}
          <h2>{likes.length}</h2>
        </button>
        <button onClick={handleSave} className={saved ? styles.saved : ''}>
          {saved ? <RiSave2Fill size={27} color='#1DA1F2'/> : <RiSave2Line size={27}/>
          }
        </button>
        <span><BiComment size={27} /></span>
        <span><HiMiniHashtag size={27} /></span>
      </div>
    </div>
  );
};

export default PostItem;
