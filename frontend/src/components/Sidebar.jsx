import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const studentMenu = [
    { path: '/dashboard/student', label: 'Dashboard', icon: '📊' },
    { path: '/dashboard/student/profile', label: 'My Profile', icon: '👤' },
    { path: '/dashboard/student/drives', label: 'Available Drives', icon: '💼' },
    { path: '/dashboard/student/resume', label: 'Resume Builder', icon: '📄' },
    { path: '/dashboard/student/applications', label: 'My Applications', icon: '📝' },
  ];

  const hodMenu = [
    { path: '/dashboard/hod', label: 'Dashboard', icon: '📊' },
    { path: '/dashboard/hod/students', label: 'Student Approvals', icon: '✅' },
    { path: '/dashboard/hod/drives', label: 'All Drives', icon: '💼' },
    { path: '/dashboard/hod/statistics', label: 'Statistics', icon: '📈' },
    { path: '/dashboard/hod/reports', label: 'Reports', icon: '📊' },
  ];

  const tpoMenu = [
    { path: '/dashboard/tpo', label: 'Dashboard', icon: '📊' },
    { path: '/dashboard/tpo/drives', label: 'Manage Drives', icon: '💼' },
    { path: '/dashboard/tpo/applications', label: 'Applications', icon: '📝' },
    { path: '/dashboard/tpo/reports', label: 'Reports', icon: '📊' },
  ];

  const getMenu = () => {
    if (user?.role === 'student') return studentMenu;
    if (user?.role === 'hod') return hodMenu;
    if (user?.role === 'tpo') return tpoMenu;
    return [];
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-30 p-2 bg-white rounded-lg shadow-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isMobileOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static lg:translate-x-0 z-30 w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 capitalize">
            {user?.role} Portal
          </h2>
          <nav className="space-y-2">
            {getMenu().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

