import React, { useState } from 'react';
import { useMatrix } from '../contexts/MatrixContext';
import { useAuth } from '../contexts/AuthContext';
import MatrixHeader from './MatrixHeader';
import EditTrainingColumnModal from './EditTrainingColumnModal';
import { columnApi } from '../services/api';
import EmployeeRow from './EmployeeRow';
import type { Employee, TrainingColumn, MatrixCell as MatrixCellType } from '../types';

interface MatrixGridProps {
  employees: Employee[];
  columns: TrainingColumn[];
  scores: MatrixCellType[];
  settings?: any;
}

const MatrixGrid: React.FC<MatrixGridProps> = ({
  employees,
  columns,
  scores,
}) => {
  const { updateScore } = useMatrix();
  const { hasPermission } = useAuth();
  const [editingCell, setEditingCell] = useState<{ employeeId: number; columnId: string } | null>(null);
  const [editingColumn, setEditingColumn] = useState<TrainingColumn | null>(null);
  const [, setBusy] = useState<string | null>(null);
  const [, setMessage] = useState<string | null>(null);

  const handleCellClick = (employeeId: number, columnId: string) => {
    if (hasPermission('write')) {
      setEditingCell({ employeeId, columnId });
    }
  };

  const handleCellUpdate = async (employeeId: number, columnId: string, level: number, notes?: string) => {
    try {
      await updateScore(employeeId, columnId, level, notes);
      setEditingCell(null);
    } catch (error) {
      console.error('Failed to update score:', error);
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
  };


  if (employees.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          No employees found. Add some employees to get started.
        </div>
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          No training columns found. Add some training modules to get started.
        </div>
      </div>
    );
  }

      return (
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-soft rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
              <tr>
                <th className="sticky left-0 z-10 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-6 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide border-r border-gray-200 dark:border-gray-600 min-w-[200px]">
                  Employee
                </th>
                {columns.map((column) => (
                  <MatrixHeader
                    key={column.id}
                    column={column}
                    onEdit={hasPermission('write') ? () => setEditingColumn(column) : undefined}
                    onDelete={hasPermission('write') ? async () => {
                      try {
                        setBusy(`delete-col-${column.id}`);
                        await columnApi.delete(column.id);
                        // Optimistic reload: Ask parent/context to reload matrix via window event
                        setMessage('Column deleted');
                        window.dispatchEvent(new CustomEvent('matrix:reload'));
                      } catch (e) {
                        console.error(e);
                        setMessage('Failed to delete column');
                      } finally {
                        setBusy(null);
                        setTimeout(() => setMessage(null), 2000);
                      }
                    } : undefined}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {employees.map((employee) => (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  columns={columns}
                  scores={scores}
                  onCellClick={handleCellClick}
                  editingCell={editingCell}
                  onCellUpdate={handleCellUpdate}
                  onCellCancel={handleCellCancel}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingColumn && (
        <EditTrainingColumnModal
          column={editingColumn}
          onClose={() => setEditingColumn(null)}
          onSuccess={() => {
            setEditingColumn(null);
            setMessage('Column updated');
            window.dispatchEvent(new CustomEvent('matrix:reload'));
            setTimeout(() => setMessage(null), 1500);
          }}
        />
      )}
    </div>
  );
};

export default MatrixGrid;
