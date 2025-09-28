import React from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { TrainingColumn } from '../types';

interface MatrixHeaderProps {
  column: TrainingColumn;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MatrixHeader: React.FC<MatrixHeaderProps> = ({
  column,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider relative group">
      <div className="flex items-center justify-center space-x-1">
        <div className="flex-1 min-w-0">
          <div className="truncate" title={column.title}>
            {column.title}
          </div>
          {column.category && (
            <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
              {column.category}
            </div>
          )}
        </div>
        
        {(onEdit || onDelete) && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                <div className="py-1">
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit();
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete();
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </th>
  );
};

export default MatrixHeader;
