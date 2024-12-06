import React from 'react';
import Link from 'next/link';

interface SerialButtonProps {
  serialNumber: string;
  dateEntered?: string;
  className?: string;
}

export const SerialButton: React.FC<SerialButtonProps> = ({ 
  serialNumber, 
  dateEntered,
  className = '' 
}) => {
  return (
    <Link 
      href={`/unit/${serialNumber}`}
      className={`group block bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 transition-all duration-200 ${className}`}
    >
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-blue-400 group-hover:text-blue-300">
            {serialNumber}
          </span>
          <div className="h-8 w-8 rounded-full bg-blue-400/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        {dateEntered && (
          <span className="text-sm text-slate-400">
            Added: {new Date(dateEntered).toLocaleDateString()}
          </span>
        )}
      </div>
    </Link>
  );
};

SerialButton.displayName = 'SerialButton';