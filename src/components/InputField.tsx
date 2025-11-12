// components/InputField.tsx
import { t } from "i18next";
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
        className={`relative w-full border-[0.5px] p-0 ${
          error ? "border-red-500" : "border-white"
        }`}
      >
        <legend className="ml-3 px-1.5 text-white text-sm leading-none">
          {label == 'Name' ? t('Name') : t('Phone')}
        </legend>

        <input
          id={inputId}
          type={type}
          className="block w-full bg-transparent text-white placeholder-white/60 outline-none px-4 py-[7px]"
          {...register(name, rules)}
          {...rest}
        />
      </fieldset>

      {error && (
        <p className="text-sm text-red-500">{t(error.message || '')}</p>
      )}
    </div>
  );
}
