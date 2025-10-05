import React, { type ReactNode } from "react";
import { LoadingDots } from "./LoadingDots";
import { t } from "i18next";

interface PrimaryButtonProps {
  title: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onclick: () => void;
  loading?: boolean;
  loadingContent?: ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  type = "button",
  onclick,
  disabled,
  loading = false,
  loadingContent,
}) => {
  return (
    <button
      type={type}
      onClick={onclick}
      disabled={disabled || loading}
      className="relative w-full bg-black py-3 px-4 rounded-lg font-semibold text-white hover:bg-gray-800 transition-colors mt-6 flex items-center justify-center disabled:opacity-60"
    >
      {loading ? (
        loadingContent ?? <LoadingDots />
      ) : (
        <span className="text-center font-semibold text-[14px]">{title == 'Start Ride' ? t('Start Ride') : title}</span>
      )}

      {!loading && (
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold"
          aria-hidden="true"
        >
          →
        </span>
      )}
    </button>
  );
};

export default PrimaryButton;
