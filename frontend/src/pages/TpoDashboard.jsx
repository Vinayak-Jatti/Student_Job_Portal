import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../utils/toast";
import { useDrives } from "../hooks/useDrives";
import { useDebounce } from "../hooks/useDebounce";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DriveCard from "../components/DriveCard";
import SearchAndFilter from "../components/SearchAndFilter";
import LoadingSpinner from "../components/LoadingSpinner";

const TpoDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const { drives, loading, createDrive, updateDrive, deleteDrive } =
    useDrives();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [submitting, setSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const [formData, setFormData] = useState({
    companyName: "",
    jobRole: "",
    jobDescription: "",
    eligibilityCriteria: "",
    package: "",
    location: "",
    lastDateToApply: "",
    status: "Active",
  });

  // Memoized filtered drives
  const filteredDrives = useMemo(() => {
    return drives.filter((drive) => {
      const matchesSearch =
        drive.companyName
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        drive.jobRole?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || drive.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [drives, debouncedSearch, filterStatus]);

  // Memoized stats
  const stats = useMemo(() => {
    return {
      totalDrives: drives.length,
      activeDrives: drives.filter((d) => d.status === "Active").length,
      totalStudents: 0, // Would come from API
    };
  }, [drives]);

  const handleCreateDrive = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const result = editingDrive
          ? await updateDrive(editingDrive._id, formData)
          : await createDrive(formData);

        if (result.success) {
          success(
            editingDrive
              ? "Drive updated successfully!"
              : "Drive created successfully!"
          );
          setShowCreateModal(false);
          setEditingDrive(null);
          resetForm();
        }
      } catch (error) {
        showError("An unexpected error occurred");
      } finally {
        setSubmitting(false);
      }
    },
    [editingDrive, formData, createDrive, updateDrive, success, showError]
  );

  const handleEdit = useCallback((drive) => {
    setEditingDrive(drive);
    setFormData({
      companyName: drive.companyName || "",
      jobRole: drive.jobRole || "",
      jobDescription: drive.jobDescription || "",
      eligibilityCriteria: drive.eligibilityCriteria || "",
      package: drive.package || "",
      location: drive.location || "",
      lastDateToApply: drive.lastDateToApply
        ? new Date(drive.lastDateToApply).toISOString().split("T")[0]
        : "",
      status: drive.status || "Active",
    });
    setShowCreateModal(true);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("Are you sure you want to delete this drive?")) {
        const result = await deleteDrive(id);
        if (result.success) {
          success("Drive deleted successfully!");
        }
      }
    },
    [deleteDrive, success]
  );

  const resetForm = useCallback(() => {
    setFormData({
      companyName: "",
      jobRole: "",
      jobDescription: "",
      eligibilityCriteria: "",
      package: "",
      location: "",
      lastDateToApply: "",
      status: "Active",
    });
  }, []);

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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                TPO Dashboard - {user?.name} 🎯
              </h1>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  to="/dashboard/tpo/drives"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Manage All Drives
                </Link>
                <button
                  onClick={() => {
                    setEditingDrive(null);
                    resetForm();
                    setShowCreateModal(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  + Create New Drive
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Drives
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {stats.totalDrives}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💼</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Active Drives
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {stats.activeDrives}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Students
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {stats.totalStudents}
                    </p>
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
                Manage Placement Drives ({filteredDrives.length})
              </h2>
              {loading ? (
                <div className="text-center py-12">
                  <LoadingSpinner size="lg" text="Loading drives..." />
                </div>
              ) : filteredDrives.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-gray-600 text-lg mb-4">
                    {searchTerm || filterStatus !== "all"
                      ? "No drives match your search criteria."
                      : "No drives available at the moment."}
                  </p>
                  {!searchTerm && filterStatus === "all" && (
                    <button
                      onClick={() => {
                        setEditingDrive(null);
                        resetForm();
                        setShowCreateModal(true);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Create Your First Drive
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredDrives.map((drive) => (
                    <DriveCard
                      key={drive._id}
                      drive={drive}
                      showActions={true}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingDrive ? "Edit Drive" : "Create New Drive"}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingDrive(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  disabled={submitting}
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateDrive} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.jobRole}
                    onChange={(e) =>
                      setFormData({ ...formData, jobRole: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={formData.jobDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, jobDescription: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eligibility Criteria
                </label>
                <textarea
                  value={formData.eligibilityCriteria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eligibilityCriteria: e.target.value,
                    })
                  }
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package
                  </label>
                  <input
                    type="text"
                    value={formData.package}
                    onChange={(e) =>
                      setFormData({ ...formData, package: e.target.value })
                    }
                    placeholder="e.g., 10 LPA"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    disabled={submitting}
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Date to Apply
                </label>
                <input
                  type="date"
                  value={formData.lastDateToApply}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastDateToApply: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={submitting}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Saving..."
                    : editingDrive
                    ? "Update Drive"
                    : "Create Drive"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingDrive(null);
                    resetForm();
                  }}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TpoDashboard;
