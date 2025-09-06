import React from 'react';

interface InputFieldProps {
  type: string;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({ type, placeholder }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full p-3 bg-transparent border border-white rounded-lg text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
    />
  );
};

export default InputField;