import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-24 bg-gradient-to-r from-blockchain-card to-blockchain-hover rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
};

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-8">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 bg-gradient-neon rounded-full opacity-20 animate-pulse" />
      <div className="absolute inset-1 bg-gradient-neon rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="absolute inset-2 bg-gradient-neon rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.4s' }} />
    </div>
  </div>
);

export const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-gradient-crypto flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner />
      <p className="text-gray-400 mt-4 text-sm">Loading...</p>
    </div>
  </div>
);
