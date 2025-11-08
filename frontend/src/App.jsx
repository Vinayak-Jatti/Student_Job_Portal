import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './utils/toast';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for better SPA performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const HodDashboard = lazy(() => import('./pages/HodDashboard'));
const TpoDashboard = lazy(() => import('./pages/TpoDashboard'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const StudentApplications = lazy(() => import('./pages/StudentApplications'));
const TpoApplications = lazy(() => import('./pages/TpoApplications'));
const HodStudentApprovals = lazy(() => import('./pages/HodStudentApprovals'));
const HodReports = lazy(() => import('./pages/HodReports'));
const TpoReports = lazy(() => import('./pages/TpoReports'));
const TpoDriveManagement = lazy(() => import('./pages/TpoDriveManagement'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <LoadingSpinner size="lg" text="Loading application..." />
                </div>
              }
            >
              <Routes>
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/student"
                  element={
                    <ProtectedRoute>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/hod"
                  element={
                    <ProtectedRoute>
                      <HodDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/tpo"
                  element={
                    <ProtectedRoute>
                      <TpoDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/student/resume"
                  element={
                    <ProtectedRoute>
                      <ResumeBuilder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/student/profile"
                  element={
                    <ProtectedRoute>
                      <StudentProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/student/applications"
                  element={
                    <ProtectedRoute>
                      <StudentApplications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/student/drives"
                  element={
                    <ProtectedRoute>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/hod/drives"
                  element={
                    <ProtectedRoute>
                      <HodDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/hod/statistics"
                  element={
                    <ProtectedRoute>
                      <HodReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/tpo/students"
                  element={
                    <ProtectedRoute>
                      <TpoDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/tpo/applications"
                  element={
                    <ProtectedRoute>
                      <TpoApplications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/hod/students"
                  element={
                    <ProtectedRoute>
                      <HodStudentApprovals />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/hod/reports"
                  element={
                    <ProtectedRoute>
                      <HodReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/tpo/reports"
                  element={
                    <ProtectedRoute>
                      <TpoReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/tpo/drives"
                  element={
                    <ProtectedRoute>
                      <TpoDriveManagement />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route 
                  path="*" 
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
                        <a
                          href="/dashboard"
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Go to Dashboard
                        </a>
                      </div>
                    </div>
                  } 
                />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
