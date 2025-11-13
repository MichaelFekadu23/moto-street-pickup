import React, { type ReactNode } from "react";
import { LoadingDots } from "./LoadingDots";
import { t } from "i18next";
import rightArrow from "../assets/right-arrow.svg"

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
      className="w-full bg-black py-3 px-4 font-semibold text-white hover:bg-gray-800 transition-colors mt-6 flex items-center justify-center disabled:opacity-60"
    >
      {loading ? (
        loadingContent ?? <LoadingDots />
      ) : (
        <div className="relative w-full flex items-center justify-center">
          <span className="mx-auto font-semibold text-[14px]">
            {title == "Start Ride" ? t("Start Ride") : title}
          </span>

          {/* ↓↓↓ ONLY change: replace → with lucide-react ArrowRight ↓↓↓ */}
          <span
            className="absolute right-0 ml-2 flex items-center justify-center"
            aria-hidden="true"
          >
            <img src={rightArrow} alt="Right Arrow" />
          </span>
          {/* ↑↑↑ ONLY this part changed ↑↑↑ */}
        </div>
      )}
    </button>
  );
};

export default PrimaryButton;
