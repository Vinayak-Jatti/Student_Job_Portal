import { memo } from 'react';

const DriveCard = memo(({ drive, onEdit, onDelete, showActions = false, onApply, isApplied = false, applying = false }) => {
  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    return status === "Active" ? (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
        Active
      </span>
    ) : (
      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
        Closed
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {drive.companyName}
            </h3>
            <p className="text-lg text-gray-600 font-medium">{drive.jobRole}</p>
          </div>
          {getStatusBadge(drive.status)}
        </div>

        {drive.jobDescription && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {drive.jobDescription}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          {drive.package && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">💰</span>
              <span className="text-sm text-gray-700 font-medium">
                {drive.package}
              </span>
            </div>
          )}
          {drive.location && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">📍</span>
              <span className="text-sm text-gray-700 font-medium">
                {drive.location}
              </span>
            </div>
          )}
        </div>

        {drive.eligibilityCriteria && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Eligibility:
            </p>
            <p className="text-sm text-gray-600">{drive.eligibilityCriteria}</p>
          </div>
        )}

        {drive.lastDateToApply && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Last Date to Apply:</span>{" "}
              {formatDate(drive.lastDateToApply)}
            </p>
          </div>
        )}

        {showActions && (
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => onEdit(drive)}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(drive._id)}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              Delete
            </button>
          </div>
        )}

        {onApply && (
          <div className="pt-4 border-t border-gray-200">
            {isApplied ? (
              <button
                disabled
                className="w-full px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium text-sm cursor-not-allowed"
              >
                ✓ Applied
              </button>
            ) : (
              <button
                onClick={() => onApply(drive._id)}
                disabled={applying}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm disabled:opacity-50"
              >
                {applying ? 'Applying...' : 'Apply Now'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

DriveCard.displayName = 'DriveCard';

export default DriveCard;
