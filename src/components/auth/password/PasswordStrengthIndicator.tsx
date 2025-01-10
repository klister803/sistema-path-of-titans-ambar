import React from 'react';
import { calculatePasswordStrength } from '../../../lib/utils/passwordUtils';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const { score, feedback } = calculatePasswordStrength(password);
  
  const getColorClass = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getColorClass()}`}
          style={{ width: `${score}%` }}
        />
      </div>
      
      <div className="flex justify-between text-sm">
        <span className={`font-medium ${getColorClass().replace('bg-', 'text-')}`}>
          Força: {score}%
        </span>
      </div>
      
      {feedback.length > 0 && (
        <ul className="text-sm text-red-500 space-y-1">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              <span>•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
