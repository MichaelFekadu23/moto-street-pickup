// components/InputField.tsx
import type { FieldError, UseFormRegister, Path, RegisterOptions } from "react-hook-form";

interface InputFieldProps<T extends Record<string, any> = any> {
  id: Path<T>;
  type?: string;
  label: string;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: FieldError;
  className?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
}

export default function InputField<T extends Record<string, any> = any>({
  id, type = "text", label, register, rules, error, className, inputMode
}: InputFieldProps<T>) {
  return (
    <div className={`w-full ${className ?? ""}`}>
      <div className="relative">
        {/* your existing border/label UI here */}
        <label htmlFor={id} className="absolute -top-2 left-3 z-10 px-1 text-[13px] leading-none text-white/85">
          {label}
        </label>

        <input
          id={id}
          type={type}
          inputMode={inputMode}
          className="w-full rounded-[6px] bg-transparent px-3 py-3 outline-none"
          {...register(id, rules)}
        />
      </div>

      {/* error shown BELOW input */}
      {error?.message && (
        <p className="mt-1 text-xs text-red-400">{error.message}</p>
      )}
    </div>
  );
}
