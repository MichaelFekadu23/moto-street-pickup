// components/InputField.tsx
import { type InputHTMLAttributes } from "react";
import type { UseFormRegister, FieldError, Path, FieldValues } from "react-hook-form";

interface InputFieldProps<TFormValues extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  label: string;
  name: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  error?: FieldError;
  rules?: Parameters<UseFormRegister<TFormValues>>[1];
}

export default function InputField<TFormValues extends FieldValues>({
  label,
  name,
  type = "text",
  id,
  rules,
  register,
  error,
  ...rest
}: InputFieldProps<TFormValues>) {
  const inputId = id ?? `field-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="w-full">
      <fieldset
        className={`relative w-full border rounded-md p-0 ${
          error ? "border-red-500" : "border-white/90"
        }`}
      >
        <legend className="ml-3 px-1.5 text-white text-sm leading-none">
          {label}
        </legend>

        <input
          id={inputId}
          type={type}
          className="block w-full bg-transparent text-white placeholder-white/60 outline-none px-4 py-2"
          {...register(name, rules)}
          {...rest}
        />
      </fieldset>

      {error && (
        <p className="text-sm text-red-400">{error.message}</p>
      )}
    </div>
  );
}
