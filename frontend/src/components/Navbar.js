import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          📔 Personal Diary
        </Link>
        {user && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/entries" className="navbar-link">Entries</Link>
            <Link to="/analytics" className="navbar-link">Analytics</Link>
            <span className="navbar-user">Hello, {user.username}</span>
            <button onClick={handleLogout} className="navbar-logout">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

