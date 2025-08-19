import React from 'react';

type LoadingBarProps = {
  progress: number;
};

const LoadingBar: React.FC<LoadingBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default LoadingBar;