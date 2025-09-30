import React from 'react';
import { User, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { employeeApi } from '../services/api';
import MatrixCell from './MatrixCell';
import type { Employee, TrainingColumn, MatrixCell as MatrixCellType } from '../types';

interface EmployeeRowProps {
  employee: Employee;
  columns: TrainingColumn[];
  scores: MatrixCellType[];
  onCellClick: (employeeId: number, columnId: string) => void;
  editingCell: { employeeId: number; columnId: string } | null;
  onCellUpdate: (employeeId: number, columnId: string, level: number, notes?: string) => void;
  onCellCancel: () => void;
}

const EmployeeRow: React.FC<EmployeeRowProps> = ({
  employee,
  columns,
  scores,
  onCellClick,
  editingCell,
  onCellUpdate,
  onCellCancel,
}) => {
  const { hasPermission } = useAuth();

  const handleDeleteEmployee = async () => {
    if (!hasPermission('write')) return;
    const confirmDelete = window.confirm(`Delete employee "${employee.name}"?`);
    if (!confirmDelete) return;
    try {
      await employeeApi.delete(employee.id);
      window.dispatchEvent(new CustomEvent('matrix:reload'));
    } catch (e) {
      console.error('Failed to delete employee', e);
      alert('Failed to delete employee');
    }
  };
  const getScore = (columnId: string): MatrixCellType | undefined => {
    return scores.find(score => 
      score.employee_id === employee.id && score.column_id === columnId
    );
  };

  const getLevel = (columnId: string): number => {
    const score = getScore(columnId);
    return score?.level || 0;
  };

  const isEditing = (columnId: string): boolean => {
    return editingCell?.employeeId === employee.id && editingCell?.columnId === columnId;
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 h-24">
      {/* Employee Info */}
      <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 px-6 py-4 whitespace-nowrap border-r border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-10 w-10">
              {employee.avatar ? (
                <img
                  className="h-10 w-10 rounded-full object-cover shadow-soft"
                  src={employee.avatar}
                  alt={employee.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 flex items-center justify-center shadow-soft ${employee.avatar ? 'hidden' : ''}`}>
                <User className="h-5 w-5 text-primary-600 dark:text-primary-300" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {employee.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {employee.role}
              </div>
              {employee.department && (
                <div className="text-xs text-gray-500 dark:text-gray-500 truncate">
                  {employee.department}
                </div>
              )}
            </div>
          </div>
          {hasPermission('write') && (
            <button
              aria-label="Delete employee"
              title="Delete employee"
              onClick={handleDeleteEmployee}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>

      {/* Score Cells */}
      {columns.map((column) => {
        const score = getScore(column.id);
        const level = getLevel(column.id);
        const isEditingCell = isEditing(column.id);

        return (
          <td key={column.id} className="px-4 py-6 text-center align-middle">
            <div className="flex justify-center items-center">
              <MatrixCell
                score={score}
                level={level}
                isEditing={isEditingCell}
                onEdit={() => onCellClick(employee.id, column.id)}
                onUpdate={(newLevel, notes) => onCellUpdate(employee.id, column.id, newLevel, notes)}
                onCancel={onCellCancel}
              />
            </div>
          </td>
        );
      })}
    </tr>
  );
};

export default EmployeeRow;
