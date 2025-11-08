import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/api';

const StudentApplications = () => {
  const { user, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated]);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
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

  const downloadOfferLetter = (application) => {
    if (application.offerLetterUrl) {
      const url = `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${application.offerLetterUrl}`;
      window.open(url, '_blank');
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">My Applications</h1>

            {loading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" text="Loading applications..." />
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">You haven't applied to any drives yet.</p>
                <p className="text-gray-500 text-sm mt-2">
                  Browse available drives and apply to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application._id}
                    className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {application.driveId?.companyName}
                        </h3>
                        <p className="text-lg text-gray-600">{application.driveId?.jobRole}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Round</p>
                        <p className="font-medium text-gray-800">{application.currentRound}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Applied Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {application.packageOffered && (
                        <div>
                          <p className="text-sm text-gray-600">Package Offered</p>
                          <p className="font-medium text-green-600">{application.packageOffered}</p>
                        </div>
                      )}
                    </div>

                    {application.rounds && application.rounds.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Recruitment Rounds:</p>
                        <div className="space-y-2">
                          {application.rounds.map((round, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-800">{round.roundName}</p>
                                <p className="text-sm text-gray-600">{round.roundType}</p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  round.status === 'Passed'
                                    ? 'bg-green-100 text-green-800'
                                    : round.status === 'Failed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {round.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {application.offerLetterUrl && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => downloadOfferLetter(application)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          📄 Download Offer Letter
                        </button>
                      </div>
                    )}

                    {application.remarks && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700">Remarks:</p>
                        <p className="text-sm text-gray-600">{application.remarks}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentApplications;

