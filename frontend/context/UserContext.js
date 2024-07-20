// frontend/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.msg || 'Error fetching user profile');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
