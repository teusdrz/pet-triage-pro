import React from 'react';
import { type LoadingState } from '../models/types';
import LoadingBar from '../components/LoadingBar';

type LoadingViewProps = {
  loadingState: LoadingState;
};

const LoadingView: React.FC<LoadingViewProps> = ({ loadingState }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
      <div className="flex items-center mb-6">
        {/* Replace with your actual pet logo/icon */}
        <span className="text-4xl">🐾</span> 
        <h1 className="text-4xl font-bold text-blue-600 ml-2">PetTriagePro</h1>
      </div>
      <p className="text-xl text-gray-700 font-medium mb-6">{loadingState.message}</p>
      <div className="w-1/2 max-w-sm">
        <LoadingBar progress={loadingState.progress} />
      </div>
    </div>
  );
};

export default LoadingView;