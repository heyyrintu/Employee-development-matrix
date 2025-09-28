import React, { useState } from 'react';
import { useMatrix } from '../contexts/MatrixContext';
import { useAuth } from '../contexts/AuthContext';
import MatrixHeader from './MatrixHeader';
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
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                  Employee
                </th>
                {columns.map((column) => (
                  <MatrixHeader
                    key={column.id}
                    column={column}
                    onEdit={hasPermission('write') ? () => {} : undefined}
                    onDelete={hasPermission('write') ? () => {} : undefined}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
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
    </div>
  );
};

export default MatrixGrid;
