import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  register: any;
  name: string;
  placeholder?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  register, 
  name, 
  placeholder = "••••••••" 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        {...register(name)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                 focus:border-amber-500 focus:ring focus:ring-amber-200"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};
