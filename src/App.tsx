import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { RoleProvider, useRole } from './context/Rolecontext/Rolecontext';
import { Layout } from './component/Layout/Layout';
import { Login } from './pages/Login/Login';

// Pages & Components
import { Dashboard } from './pages/Dashboard/Dashboard';
// import { Catalog } from './pages/Catalog/Catalog';
import { AIChat } from './component/AIChat/AIChat';
import { CourseDetail } from './component/CourseDetails/CourseDetails';
import { Quiz } from './component/Quiz/Quiz';
import { Certificate } from './component/Certificate/Certificate';
import { CertificateView } from './component/Student/CertificateView';
import { AdminPortal } from './component/Portals/AdminPortal';
import { InstructorPortal } from './component/Portals/InstructorPortal';
import { InstructorDashboard } from './component/Instructor/InstructorDashboard';

// 👇 Secret Admin Passcode Lock Route Import
import { AdminRoute } from './component/AdminRoute/AdminRoute'; // Path apne component folder ke according check kar lena

// Helper Component: Restrict Routes based on User Role
function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: JSX.Element;
}) {
  const { role } = useRole();

  // Agar user ka role allowed list me nahi hai -> Dashboard par wapas bhejo
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Main Navigation / Protected App Logic
function AppRoutes() {
  const { user, role } = useRole();

  // 1. Unauthenticated View (Agar User logged in NAHI hai)
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 2. Authenticated View (Agar User logged in hai)
  return (
    <Layout>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />

        {/* Dynamic Role-Based Dashboard */}
        <Route
          path="/dashboard"
          element={
            role === "instructor" ? (
              <InstructorDashboard />
            ) : role === "admin" ? (
              <AdminRoute>
                <AdminPortal />
              </AdminRoute>
            ) : (
              <Dashboard />
            )
          }
        />

        {/* Student & General Routes (Available for All Logged-in Users) */}
        {/* <Route path="/catalog" element={<Catalog />} /> */}
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/aichat" element={<AIChat />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/certificates" element={<CertificateView />} />
        <Route path="/certificate/:id" element={<Certificate />} />

        {/* Instructor Routes (Sirf Instructor aur Admin ke liye accessible) */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute allowedRoles={["instructor", "admin"]}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructorportal"
          element={
            <ProtectedRoute allowedRoles={["instructor", "admin"]}>
              <InstructorPortal />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes (Passcode Verified Admin Access Only) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminRoute>
                <AdminPortal />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminportal"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminRoute>
                <AdminPortal />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* Fallback for Unknown Routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

// Master App Component
export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <RoleProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </RoleProvider>
    </ThemeProvider>
  );
}