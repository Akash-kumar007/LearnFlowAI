import React, { useState, useEffect } from 'react';
import { useRole } from '../../context/Rolecontext/Rolecontext'; // Adjust path if needed
import './AdminRoute.css';

// Apne actual components ke path yahan adjust karein
import { Dashboard } from '../../pages/Dashboard/Dashboard'; 
import { InstructorDashboard } from '../Instructor/InstructorDashboard';

const ADMIN_SECRET_KEY = 'admin@1234';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useRole();

  // State initialization
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_access') === 'true';
  });
  
  // Inspect Mode State ('ADMIN' | 'USER' | 'INSTRUCTOR')
  const [inspectRole, setInspectRole] = useState<string>(() => {
    return localStorage.getItem('admin_inspect_role') || 'ADMIN';
  });

  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  // Jab bhi active User badle (ya logout-login ho), tab Passcode status clear ho jaye
  useEffect(() => {
    if (!user) {
      sessionStorage.removeItem('admin_access');
      localStorage.removeItem('admin_inspect_role');
      setIsAuthenticated(false);
      setInspectRole('ADMIN');
    }
  }, [user]);

  // Inspect Role switch handler
  const handleRoleSwitch = (newRole: string) => {
    setInspectRole(newRole);
    localStorage.setItem('admin_inspect_role', newRole);
  };

  // 🔴 Developer Mode Logout / Exit Handler
  const handleLogoutDeveloperMode = () => {
    sessionStorage.removeItem('admin_access');
    localStorage.removeItem('admin_inspect_role');
    setIsAuthenticated(false);
    setInspectRole('ADMIN');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey === ADMIN_SECRET_KEY) {
      sessionStorage.setItem('admin_access', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Galat Passcode! Sirf Developer isay access kar sakta hai.');
    }
  };

  // 1. Agar authenticated nahi hai -> Passcode Form Dikhayein
  if (!isAuthenticated) {
    return (
      <div className="admin-route-container">
        <div className="admin-route-card">
          <h2 className="admin-route-title">🛡️ Developer Authorization</h2>
          <p className="admin-route-subtitle">
            Har baar login hone par Admin Panel access karne ke liye Developer Passcode zaroori hai.
          </p>

          <form onSubmit={handleVerify}>
            <input
              type="password"
              placeholder="Enter Developer Passcode"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="admin-route-input"
              autoFocus
            />
            {error && <p className="admin-route-error">{error}</p>}
            <button type="submit" className="admin-route-btn">
              Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Authenticated hone par Rendering with Floating Admin Bar & Logout Button
  return (
    <div className="admin-route-wrapper">
      {/* Top Floating Inspection Bar */}
      <div className="dev-floating-bar">
        <div className="dev-info-text">
          <span>Inspecting Layout as: <strong>{inspectRole}</strong></span>
        </div>

        <div className="dev-btn-group">
          {inspectRole !== 'ADMIN' ? (
            <button 
              onClick={() => handleRoleSwitch('ADMIN')} 
              className="dev-btn dev-back-admin-btn"
            >
              ⬅️ Back to Admin Panel
            </button>
          ) : (
            <>
              <button 
                onClick={() => handleRoleSwitch('USER')} 
                className="dev-btn dev-switch-btn"
              >
                Inspect User
              </button>
              <button 
                onClick={() => handleRoleSwitch('INSTRUCTOR')} 
                className="dev-btn dev-switch-btn"
              >
                Inspect Instructor
              </button>
            </>
          )}

          {/* 🔴 Exit Developer Access / Logout Button */}
          <button 
            onClick={handleLogoutDeveloperMode}
            className="dev-btn dev-logout-btn"
            title="Lock Admin Panel & Exit"
          >
            Logout Admin
          </button>
        </div>
      </div>

      {/* Main Page Content Area */}
      <div className="dev-content-area">
        {/* Admin Dashboard */}
        {inspectRole === 'ADMIN' && children}
        
        {/* Actual User Dashboard */}
        {inspectRole === 'USER' && <Dashboard />}

        {/* Actual Instructor Dashboard */}
        {inspectRole === 'INSTRUCTOR' && <InstructorDashboard />}
      </div>
    </div>
  );
};