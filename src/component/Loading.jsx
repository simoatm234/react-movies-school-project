import React from 'react';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading resources...
        </p>
      </div>
    </div>
  );
}
