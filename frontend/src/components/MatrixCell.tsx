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
      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-strong">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Training Level
            </label>
            <select
              value={editLevel}
              onChange={(e) => setEditLevel(Number(e.target.value))}
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {settingsState.settings?.levels.map((levelConfig) => (
                <option key={levelConfig.level} value={levelConfig.level}>
                  {levelConfig.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Add notes about this training progress..."
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-success-500 to-success-600 text-white text-sm px-4 py-2 rounded-lg hover:from-success-600 hover:to-success-700 flex items-center justify-center font-medium shadow-soft transition-all duration-200"
            >
              <Check className="h-4 w-4 mr-2" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center font-medium shadow-soft transition-all duration-200"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`matrix-cell matrix-cell-${level} relative group rounded-xl border-2 transition-all duration-200 ${
        canEdit ? 'cursor-pointer hover:scale-105 hover:shadow-medium' : 'cursor-default'
      }`}
      style={{ 
        backgroundColor: color + '20', 
        borderColor: color + '40',
        boxShadow: `0 4px 12px ${color}25`,
        minHeight: '80px',
        minWidth: '120px'
      }}
      onClick={canEdit ? onEdit : undefined}
      title={`${label}${score?.notes ? ` - ${score.notes}` : ''}`}
    >
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center w-full">
          <div 
            className="text-2xl font-bold mb-2" 
            style={{ color }}
          >
            {level}
          </div>
          <div 
            className="text-sm font-semibold leading-tight" 
            style={{ color: color + 'DD' }}
          >
            {label}
          </div>
        </div>
      </div>
      
      {canEdit && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:from-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl">
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2 shadow-soft">
            <Edit3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      )}
      
      {score?.notes && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full shadow-soft flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default MatrixCell;
