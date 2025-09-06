import React from 'react';

interface PrimaryButtonProps {
  title: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title }) => {
  return (
    <button className="relative w-full bg-black py-3 px-4 rounded-lg font-semibold text-white hover:bg-gray-800 transition-colors mt-6 flex items-center justify-center">
      <span className="text-center">{title}</span>
      <span
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold"
        aria-hidden="true"
      >
        →
      </span>
    </button>
  );
};

export default PrimaryButton;