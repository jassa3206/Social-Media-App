// components/Main.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { UserContext } from '../context/UserContext';
import styles from './Main.module.css'


const Main = () => {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      setUsername('');
      setPassword('');
      setUser(res.data.user);
      router.push('/Profile'); // Redirect to Homepage after successful login
    } catch (err) {
      console.error(err.response?.data?.msg || err.message || 'Login failed'); // Improved error logging
      setError(err.response?.data?.msg || 'Invalid credentials. Please try again.'); // Improved error handling
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', { name, email, username, password, bio });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      setName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setBio('');
      setUser(res.data.user);
      router.push('/Profile'); // Redirect to Homepage after successful registration
    } catch (err) {
      console.error(err.response?.data?.msg || err.message || 'Registration failed'); // Improved error logging
      setError(err.response?.data?.msg || 'Registration failed. Please try again.'); // Improved error handling
    }
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false); // Close register form if open
    setError('');
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false); // Close login form if open
    setError('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>

      <div className={styles.first}>
          
      </div>
      <div className={styles.second}>
      {!showLogin && !showRegister && (
          <div className={styles.LoginOptions}>
            <div >

            <h3>Sign Up Or Log In </h3>
            <p>& Start Sharing quotes</p>
            <button onClick={handleLoginClick} className={styles.buttonn}>Login</button>
            <span>or</span>
            <button onClick={handleRegisterClick} className={styles.buttonn}>Register</button>
            </div>
          </div>
        )}
        {showLogin && (
          <div className={styles.login}>
            {/* Login Form */}
            <div>

            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit} className={styles.form}>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className={styles.button}>Login</button>
            </form>
            <p>Don't has an account? <span onClick={handleRegisterClick}>Register</span></p>
            {error && <p>{error}</p>} {/* Display error message if login fails */}
            </div>
          </div>
        )}
        {showRegister && (
          <div className={styles.register}>
            {/* Register Form */}
            <div>

            <h2>Register</h2>
            <form onSubmit={handleRegisterSubmit } className={styles.form}>
              <input maxLength={50} type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input maxLength={20} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input maxLength={20} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <textarea maxLength="100" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
              <button type="submit" className={styles.button}>Register</button>
            </form>
            <p>Already has an Account? <span onClick={handleLoginClick}>Login</span></p>
            {error && <p>{error}</p>} {/* Display error message if registration fails */}
            </div>
          </div>
        )}
      </div>
      </div>
      <div className="main">
        
        
        
      </div>
    </div>
  );
};

export default Main;
