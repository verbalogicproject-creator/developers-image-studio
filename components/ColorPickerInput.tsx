import React from "react";
import { Palette, Check } from "lucide-react";
import { hexColorRegex } from "@/lib/schema";

interface ColorPickerInputProps {
  value: string;
  onChange: (hex: string) => void;
}

const PRESET_COLORS = [
  { name: "Cashmere", hex: "#E8DFD8" },
  { name: "Gold Leaf", hex: "#D4AF37" },
  { name: "Amber Ochre", hex: "#D97706" },
  { name: "Vintage Wine", hex: "#722F37" },
  { name: "Obsidian Slate", hex: "#1E293B" },
  { name: "Digital Neo", hex: "#6366F1" },
  { name: "Botanical Olive", hex: "#65A30D" },
];

export const ColorPickerInput: React.FC<ColorPickerInputProps> = ({
  value,
  onChange,
}) => {
  const isValidHex = hexColorRegex.test(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("#") && val.length > 0) {
      val = `#${val}`;
    }
    onChange(val);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-500" />
          Brand Color Injector
        </span>
        <span className="text-[11px] font-mono text-zinc-400">
          {isValidHex ? value.toUpperCase() : "Optional"}
        </span>
      </label>

      <div className="flex items-center gap-2">
        {/* Color swatch trigger */}
        <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-zinc-700/80 flex-shrink-0 cursor-pointer shadow-inner">
          <input
            type="color"
            value={isValidHex ? value : "#E8DFD8"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0"
            title="Pick a color"
          />
          <div
            className="w-full h-full"
            style={{
              backgroundColor: isValidHex ? value : "#E8DFD8",
            }}
          />
        </div>

        {/* Text hex input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="#E8DFD8"
            maxLength={7}
            className="w-full h-11 px-3.5 font-mono text-sm uppercase rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/80 focus:border-amber-500/80 transition-colors"
          />
        </div>
      </div>

      {/* Preset Swatches */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        {PRESET_COLORS.map((preset) => {
          const isSelected = value.toLowerCase() === preset.hex.toLowerCase();
          return (
            <button
              key={preset.hex}
              type="button"
              onClick={() => onChange(preset.hex)}
              title={`${preset.name} (${preset.hex})`}
              className={`group relative flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] border transition-all ${
                isSelected
                  ? "bg-zinc-800 border-amber-500/80 text-amber-300 font-medium"
                  : "bg-zinc-900/80 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: preset.hex }}
              />
              <span>{preset.name}</span>
              {isSelected && <Check className="w-3 h-3 text-amber-500 ml-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
