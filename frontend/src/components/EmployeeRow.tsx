import React from 'react';
import { User } from 'lucide-react';
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
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      {/* Employee Info */}
      <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 px-6 py-4 whitespace-nowrap border-r border-gray-200 dark:border-gray-600">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            {employee.avatar ? (
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={employee.avatar}
                alt={employee.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center ${employee.avatar ? 'hidden' : ''}`}>
              <User className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {employee.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {employee.role}
            </div>
            {employee.department && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {employee.department}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Score Cells */}
      {columns.map((column) => {
        const score = getScore(column.id);
        const level = getLevel(column.id);
        const isEditingCell = isEditing(column.id);

        return (
          <td key={column.id} className="px-3 py-4 text-center">
            <MatrixCell
              score={score}
              level={level}
              isEditing={isEditingCell}
              onEdit={() => onCellClick(employee.id, column.id)}
              onUpdate={(newLevel, notes) => onCellUpdate(employee.id, column.id, newLevel, notes)}
              onCancel={onCellCancel}
            />
          </td>
        );
      })}
    </tr>
  );
};

export default EmployeeRow;
