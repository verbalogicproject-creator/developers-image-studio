import React, { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  options: { value: string; label: string; description?: string }[] | string[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span>{label}</span>
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={twMerge(
              clsx(
                "w-full h-11 pl-3.5 pr-10 appearance-none rounded-xl text-sm font-medium bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500",
                "focus:outline-none focus:ring-1 focus:ring-amber-500/80 focus:border-amber-500/80",
                "hover:border-zinc-700 transition-colors cursor-pointer",
                className
              )
            )}
            {...props}
          >
            {options.map((opt) => {
              const val = typeof opt === "string" ? opt : opt.value;
              const lbl = typeof opt === "string" ? opt : opt.label;
              return (
                <option key={val} value={val} className="bg-zinc-900 text-zinc-100 py-2">
                  {lbl}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {helperText && (
          <p className="text-[11px] text-zinc-500 leading-tight">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
