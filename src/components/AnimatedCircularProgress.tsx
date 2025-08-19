import React, { useState, useEffect } from 'react';

// Define the component props
interface AnimatedCircularProgressProps {
  percentage: number;
  label: string;
  color: string;
}

const AnimatedCircularProgress: React.FC<AnimatedCircularProgressProps> = ({ percentage, label, color }) => {
  const [currentPercentage, setCurrentPercentage] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 1500;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);
      const newPercentage = Math.floor(progressRatio * percentage);

      setCurrentPercentage(newPercentage);

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      setCurrentPercentage(0);
    };
  }, [percentage]);

  // Aumentando o tamanho do círculo
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
          <circle
            className="text-gray-200"
            strokeWidth="5"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
          <circle
            // A cor agora é aplicada diretamente com o valor hexadecimal.
            stroke="#4285F4"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className={`text-sm font-bold text-blue-500`}>{currentPercentage}%</span>
        </div>
      </div>
      <p className="mt-4 text-center text-gray-600 font-medium">{label}</p>
    </div>
  );
};

export default AnimatedCircularProgress;
