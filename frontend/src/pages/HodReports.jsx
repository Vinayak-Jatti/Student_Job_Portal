import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../utils/toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/api';

const HodReports = () => {
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStatistics();
    }
  }, [isAuthenticated]);

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/reports/department');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      showError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await api.get('/reports/export/excel?type=department', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `department-report-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      success('Report exported successfully!');
    } catch (error) {
      showError('Failed to export report');
    }
  };

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Department Statistics & Reports</h1>
              <button
                onClick={handleExportExcel}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                📊 Export Excel Report
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" text="Loading statistics..." />
              </div>
            ) : stats ? (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Total Students</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                          {stats.totalStudents}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">👥</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Approved Students</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                          {stats.approvedStudents}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">✅</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Pending Approvals</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                          {stats.pendingApprovals}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">⏳</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Total Applications</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                          {stats.totalApplications}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📝</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-gray-600 text-sm font-medium mb-2">Selected Applications</p>
                    <p className="text-3xl font-bold text-green-600">{stats.selectedApplications}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-gray-600 text-sm font-medium mb-2">Rejected Applications</p>
                    <p className="text-3xl font-bold text-red-600">{stats.rejectedApplications}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-gray-600 text-sm font-medium mb-2">Pending Applications</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingApplications}</p>
                  </div>
                </div>

                {/* Offers Extended */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Offers Extended</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        {stats.offersExtended}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🎉</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No statistics available.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HodReports;

