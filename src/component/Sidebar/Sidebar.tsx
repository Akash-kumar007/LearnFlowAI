import React, { useState } from 'react';
import { useRole } from '../../context/Rolecontext/Rolecontext';
import { LayoutDashboard, BookOpen, ShieldCheck, Menu, X } from 'lucide-react';
import './Sidebar.css';

export const Sidebar = () => {
  const { role } = useRole();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', roles: ['student', 'instructor', 'admin'] },
    // { label: 'Catalog', path: '/catalog', roles: ['student'] },
    { label: 'Instructor Portal', path: '/instructor', roles: ['instructor'] },
    { label: 'Admin Panel', path: '/admin', roles: ['admin'] },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 📱 Mobile Floating Hamburger Toggle Button */}
      <button 
        className="sidebar-toggle-btn" 
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* 📱 Mobile Dark Backdrop (Outside Click to Close) */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* 🟢 Responsive Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h1 className="sidebar-logo">LMS Portal</h1>
        <nav className="sidebar-nav">
          {menuItems
            .filter((item) => role && item.roles.includes(role))
            .map((item) => (
              <a 
                key={item.path} 
                href={item.path} 
                className="sidebar-link"
                onClick={closeSidebar} // Link click hone par mobile sidebar auto-close ho jayega
              >
                {item.label}
              </a>
            ))}
        </nav>
      </aside>
    </>
  );
};