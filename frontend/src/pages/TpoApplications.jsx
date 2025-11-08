import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../utils/toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import ResumeFilter from '../components/ResumeFilter';
import api from '../api/api';

const TpoApplications = () => {
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [statusData, setStatusData] = useState({
    status: '',
    currentRound: '',
    remarks: '',
  });
  const [offerData, setOfferData] = useState({
    packageOffered: '',
    offerLetterFile: null,
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDrives();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedDrive) {
      fetchApplications();
    }
  }, [selectedDrive]);

  const fetchDrives = async () => {
    try {
      const response = await api.get('/drives');
      setDrives(response.data);
      if (response.data.length > 0) {
        setSelectedDrive(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get(`/applications/drive/${selectedDrive}`);
      setApplications(response.data);
      setFilteredApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      showError('Failed to load applications');
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await api.put(`/applications/${selectedApplication._id}/status`, statusData);
      success('Application status updated successfully!');
      setShowStatusModal(false);
      setSelectedApplication(null);
      setStatusData({ status: '', currentRound: '', remarks: '' });
      fetchApplications();
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to update status');
    }
  };

  const handleUploadOffer = async () => {
    if (!offerData.offerLetterFile) {
      showError('Please select an offer letter file');
      return;
    }

    setUploading(true);
    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', offerData.offerLetterFile);

      const uploadResponse = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Update application with offer letter
      await api.put(`/applications/${selectedApplication._id}/offer-letter`, {
        offerLetterUrl: uploadResponse.data.fileUrl,
        offerLetterFileName: uploadResponse.data.fileName,
        packageOffered: offerData.packageOffered,
      });

      success('Offer letter uploaded successfully!');
      setShowOfferModal(false);
      setSelectedApplication(null);
      setOfferData({ packageOffered: '', offerLetterFile: null });
      fetchApplications();
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to upload offer letter');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Applied: 'bg-blue-100 text-blue-800',
      Shortlisted: 'bg-purple-100 text-purple-800',
      Selected: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      'Offer Extended': 'bg-green-200 text-green-900',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Manage Applications</h1>

            {/* Drive Selection */}
            <div className="mb-6 bg-white rounded-xl shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Drive
              </label>
              <select
                value={selectedDrive || ''}
                onChange={(e) => setSelectedDrive(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Select a drive</option>
                {drives.map((drive) => (
                  <option key={drive._id} value={drive._id}>
                    {drive.companyName} - {drive.jobRole}
                  </option>
                ))}
              </select>
            </div>

            {/* Resume Filter */}
            {applications.length > 0 && (
              <ResumeFilter
                applications={applications}
                onFilterChange={setFilteredApplications}
              />
            )}

            {loading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" text="Loading..." />
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">
                  {selectedDrive 
                    ? applications.length === 0 
                      ? 'No applications for this drive yet.' 
                      : 'No applications match your filters.'
                    : 'Select a drive to view applications.'}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredApplications.length}</span> of{' '}
                    <span className="font-semibold">{applications.length}</span> applications
                  </p>
                  <button
                    onClick={() => {
                      // Export filtered applications to CSV
                      const headers = ['Name', 'Email', 'Student ID', 'Department', 'CGPA', 'Year', 'Status', 'Current Round', 'Applied Date'];
                      const rows = filteredApplications.map(app => [
                        app.studentId?.name || 'N/A',
                        app.studentId?.email || 'N/A',
                        app.studentProfile?.studentId || 'N/A',
                        app.studentProfile?.department || 'N/A',
                        app.studentProfile?.cgpa || 'N/A',
                        app.studentProfile?.year || 'N/A',
                        app.status,
                        app.currentRound,
                        new Date(app.createdAt).toLocaleDateString()
                      ]);
                      const csvContent = [
                        headers.join(','),
                        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
                      ].join('\n');
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
                      link.click();
                      window.URL.revokeObjectURL(url);
                      success('Applications exported successfully!');
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    📊 Export Filtered Results (CSV)
                  </button>
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Department / CGPA
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Resume
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Current Round
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications.map((application) => (
                        <tr key={application._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              {application.studentProfile ? (
                                <button
                                  onClick={() => {
                                    setSelectedStudentProfile(application.studentProfile);
                                    setShowProfileModal(true);
                                  }}
                                  className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors text-left"
                                >
                                  {application.studentId?.name || 'N/A'}
                                </button>
                              ) : (
                                <p className="text-sm font-medium text-gray-900">
                                  {application.studentId?.name || 'N/A'}
                                </p>
                              )}
                              <p className="text-sm text-gray-500">
                                {application.studentId?.email || 'N/A'}
                              </p>
                              {application.studentProfile?.studentId && (
                                <p className="text-xs text-gray-400 mt-1">
                                  ID: {application.studentProfile.studentId}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm text-gray-900">
                                {application.studentProfile?.department || 'N/A'}
                              </p>
                              {application.studentProfile?.cgpa && (
                                <p className="text-sm text-gray-600">
                                  CGPA: {application.studentProfile.cgpa}
                                </p>
                              )}
                              {application.studentProfile?.year && (
                                <p className="text-xs text-gray-500">
                                  {application.studentProfile.year}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {application.studentProfile?.resumeUrl ? (
                              <a
                                href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${application.studentProfile.resumeUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                              >
                                📄 View Resume
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm">No Resume</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                                application.status
                              )}`}
                            >
                              {application.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {application.currentRound}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(application.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setStatusData({
                                    status: application.status,
                                    currentRound: application.currentRound,
                                    remarks: application.remarks || '',
                                  });
                                  setShowStatusModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 text-left"
                              >
                                Update Status
                              </button>
                              {application.status === 'Selected' && (
                                <button
                                  onClick={() => {
                                    setSelectedApplication(application);
                                    setOfferData({
                                      packageOffered: application.packageOffered || '',
                                      offerLetterFile: null,
                                    });
                                    setShowOfferModal(true);
                                  }}
                                  className="text-green-600 hover:text-green-900 text-left"
                                >
                                  Upload Offer
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Application Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusData.status}
                  onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offer Extended">Offer Extended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Round</label>
                <input
                  type="text"
                  value={statusData.currentRound}
                  onChange={(e) => setStatusData({ ...statusData, currentRound: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Technical Interview"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea
                  value={statusData.remarks}
                  onChange={(e) => setStatusData({ ...statusData, remarks: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Add remarks..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedApplication(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offer Letter Upload Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Offer Letter</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Offered
                </label>
                <input
                  type="text"
                  value={offerData.packageOffered}
                  onChange={(e) => setOfferData({ ...offerData, packageOffered: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 10 LPA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Letter (PDF/DOC)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setOfferData({ ...offerData, offerLetterFile: e.target.files[0] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleUploadOffer}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  onClick={() => {
                    setShowOfferModal(false);
                    setSelectedApplication(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {showProfileModal && selectedStudentProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Student Profile</h2>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedStudentProfile(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedStudentProfile.studentId || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedStudentProfile.department || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedStudentProfile.year || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CGPA</p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedStudentProfile.cgpa || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedStudentProfile.phone || 'N/A'}
                  </p>
                </div>
                {selectedStudentProfile.linkedin && (
                  <div>
                    <p className="text-sm text-gray-600">LinkedIn</p>
                    <a
                      href={selectedStudentProfile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Profile
                    </a>
                  </div>
                )}
                {selectedStudentProfile.github && (
                  <div>
                    <p className="text-sm text-gray-600">GitHub</p>
                    <a
                      href={selectedStudentProfile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Profile
                    </a>
                  </div>
                )}
                {selectedStudentProfile.portfolio && (
                  <div>
                    <p className="text-sm text-gray-600">Portfolio</p>
                    <a
                      href={selectedStudentProfile.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Portfolio
                    </a>
                  </div>
                )}
              </div>
              {selectedStudentProfile.address && (
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-base font-medium text-gray-900">
                    {selectedStudentProfile.address}
                  </p>
                </div>
              )}
              {selectedStudentProfile.resumeUrl && (
                <div className="pt-4 border-t border-gray-200">
                  <a
                    href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${selectedStudentProfile.resumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    📄 View Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TpoApplications;

