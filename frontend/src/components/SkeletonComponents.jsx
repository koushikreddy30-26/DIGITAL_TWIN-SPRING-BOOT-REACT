import React from 'react';

export const SkeletonCard = () => (
  <div className="stat-card animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-6 bg-gray-100 rounded-full w-3/4" />
      </div>
    </div>
  </div>
);

export const SkeletonChart = () => (
  <div className="stat-card !p-6 animate-pulse">
    <div className="h-4 bg-gray-100 rounded-full w-1/3 mb-5" />
    <div className="flex items-end gap-2 h-52">
      {[60, 80, 50, 90, 70, 85, 65, 75, 55, 80].map((h, i) => (
        <div key={i} className="flex-1 bg-gray-100 rounded-t-lg" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);

export const SkeletonTable = () => (
  <div className="stat-card !p-6 animate-pulse">
    <div className="h-4 bg-gray-100 rounded-full w-1/4 mb-5" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 py-3 border-b border-gray-50">
        {[...Array(5)].map((_, j) => (
          <div key={j} className="flex-1 h-3 bg-gray-100 rounded-full" />
        ))}
      </div>
    ))}
  </div>
);

export const ErrorCard = ({ message, onRetry }) => (
  <div className="stat-card !p-12 text-center">
    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <span className="text-2xl">⚠️</span>
    </div>
    <h3 className="font-semibold text-gray-900 mb-1">Something went wrong</h3>
    <p className="text-sm text-gray-400 mb-5">{message || 'Failed to load data. Please check that the backend is running.'}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer">
        Try Again
      </button>
    )}
  </div>
);
