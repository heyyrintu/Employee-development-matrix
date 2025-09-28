import React, { useState } from 'react';
import { X, Download, FileText, Database } from 'lucide-react';

interface ExportModalProps {
  onClose: () => void;
  onExport: (format: 'csv' | 'json') => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose, onExport }) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json'>('csv');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await onExport(selectedFormat);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Export Matrix Data
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose the format for exporting the matrix data:
              </p>

              <div className="space-y-3">
                {/* CSV Option */}
                <div
                  className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedFormat === 'csv'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedFormat('csv')}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        CSV Format
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Spreadsheet format, compatible with Excel and Google Sheets
                      </div>
                    </div>
                    <div className="ml-auto">
                      <input
                        type="radio"
                        name="format"
                        value="csv"
                        checked={selectedFormat === 'csv'}
                        onChange={() => setSelectedFormat('csv')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* JSON Option */}
                <div
                  className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedFormat === 'json'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedFormat('json')}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Database className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        JSON Format
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Structured data format, suitable for programming and APIs
                      </div>
                    </div>
                    <div className="ml-auto">
                      <input
                        type="radio"
                        name="format"
                        value="json"
                        checked={selectedFormat === 'json'}
                        onChange={() => setSelectedFormat('json')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleExport}
              disabled={loading}
              className="btn btn-primary sm:ml-3 sm:w-auto w-full flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              {loading ? 'Exporting...' : 'Export Data'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary mt-3 sm:mt-0 sm:w-auto w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
