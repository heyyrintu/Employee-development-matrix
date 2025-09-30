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
    <th className="px-6 py-6 text-center text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide relative group bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 min-w-[140px]">
      <div className="flex items-center justify-center space-x-2">
        <div className="flex-1 min-w-0">
          <div className="truncate font-bold text-base" title={column.title}>
            {column.title}
          </div>
          {column.category && (
            <div className="text-sm text-gray-600 dark:text-gray-400 truncate mt-2 font-medium">
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
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-strong z-10 border border-gray-200 dark:border-gray-700 animate-slide-up">
                    <div className="py-2">
                      {onEdit && (
                        <button
                          onClick={() => {
                            onEdit();
                            setShowMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                        >
                          <Edit className="h-4 w-4 mr-3" />
                          Edit Training
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            onDelete();
                            setShowMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-150"
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          Delete Training
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
