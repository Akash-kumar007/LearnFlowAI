import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/Rolecontext/Rolecontext';
import './UserProfileDropdown.css';

export const UserProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // RoleContext se current user data aur logout function pull karein
  const { user, logout } = useRole();

  // Bahar click karne par dropdown band ho jaye
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  // Agar user logged in nahi hai toh profile render na ho
  if (!user) {
    return (
      <button className="login-redirect-btn" onClick={() => navigate('/login')}>
        Login / Register
      </button>
    );
  }

  return (
    <div className="user-profile-container" ref={dropdownRef}>
      {/* Clickable Profile Trigger */}
      <div className="nav-user-profile" onClick={() => setIsOpen(!isOpen)}>
        <span className="user-avatar">👤</span>
        {/* Dynamic Logged-in User Name */}
        <span className="user-name">{user.name}</span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {/* Dropdown Menu Box */}
      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="dropdown-header">
            {/* Dynamic User Details */}
            <p className="dropdown-user-name">{user.name}</p>
            <p className="dropdown-user-role">{user.role ? user.role.toUpperCase() : 'Student'}</p>
            <p className="dropdown-user-email">{user.email}</p>
          </div>
          <div className="dropdown-divider"></div>

          <button onClick={() => { navigate('/dashboard'); setIsOpen(false); }}>
            📊 Student Dashboard
          </button>
          <button onClick={() => { navigate('/instructor'); setIsOpen(false); }}>
            👨‍🏫 Switch to Instructor
          </button>
          <button onClick={() => { navigate('/admin'); setIsOpen(false); }}>
            🛡️ Switch to Admin Panel
          </button>

          <div className="dropdown-divider"></div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};