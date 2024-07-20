import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import profilePlaceholder from './profile-picture-placeholder.png';
import PostItem from '../../components/PostItem';
import UserItem from '../../components/UserItem';
import styles from './Profile.module.css';
import { IoClose } from "react-icons/io5";
import { MdGridOn } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa6";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPosts, setShowPosts] = useState(true);
  const [showLikedPosts, setShowLikedPosts] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      fetchUserPosts();
      fetchUserFollowing();
      fetchUserFollowers();
      fetchUserLikedPosts();

    }
  }, [user, router]);

  
 
  const fetchUserPosts = async (page = 1) => {
    try {
      setLoadingPosts(true);
      const res = await axios.get(`http://localhost:5000/api/posts/user/${user._id}`, {
        params: { page, limit: 10 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (page === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...res.data.posts]);
      }
      setHasMore(res.data.hasMore);
      setLoadingPosts(false);
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error fetching user posts');
      setLoadingPosts(false);
    }
  };

  const fetchUserLikedPosts = async () => {
    
          try {
              const res = await axios.get('http://localhost:5000/api/posts/Liked', {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
              });
              setLikedPosts(res.data);
          } catch (err) {
              console.error(err.response?.data?.msg || 'Error fetching Liked posts');
          }
      };

     
  

  
  const loadMorePosts = () => {
    if (hasMore) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchUserPosts(nextPage);
        return nextPage;
      });
    }
  };


  const fetchUserFollowing = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${user._id}/following`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFollowing(res.data);
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error fetching following list');
    }
  };

  const fetchUserFollowers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${user._id}/followers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFollowers(res.data);
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error fetching followers list');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  const handleShowFollowing = () => {
    setShowFollowing(true);
    setShowFollowers(false);
  };

  const handleShowFollowers = () => {
    setShowFollowers(true);
    setShowFollowing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const profilePictureUrl = user.profilePicture || profilePlaceholder;

  const handleClose = () => {
    setShowFollowers(false)
    setShowFollowing(false)
    setShowEditProfile(false)
  }
  const handleShowPosts = () => {
    setShowLikedPosts(false)
    setShowPosts(true)
  }
  const handleShowLikedPosts = () => {
    setShowPosts(false)
    setShowLikedPosts(true)
  }
  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create a preview of the selected file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/users/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUser(res.data);
      setPreview(null); // Reset preview after successful upload
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError(err.response?.data?.msg || 'Server error');
    }
  };
  return (
    <>
      {showFollowers || showFollowing ? <div className={styles.blurBackground}></div> : null}
      {showEditProfile ? <div className={styles.blurBackground}></div> : null}
      <div className={styles.main}>
        <div className={styles.profileIndex}>
          <div>
            <img
              src={profilePictureUrl}
              alt="Profile"
              className={styles.profileImage}
            />
          </div>
          <div className={styles.profileABC}>
            <div className={styles.profileButtons}>
              <h2 className={styles.profileName}>{user.username || 'Guest'}</h2>
              <button onClick={() => setShowEditProfile(true)}>Change Profile</button>
              <button className={styles.editProfileButton}  >Edit Profile</button>
              <button className={styles.logoutButton}  onClick={handleLogout}>Logout</button>
              {showEditProfile &&
                <div className={styles.change_profile_box}>
                  <div className={styles.closediv}>
                    <div className={styles.edit}>
                      <div className={styles.closediv}>
                        <IoClose onClick={handleClose}  color='white' size={27} className={styles.close} />
                      </div>
                      <div>
                        <div>
                          <form className={styles.form} onSubmit={onSubmit}>
                            <input
                              type="file"
                              onChange={onFileChange}
                              className={styles.hiddenInput}
                              id="fileInput"
                            />
                            <button
                              type="button"
                              className={styles.btn}
                              onClick={() => document.getElementById('fileInput').click()}
                            >
                              Choose File
                            </button>
                            {preview && (
                              <div>
                                <img className={styles.Preview} src={preview} alt="Profile Preview" />
                              </div>
                            )}
                            <button type="submit" className={styles.btn}>
                              {user.profilePicture ? 'Change Profile Picture' : 'Add Profile Picture'}
                            </button>
                          </form>
                          {error && <div style={{ color: 'red' }}>{error}</div>}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>
            <div className={styles.userLength}>
              <h3><span>{posts.length}</span> posts</h3>
              <h3 onClick={handleShowFollowers}><span>{followers.length}</span> followers</h3>
              <h3 onClick={handleShowFollowing}><span>{following.length}</span> following</h3>
              <div className={styles.followers_following}>
                {showFollowing && (
                  <div className={styles.followSection}>
                    <div className={styles.closediv}>
                      <IoClose onClick={handleClose} color='white' size={27} className={styles.close} />
                    </div>
                    <div className={styles.followerTitle}>

                      <h3 onClick={handleShowFollowers}>followers</h3>
                      <h3><b>following</b></h3>

                    </div>
                    <div className={styles.followList}>

                      {following.length > 0 ? (
                        following.map(followingUser => <UserItem key={followingUser._id} user={followingUser} currentUser={user} />)
                      ) : (
                        <p>No users to display</p>
                      )}
                    </div>
                  </div>
                )}
                {showFollowers && (
                  <div className={styles.followSection}>
                    <div className={styles.closediv}>
                      <IoClose onClick={handleClose} color='white' size={27} className={styles.close} />
                    </div>
                    <div className={styles.followerTitle}>
                      <h3  ><b>followers</b></h3>
                      <h3 onClick={handleShowFollowing}>following</h3>
                    </div>
                    <div className={styles.followList}>
                      {followers.length > 0 ? (
                        followers.map(follower => <UserItem key={follower._id} user={follower} currentUser={user} />)
                      ) : (
                        <p>No users to display</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.userName}>
              <h3>{user.name || 'Guest'}</h3>
              <p>{user.bio}</p>
            </div>
          </div>
        </div>
        <div className={styles.Post}>
          <div className={styles.option}>
            <div onClick={handleShowPosts}>
              <MdGridOn size={27} color='white' />
              <h3>posts</h3>
            </div>
            <div onClick={handleShowLikedPosts}>
              <FaRegHeart size={27} color='white' />
              <h3>likes</h3>
            </div>
          </div>
          {showPosts && (
            <>
              <div className={styles.post}>
                <div className={styles.postlist}>
                  {posts.length > 0 ? (
                    posts.map(post => <PostItem key={post._id} post={post} />)
                  ) : (
                    <p>No posts to display</p>
                  )}
                  {loadingPosts && <span className={styles.loader}></span>}
                  {hasMore && !loadingPosts && (
                    <button onClick={loadMorePosts}>Load More</button>
                  )}


                </div>
              </div></>)}
              {showLikedPosts && (
            <>
              <div className={styles.post}>
                <div className={styles.postlist}>
                  {likedPosts.length > 0 ? (
                    likedPosts.map(post => <PostItem key={post._id} post={post} />)
                  ) : (
                    <p>No posts to display</p>
                  )}
                  {loadingPosts && <span className={styles.loader}></span>}
                  {hasMore && !loadingPosts && (
                    <button onClick={loadMorePosts}>Load More</button>
                  )}


                </div>
              </div></>)}
        </div>
      </div>
    </>
  );
};
export default Profile;