import React from "react";
import { clsx } from "clsx";

export interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={clsx(
        "flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none",
        checked
          ? "bg-amber-500/10 border-amber-500/30 text-amber-100"
          : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700/80",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex flex-col pr-4">
        <span className="text-xs font-semibold tracking-wide">{label}</span>
        {description && (
          <span className="text-[11px] text-zinc-400 mt-0.5 leading-tight">
            {description}
          </span>
        )}
      </div>

      <div
        className={clsx(
          "w-11 h-6 rounded-full transition-colors relative flex-shrink-0 p-0.5",
          checked ? "bg-amber-500" : "bg-zinc-700"
        )}
      >
        <div
          className={clsx(
            "w-5 h-5 rounded-full bg-zinc-950 transition-transform duration-200 ease-out shadow-sm",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </div>
    </div>
  );
};
