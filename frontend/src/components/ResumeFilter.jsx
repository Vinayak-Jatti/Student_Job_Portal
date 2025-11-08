import { useState } from 'react';

const ResumeFilter = ({ applications, onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    department: 'all',
    cgpaMin: '',
    cgpaMax: '',
    year: 'all',
    hasResume: 'all',
    appliedDateFrom: '',
    appliedDateTo: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Apply filters
    const filtered = applications.filter((app) => {
      const student = app.studentId;
      const profile = app.studentProfile || {};
      
      // Search filter
      if (newFilters.search) {
        const searchLower = newFilters.search.toLowerCase();
        const matchesSearch =
          student?.name?.toLowerCase().includes(searchLower) ||
          student?.email?.toLowerCase().includes(searchLower) ||
          profile?.studentId?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (newFilters.status !== 'all' && app.status !== newFilters.status) {
        return false;
      }

      // Department filter
      if (newFilters.department !== 'all' && profile?.department !== newFilters.department) {
        return false;
      }

      // CGPA filter
      if (newFilters.cgpaMin) {
        const cgpa = parseFloat(profile?.cgpa) || 0;
        if (cgpa < parseFloat(newFilters.cgpaMin)) return false;
      }
      if (newFilters.cgpaMax) {
        const cgpa = parseFloat(profile?.cgpa) || 0;
        if (cgpa > parseFloat(newFilters.cgpaMax)) return false;
      }

      // Year filter
      if (newFilters.year !== 'all' && profile?.year !== newFilters.year) {
        return false;
      }

      // Resume filter
      if (newFilters.hasResume === 'yes' && !profile?.resumeUrl) {
        return false;
      }
      if (newFilters.hasResume === 'no' && profile?.resumeUrl) {
        return false;
      }

      // Date range filter
      if (newFilters.appliedDateFrom) {
        const appliedDate = new Date(app.createdAt);
        const fromDate = new Date(newFilters.appliedDateFrom);
        if (appliedDate < fromDate) return false;
      }
      if (newFilters.appliedDateTo) {
        const appliedDate = new Date(app.createdAt);
        const toDate = new Date(newFilters.appliedDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (appliedDate > toDate) return false;
      }

      return true;
    });

    onFilterChange(filtered);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      status: 'all',
      department: 'all',
      cgpaMin: '',
      cgpaMax: '',
      year: 'all',
      hasResume: 'all',
      appliedDateFrom: '',
      appliedDateTo: '',
    };
    setFilters(defaultFilters);
    onFilterChange(applications);
  };

  const getUniqueDepartments = () => {
    const departments = new Set();
    applications.forEach((app) => {
      if (app.studentProfile?.department) {
        departments.add(app.studentProfile.department);
      }
    });
    return Array.from(departments).sort();
  };

  const getUniqueYears = () => {
    const years = new Set();
    applications.forEach((app) => {
      if (app.studentProfile?.year) {
        years.add(app.studentProfile.year);
      }
    });
    return Array.from(years).sort();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">🔍 Resume Filter</h2>
          <span className="text-sm text-gray-500">
            Filter {applications.length} applications
          </span>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Quick Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or student ID..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer Extended">Offer Extended</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
              >
                <option value="all">All Departments</option>
                {getUniqueDepartments().map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
              >
                <option value="all">All Years</option>
                {getUniqueYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Resume Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume
              </label>
              <select
                value={filters.hasResume}
                onChange={(e) => handleFilterChange('hasResume', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
              >
                <option value="all">All</option>
                <option value="yes">Has Resume</option>
                <option value="no">No Resume</option>
              </select>
            </div>

            {/* CGPA Min */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CGPA Min
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder="0.0"
                value={filters.cgpaMin}
                onChange={(e) => handleFilterChange('cgpaMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            {/* CGPA Max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CGPA Max
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder="10.0"
                value={filters.cgpaMax}
                onChange={(e) => handleFilterChange('cgpaMax', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            {/* Applied Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applied From
              </label>
              <input
                type="date"
                value={filters.appliedDateFrom}
                onChange={(e) => handleFilterChange('appliedDateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            {/* Applied Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applied To
              </label>
              <input
                type="date"
                value={filters.appliedDateTo}
                onChange={(e) => handleFilterChange('appliedDateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeFilter;





