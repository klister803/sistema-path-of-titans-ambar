import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, children }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <span className="text-sm text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={16} />
          {error}
        </span>
      )}
    </div>
  );
};
