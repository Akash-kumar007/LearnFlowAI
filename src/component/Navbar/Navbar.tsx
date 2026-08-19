import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../../context/Rolecontext/Rolecontext';
import { useTheme } from 'next-themes';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, setRole, logout } = useRole();
  const { theme, setTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const handleRoleSwitch = (newRole: 'student' | 'instructor' | 'admin') => {
    setRole(newRole);
    if (newRole === 'student') navigate('/dashboard');
    if (newRole === 'instructor') navigate('/instructor');
    if (newRole === 'admin') navigate('/admin');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Original Registered Role
  const userOriginalRole = user?.role || 'student';

  // Capitalize Role for Display (e.g. 'instructor' -> 'Instructor')
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Guest';

  return (
    <nav className="global-navbar">
      <div className="nav-brand">
        <Link to="/dashboard" className="brand-logo">
          LearnFlow<span>AI</span>
        </Link>
      </div>

      <div className="nav-links">
       
      

        {/* Profile / Account Trigger Container */}
        {user && (
          <div className="profile-menu-container" ref={menuRef}>
            <div
              className="nav-user-profile"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span className="user-avatar">👤</span>
              <span className="user-name">{user.name}</span>
              <span className="role-tag-badge">{displayRole}</span>
              <span className="dropdown-arrow">▼</span>
            </div>

            {/* Dropdown Box */}
            {isMenuOpen && (
              <div className="account-dropdown-menu">
                <div className="dropdown-header">
                  <p className="dropdown-user-name">{user.name}</p>
                  <p className="dropdown-user-email">{user.email}</p>
                </div>

                <div className="dropdown-divider"></div>

               

                {/* 2. Role Switcher Section (SIRF ADMIN KO DIKHEGA) */}
                {userOriginalRole === 'admin' && (
                  <>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-section-title">Switch Role</div>
                    <div className="role-switcher-grid">
                      <button
                        className={`role-btn ${role === 'student' ? 'active' : ''}`}
                        onClick={() => handleRoleSwitch('student')}
                      >
                        Student
                      </button>
                      <button
                        className={`role-btn ${role === 'instructor' ? 'active' : ''}`}
                        onClick={() => handleRoleSwitch('instructor')}
                      >
                        Instructor
                      </button>
                      <button
                        className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => handleRoleSwitch('admin')}
                      >
                        Admin
                      </button>
                    </div>
                  </>
                )}


               
                {/* 4. Logout Button */}
                <button
                  className="dropdown-action-item logout-btn"
                  onClick={handleLogout}
                >
                  <span>🚪 Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};