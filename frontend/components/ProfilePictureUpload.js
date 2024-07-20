// ProfilePictureUpload.js
import React, { useState } from 'react';
import axios from 'axios';

const ProfilePictureUpload = ({ user, setUser }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError(err.response?.data?.msg || 'Server error');
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFileChange} />
        <button type="submit">{user.profilePicture ? 'Change Profile Picture' : 'Add Profile Picture'}</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
    </div>
  );
};

export default ProfilePictureUpload;
