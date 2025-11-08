import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../utils/toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/api';
import { useDrives } from '../hooks/useDrives';

const TpoReports = () => {
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const { drives } = useDrives();
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [driveStats, setDriveStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDrive) {
      fetchDriveStats();
    }
  }, [selectedDrive]);

  const fetchDriveStats = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/reports/drive/${selectedDrive}`);
      setDriveStats(response.data);
    } catch (error) {
      console.error('Error fetching drive statistics:', error);
      showError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async (type, driveId) => {
    try {
      const response = await api.get(`/reports/export/excel?type=${type}&driveId=${driveId || ''}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report-${Date.now()}.xlsx`);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Reports & Analytics</h1>

            {/* Drive Selection */}
            <div className="mb-6 bg-white rounded-xl shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Drive for Report
              </label>
              <div className="flex gap-3">
                <select
                  value={selectedDrive || ''}
                  onChange={(e) => setSelectedDrive(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Select a drive</option>
                  {drives.map((drive) => (
                    <option key={drive._id} value={drive._id}>
                      {drive.companyName} - {drive.jobRole}
                    </option>
                  ))}
                </select>
                {selectedDrive && (
                  <button
                    onClick={() => handleExportExcel('drive', selectedDrive)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    📊 Export Excel
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" text="Loading statistics..." />
              </div>
            ) : driveStats ? (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                    <p className="text-gray-600 text-sm font-medium">Total Applications</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {driveStats.totalApplications}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                    <p className="text-gray-600 text-sm font-medium">Selected</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{driveStats.selected}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                    <p className="text-gray-600 text-sm font-medium">Rejected</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{driveStats.rejected}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                    <p className="text-gray-600 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{driveStats.pending}</p>
                  </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      Applications for {driveStats.companyName} - {driveStats.jobRole}
                    </h2>
                  </div>
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="w-full min-w-[640px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Student Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Current Round
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Package
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {driveStats.applications.map((app, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {app.studentName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {app.studentEmail}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  app.status === 'Selected' || app.status === 'Offer Extended'
                                    ? 'bg-green-100 text-green-800'
                                    : app.status === 'Rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {app.currentRound}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {app.packageOffered || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">Select a drive to view statistics.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TpoReports;

