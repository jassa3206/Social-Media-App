import React, { useState, useContext } from 'react';
import axios from 'axios';
import UserItem from '../../components/UserItem';
import { UserContext } from '../../context/UserContext';
// import styles from './Search.module.css';
import styles from '../Explore/Explore.module.css'
export default function Search() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { user: currentUser } = useContext(UserContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/api/users/search?query=${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error searching users');
    }
  };

  return (
    <div className={styles.searchContainer} >
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.resultsSection}>
        {users.length > 0 ? (
          users.map(user => <UserItem key={user._id} user={user} currentUser={currentUser} />)
        ) : (
          <p style={{ textAlign: 'center', padding: '10px 60px 10px 0' }}>No users found</p>
        )}
      </div>
    </div>
  );
}
