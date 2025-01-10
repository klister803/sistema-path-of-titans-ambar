import React from 'react';

interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  text: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  loading, 
  loadingText, 
  text 
}) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg
               hover:bg-amber-700 focus:outline-none focus:ring-2 
               focus:ring-amber-500 focus:ring-offset-2 
               disabled:opacity-50 disabled:cursor-not-allowed
               transition duration-200"
    >
      {loading ? loadingText : text}
    </button>
  );
};
