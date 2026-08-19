import React, { useState } from 'react';
import { useRole } from '../../context/Rolecontext/Rolecontext';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../Types/Index';
import './Login.css';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [error, setError] = useState('');

  // Custom Styled Alert State
  const [alertData, setAlertData] = useState<{ title: string; message: string; icon: string } | null>(null);

  const { login, register } = useRole();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!name || !email || !password) {
        setError('Please fill in all fields!');
        return;
      }

      const res = register(name, email, password, role);

      if (res.success) {
        const newUser = {
          id: `usr_${Date.now()}`,
          name: name,
          email: email,
          role: role || 'student',
          status: 'Active',
          isNew: true,
          registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const userExists = existingUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (userExists) {
          setError('This email is already registered!');
          return;
        }

        localStorage.setItem('registered_users', JSON.stringify([...existingUsers, newUser]));
        localStorage.setItem('user_session', JSON.stringify(newUser));

        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } else {
      // ==========================================
      // HANDLE LOGIN (STUDENT & INSTRUCTOR CHECKS)
      // ==========================================
      if (!email || !password) {
        setError('Please enter email and password!');
        return;
      }

      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const existingUser = existingUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase()
      );

      // Check if non-admin user
      const isNotAdmin = existingUser && existingUser.role?.toLowerCase() !== 'admin';

      // 1. ENGLISH ALERT: Blocked Account Check
      if (isNotAdmin && (existingUser.status === 'Blocked' || existingUser.isBlocked)) {
        setAlertData({
          icon: '⛔',
          title: 'Account Blocked',
          message: 'Your account has been blocked by the Administrator. You are not allowed to log in. Please contact support or your Admin.'
        });
        setError('Your account has been blocked by Admin.');
        return;
      }

      // 2. ENGLISH ALERT: Deleted Account Check
      if (!existingUser) {
        // Attempt login via Context in case Admin isn't in local array
        const res = login(email, password);
        if (res.success && res.user?.role === 'admin') {
          localStorage.setItem('user_session', JSON.stringify(res.user));
          navigate('/dashboard');
          return;
        }

        setAlertData({
          icon: '🚨',
          title: 'Account Not Found',
          message: 'Your account has been deleted or does not exist. Please register a new account to continue.'
        });
        setError('Account deleted or does not exist.');
        return;
      }

      // Proceed normal login
      const res = login(email, password);
      if (res.success) {
        localStorage.setItem('user_session', JSON.stringify(existingUser));
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-brand">
            LearnFlow<span>AI</span>
          </h1>
          <p className="login-subtitle">
            {isRegister ? 'Create a new account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`login-tab-btn ${isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Register As</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. randomuser@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit-btn">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p
          className="login-toggle-text"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
        >
          {isRegister
            ? 'Already have an account? Sign In'
            : 'New User? Please Register Account'}
        </p>
      </div>

      {/* Custom Styled Alert Modal */}
      {alertData && (
        <div className="alert-overlay">
          <div className="alert-modal">
            <div className="alert-icon">{alertData.icon}</div>
            <h3 className="alert-title">{alertData.title}</h3>
            <p className="alert-message">{alertData.message}</p>
            <button className="alert-btn" onClick={() => setAlertData(null)}>
              Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};