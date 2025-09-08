// InputComponent.tsx
import React, { type InputHTMLAttributes } from "react";

interface InputComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputComponent: React.FC<InputComponentProps> = ({ label, type = "text", id, ...rest }) => {
  const inputId = id ?? `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <fieldset
      className="
        relative w-full
        border border-white/90 rounded-md
        p-0
      "
    >
      {/* Legend breaks the border automatically */}
      <legend
        className="
          ml-3 px-1.5
          text-white text-sm leading-none
        "
      >
        {label}
      </legend>

      {/* The actual input has no border; the fieldset provides it */}
      <input
        id={inputId}
        type={type}
        className="
          block w-full
          bg-transparent text-white placeholder-white/60
          outline-none
          px-4 py-2
        "
        {...rest}
      />
    </fieldset>
  );
};

export default InputComponent;
