import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className = '', icon, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center space-x-2 px-4 py-2 font-semibold rounded-lg transition-colors duration-200 ${className}`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default Button;
