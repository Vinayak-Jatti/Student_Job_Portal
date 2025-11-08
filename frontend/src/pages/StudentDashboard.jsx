import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDrives } from '../hooks/useDrives';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../utils/toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DriveCard from '../components/DriveCard';
import SearchAndFilter from '../components/SearchAndFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/api';

const StudentDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { drives, loading } = useDrives();
  const { success, error: showError } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Active');
  const [appliedDriveIds, setAppliedDriveIds] = useState(new Set());
  const [applying, setApplying] = useState(false);
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      const appliedIds = new Set(response.data.map(app => app.driveId?._id || app.driveId));
      setAppliedDriveIds(appliedIds);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleApply = async (driveId) => {
    setApplying(true);
    try {
      await api.post('/applications', { driveId });
      setAppliedDriveIds(new Set([...appliedDriveIds, driveId]));
      success('Application submitted successfully!');
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  // Memoized filtered drives (only active by default for students)
  const filteredDrives = useMemo(() => {
    return drives.filter((drive) => {
      const matchesSearch =
        drive.companyName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        drive.jobRole?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || drive.status === filterStatus;
      const isActive = drive.status === 'Active';
      
      return matchesSearch && matchesStatus && isActive;
    });
  }, [drives, debouncedSearch, filterStatus]);

  // Memoized stats
  const stats = useMemo(() => {
    const activeDrives = drives.filter((d) => d.status === 'Active');
    return {
      totalDrives: drives.length,
      activeDrives: activeDrives.length,
      applied: appliedDriveIds.size,
    };
  }, [drives, appliedDriveIds]);

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
              Welcome back, {user?.name}! 👋
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
                    <p className="text-gray-600 text-sm font-medium">My Applications</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.applied}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📝</span>
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

            {/* Available Drives */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Available Placement Drives ({filteredDrives.length})
              </h2>
              {loading ? (
                <div className="text-center py-12">
                  <LoadingSpinner size="lg" text="Loading drives..." />
                </div>
              ) : filteredDrives.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-gray-600 text-lg">
                    {searchTerm || filterStatus !== 'Active'
                      ? 'No active drives match your search criteria.'
                      : 'No active drives available at the moment.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredDrives.map((drive) => (
                    <DriveCard
                      key={drive._id}
                      drive={drive}
                      onApply={handleApply}
                      isApplied={appliedDriveIds.has(drive._id)}
                      applying={applying}
                    />
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

export default StudentDashboard;
