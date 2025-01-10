import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(({ 
  error, 
  icon, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-gold))]">
          {icon}
        </div>
      )}
      <input
        {...props}
        ref={ref}
        className={`
          w-full bg-[rgba(var(--color-obsidian),0.5)]
          border border-[rgba(var(--color-gold),0.3)]
          rounded-lg py-2 ${icon ? 'pl-10' : 'pl-4'} pr-4
          text-white placeholder-gray-400
          focus:outline-none focus:border-[rgb(var(--color-gold))]
          transition-colors ${className}
        `}
      />
      {error && (
        <div className="mt-1 flex items-center gap-1 text-red-500">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
});

AuthInput.displayName = 'AuthInput';
