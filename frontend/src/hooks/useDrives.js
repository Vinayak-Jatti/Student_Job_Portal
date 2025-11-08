import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { useToast } from '../utils/toast';

export const useDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { error: showError } = useToast();

  const fetchDrives = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/drives');
      setDrives(response.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch drives';
      setError(errorMessage);
      showError(errorMessage);
      setDrives([]);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const createDrive = useCallback(async (driveData) => {
    try {
      const response = await api.post('/drives', driveData);
      await fetchDrives(); // Refresh list
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create drive';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchDrives, showError]);

  const updateDrive = useCallback(async (id, driveData) => {
    try {
      const response = await api.put(`/drives/${id}`, driveData);
      await fetchDrives(); // Refresh list
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update drive';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchDrives, showError]);

  const deleteDrive = useCallback(async (id) => {
    try {
      await api.delete(`/drives/${id}`);
      await fetchDrives(); // Refresh list
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete drive';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchDrives, showError]);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  return {
    drives,
    loading,
    error,
    fetchDrives,
    createDrive,
    updateDrive,
    deleteDrive,
  };
};

