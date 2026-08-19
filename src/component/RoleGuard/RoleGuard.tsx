import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../context/Rolecontext/Rolecontext';
import { Role } from '../../Types/Index';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, role } = useRole();

  // 1. Agar user logged in hi nahi hai -> Login page par bhejo
  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  // 2. Agar user ka role allowed list me nahi hai -> Dashboard par redirect kar do
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};