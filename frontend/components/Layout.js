// frontend/components/Layout.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

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
        } catch (err) {
          console.error(err.response?.data?.msg || 'Error fetching user profile');
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} />
      <main>{children}</main>
      
    </div>
  );
};

export default Layout;
