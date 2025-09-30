import React from 'react';
import { Calculator } from 'lucide-react';

interface TotalScoreCellProps {
  totalScore: number;
  maxPossibleScore: number;
}

const TotalScoreCell: React.FC<TotalScoreCellProps> = ({ totalScore, maxPossibleScore }) => {
  const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  
  // Color based on percentage
  const getColor = (percentage: number) => {
    if (percentage >= 80) return '#10b981'; // Green
    if (percentage >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const color = getColor(percentage);

  return (
    <div
      className="relative group rounded-xl border-2 transition-all duration-200 cursor-default"
      style={{ 
        backgroundColor: color + '20', 
        borderColor: color + '40',
        boxShadow: `0 4px 12px ${color}25`,
        minHeight: '80px',
        minWidth: '120px'
      }}
      title={`Total Score: ${totalScore}/${maxPossibleScore} (${percentage}%)`}
    >
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center w-full">
          <div className="flex items-center justify-center mb-2">
            <Calculator className="h-5 w-5 mr-2" style={{ color }} />
            <div 
              className="text-2xl font-bold" 
              style={{ color }}
            >
              {totalScore}
            </div>
          </div>
          <div 
            className="text-sm font-semibold leading-tight" 
            style={{ color: color + 'DD' }}
          >
            Total Score
          </div>
          <div 
            className="text-xs font-medium mt-1" 
            style={{ color: color + 'CC' }}
          >
            {percentage}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalScoreCell;
