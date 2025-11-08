import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDrives } from '../hooks/useDrives';
import { useDebounce } from '../hooks/useDebounce';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DriveCard from '../components/DriveCard';
import SearchAndFilter from '../components/SearchAndFilter';
import LoadingSpinner from '../components/LoadingSpinner';

const HodDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { drives, loading } = useDrives();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Memoized filtered drives
  const filteredDrives = useMemo(() => {
    return drives.filter((drive) => {
      const matchesSearch =
        drive.companyName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        drive.jobRole?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || drive.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [drives, debouncedSearch, filterStatus]);

  // Memoized stats
  const stats = useMemo(() => {
    return {
      totalDrives: drives.length,
      activeDrives: drives.filter((d) => d.status === 'Active').length,
      totalStudents: 0, // Would come from students API
    };
  }, [drives]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
              HOD Dashboard - {user?.name} 👨‍💼
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Drives</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalDrives}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💼</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Drives</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activeDrives}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Students</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalStudents}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
            />

            {/* All Drives */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                All Placement Drives ({filteredDrives.length})
              </h2>
              {loading ? (
                <div className="text-center py-12">
                  <LoadingSpinner size="lg" text="Loading drives..." />
                </div>
              ) : filteredDrives.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-gray-600 text-lg">
                    {searchTerm || filterStatus !== 'all'
                      ? 'No drives match your search criteria.'
                      : 'No drives available at the moment.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredDrives.map((drive) => (
                    <DriveCard key={drive._id} drive={drive} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HodDashboard;
