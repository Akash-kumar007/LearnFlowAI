import React, { useState, useEffect } from 'react';
import { mockCourses } from '../../Mock/Mock';
import './Portal.css';

interface PendingCourse {
  id: string;
  title: string;
  instructor: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin';
  status: 'Active' | 'Blocked';
  isNew?: boolean;
  registeredAt?: string;
}

export const AdminPortal: React.FC = () => {
  // Real-time Pending Courses State (Starts empty or loads from localStorage)
  const [pendingCourses, setPendingCourses] = useState<PendingCourse[]>(() => {
    const savedCourses = localStorage.getItem('app_pending_courses');
    return savedCourses ? JSON.parse(savedCourses) : [];
  });

  // Real-time Users State (Loads registered users dynamically from localStorage)
  const [users, setUsers] = useState<RegisteredUser[]>(() => {
    const savedUsers = localStorage.getItem('registered_users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // Sync users state changes back to localStorage
  useEffect(() => {
    localStorage.setItem('registered_users', JSON.stringify(users));
  }, [users]);

  // Sync pending courses changes to localStorage
  useEffect(() => {
    localStorage.setItem('app_pending_courses', JSON.stringify(pendingCourses));
  }, [pendingCourses]);

  const handleStatusChange = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setPendingCourses(prev =>
      prev.map(course => (course.id === id ? { ...course, status: newStatus } : course))
    );
  };

  const toggleUserBlock = (id: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u))
    );
  };

  // Delete User ID so they are forced to re-register when trying to login
  const handleDeleteUser = (id: string, userName: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${userName}? Their account will be deleted and they will be forced to register again on next login attempt.`
    );

    if (confirmDelete) {
      setUsers(prev => {
        const updatedUsers = prev.filter(u => u.id !== id);
        localStorage.setItem('registered_users', JSON.stringify(updatedUsers));
        return updatedUsers;
      });

      // Clear current session if the admin deletes their own active account ID
      const currentUser = JSON.parse(localStorage.getItem('user_session') || '{}');
      if (currentUser?.id === id) {
        localStorage.removeItem('user_session');
      }

      alert(`${userName}'s registration record has been removed.`);
    }
  };

  // Mark new user as reviewed/acknowledged
  const markAsReviewed = (id: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, isNew: false } : u))
    );
  };

  // Dynamic Calculations based on Real Registered Users
  const totalUsersCount = users.length;
  const activeCoursesCount = mockCourses.length + pendingCourses.filter(c => c.status === 'Approved').length;
  const newRegistrations = users.filter(u => u.isNew);

  return (
    <div className="portal-container">
      <h2>🛡️ Admin Management Panel</h2>
      <p className="portal-subtitle">Real-time overview of platform users, moderation, and course approvals.</p>

      {/* Dynamic Real-Time Metrics */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Registered Users</span>
          <h3>{totalUsersCount}</h3>
        </div>
        <div className="admin-stat-card">
          <span>New Registrations</span>
          <h3 style={{ color: '#38bdf8' }}>{newRegistrations.length}</h3>
        </div>
        <div className="admin-stat-card">
          <span>Active & Pending Courses</span>
          <h3>{activeCoursesCount}</h3>
        </div>
      </div>

      {/* RECENT NEW USER REGISTRATIONS ALERT */}
      {newRegistrations.length > 0 && (
        <>
          <h3 className="section-title">🆕 Recent New User Registrations</h3>
          <div className="portal-card course-approval-card" style={{ borderLeft: '4px solid #38bdf8' }}>
            <div className="course-list">
              {newRegistrations.map((newUser) => (
                <div key={newUser.id} className="course-item" style={{ alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 className="course-title" style={{ margin: 0 }}>{newUser.name}</h4>
                      <span className="role-badge" style={{ fontSize: '0.75rem' }}>{newUser.role}</span>
                      <span className="status-badge pending" style={{ fontSize: '0.7rem' }}>NEW</span>
                    </div>
                    <p className="course-instructor" style={{ margin: '4px 0 0 0' }}>
                      Email: {newUser.email} • Registered: {newUser.registeredAt || 'Just now'}
                    </p>
                  </div>

                  <div className="course-actions-wrapper" style={{ gap: '8px' }}>
                    <button 
                      onClick={() => markAsReviewed(newUser.id)} 
                      className="btn-approve"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    >
                      Acknowledge
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(newUser.id, newUser.name)} 
                      className="btn-reject"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    >
                      Delete & Force Re-Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Course Approvals */}
      <h3 className="section-title">Course Approvals</h3>
      <div className="portal-card course-approval-card">
        {pendingCourses.length === 0 ? (
          <p style={{ color: '#a1a1aa', margin: 0 }}>No pending courses for approval.</p>
        ) : (
          <div className="course-list">
            {pendingCourses.map((course) => (
              <div key={course.id} className="course-item">
                <div>
                  <h4 className="course-title">{course.title}</h4>
                  <p className="course-instructor">Instructor: {course.instructor}</p>
                </div>
                <div className="course-actions-wrapper">
                  <span className={`status-badge ${course.status.toLowerCase()}`}>
                    {course.status}
                  </span>
                  {course.status === 'Pending' && (
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleStatusChange(course.id, 'Approved')} 
                        className="btn-approve"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusChange(course.id, 'Rejected')} 
                        className="btn-reject"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Registered Users Table */}
      <h3 className="section-title">All Registered Users ({users.length})</h3>
      <div className="portal-card table-card">
        {users.length === 0 ? (
          <p style={{ color: '#a1a1aa', padding: '16px', margin: 0, textAlign: 'center' }}>
            No registered users found. New registrations will automatically appear here.
          </p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="user-name">
                    {user.name} {user.isNew && <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 'bold' }}>(NEW)</span>}
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td>
                    <span className="role-badge">{user.role}</span>
                  </td>
                  <td>
                    <span className={`user-status ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => toggleUserBlock(user.id)}
                        className={`btn-toggle-block ${user.status.toLowerCase()}`}
                      >
                        {user.status === 'Active' ? 'Block' : 'Unblock'}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="btn-reject"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      >
                        Delete ID
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* System Status */}
      <h3 className="section-title">System Status</h3>
      <div className="portal-card">
        <div className="system-status-row">
          <span>Registration Service</span>
          <span className="status-badge online">Active</span>
        </div>
        <div className="system-status-row">
          <span>Database Sync</span>
          <span className="status-badge online">Healthy</span>
        </div>
      </div>
    </div>
  );
};