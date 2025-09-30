import React, { useState, useEffect } from 'react';
import { useMatrix } from '../contexts/MatrixContext';
import { useAuth } from '../contexts/AuthContext';
import MatrixGrid from '../components/MatrixGrid';
import AnalyticsPanel from '../components/AnalyticsPanel';
import FilterToolbar from '../components/FilterToolbar';
import EmployeeModal from '../components/EmployeeModal';
import TrainingColumnModal from '../components/TrainingColumnModal';
import ExportModal from '../components/ExportModal';
import { Plus, Download } from 'lucide-react';
import { matrixApi } from '../services/api';
import type { AnalyticsData, FilterOptions } from '../types';

const Dashboard: React.FC = () => {
  const { state: matrixState, loadMatrix, setFilters } = useMatrix();
  const { isAdmin, isManager } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // External reload trigger (e.g., after delete/update)
  useEffect(() => {
    const reload = () => loadMatrix();
    window.addEventListener('matrix:reload', reload);
    return () => window.removeEventListener('matrix:reload', reload);
  }, []);

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await matrixApi.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    };

    loadAnalytics();
  }, [matrixState.data]);

  const handleFilterChange = (filters: FilterOptions) => {
    setFilters(filters);
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      if (format === 'csv') {
        const blob = await matrixApi.exportCsv();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'matrix_export.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await matrixApi.exportJson();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'matrix_export.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (matrixState.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (matrixState.error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading matrix data</div>
        <button
          onClick={() => loadMatrix()}
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employee Development Matrix
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track training progress and skill development across your organization
          </p>
        </div>
        <div className="flex space-x-3">
          {(isAdmin() || isManager()) && (
            <>
              <button
                onClick={() => setShowEmployeeModal(true)}
                className="btn btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </button>
              <button
                onClick={() => setShowColumnModal(true)}
                className="btn btn-secondary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Training
              </button>
            </>
          )}
          <button
            onClick={() => setShowExportModal(true)}
            className="btn btn-secondary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <FilterToolbar
        onFilterChange={handleFilterChange}
        departments={matrixState.data?.employees.map(emp => emp.department).filter((dept): dept is string => Boolean(dept)) || []}
        roles={matrixState.data?.employees.map(emp => emp.role) || []}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Matrix Grid */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            <MatrixGrid
              employees={matrixState.data?.employees || []}
              columns={matrixState.data?.columns || []}
              scores={matrixState.data?.scores || []}
              settings={matrixState.data?.settings}
            />
          </div>
        </div>

        {/* Analytics Panel */}
        <div className="lg:col-span-1">
          <AnalyticsPanel data={analytics} />
        </div>
      </div>

      {/* Modals */}
      {showEmployeeModal && (
        <EmployeeModal
          onClose={() => setShowEmployeeModal(false)}
          onSuccess={() => {
            setShowEmployeeModal(false);
            loadMatrix();
          }}
        />
      )}

      {showColumnModal && (
        <TrainingColumnModal
          onClose={() => setShowColumnModal(false)}
          onSuccess={() => {
            setShowColumnModal(false);
            loadMatrix();
          }}
        />
      )}

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
        />
      )}
    </div>
  );
};

export default Dashboard;
