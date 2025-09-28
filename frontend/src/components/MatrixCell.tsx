import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Edit3, Check, X } from 'lucide-react';
import type { MatrixCell as MatrixCellType } from '../types';

interface MatrixCellProps {
  score?: MatrixCellType;
  level: number;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (level: number, notes?: string) => void;
  onCancel: () => void;
  canEdit?: boolean;
}

const MatrixCell: React.FC<MatrixCellProps> = ({
  score,
  level,
  isEditing,
  onEdit,
  onUpdate,
  onCancel,
  canEdit = true,
}) => {
  const { getLevelColor, getLevelLabel, state: settingsState } = useSettings();
  const [editLevel, setEditLevel] = useState(level);
  const [editNotes, setEditNotes] = useState(score?.notes || '');

  const handleSave = () => {
    onUpdate(editLevel, editNotes);
  };

  const handleCancel = () => {
    setEditLevel(level);
    setEditNotes(score?.notes || '');
    onCancel();
  };

  const color = getLevelColor(level);
  const label = getLevelLabel(level);

  if (isEditing) {
    return (
      <div className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Level
            </label>
            <select
              value={editLevel}
              onChange={(e) => setEditLevel(Number(e.target.value))}
              className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {settingsState.settings?.levels.map((levelConfig) => (
                <option key={levelConfig.level} value={levelConfig.level}>
                  {levelConfig.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={2}
              placeholder="Add notes..."
            />
          </div>
          <div className="flex space-x-1">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700 flex items-center justify-center"
            >
              <Check className="h-3 w-3 mr-1" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-600 text-white text-xs px-2 py-1 rounded hover:bg-gray-700 flex items-center justify-center"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`matrix-cell matrix-cell-${level} relative group ${
        canEdit ? 'cursor-pointer' : 'cursor-default'
      }`}
      style={{ backgroundColor: color + '20', borderColor: color + '40' }}
      onClick={canEdit ? onEdit : undefined}
      title={`${label}${score?.notes ? ` - ${score.notes}` : ''}`}
    >
      <div className="flex items-center justify-center h-full">
        <span className="text-sm font-medium" style={{ color }}>
          {level}
        </span>
      </div>
      
      {canEdit && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="h-3 w-3 text-gray-600" />
        </div>
      )}
      
      {score?.notes && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
};

export default MatrixCell;
