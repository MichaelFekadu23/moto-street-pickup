import React from 'react';

interface PrimaryButtonProps {
  title: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onclick: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, type = "button", onclick, disabled }) => {
  return (
    <button type={type} className="relative w-full bg-black py-3 px-4 rounded-lg font-semibold text-white hover:bg-gray-800 transition-colors mt-6 flex items-center justify-center" onClick={onclick} disabled={disabled}>
      <span className="text-center font-semibold text-[14px]">{title}</span>
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