import { useId, useState, type HTMLInputTypeAttribute } from "react";
import Emoji, { EMOJI } from "../emoji/Emoji";

type InputProps = {
  label?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  placeholderEmoji?: (typeof EMOJI)[keyof typeof EMOJI];
  isBordered?: boolean;
  height?: string;
  width?: string;
  min?: number;
  max?: number;
  placeholderColor?: string;
};

export default function Input({
  label,
  type = "text",
  placeholder = "",
  placeholderEmoji,
  isBordered = true,
  height = "48px",
  width,
  min,
  max,
  placeholderColor = "#CCCCCC",
}: InputProps) {
  const id = useId();
  const [value, setValue] = useState("");

  const inputStyle =
    "box-border h-[48px] px-[16px] py-[12px] rounded-2xl w-full text-[14px]/[24px] z-10 relative bg-transparent";

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block font-medium text-[12px]/[20px] text-[#374151] mb-[5px]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          style={{
            height: height,
            width: width,
            paddingLeft: placeholderEmoji ? "42px" : "16px",
          }}
          id={id}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={
            isBordered ? `${inputStyle} border border-[#E5E7EB]` : inputStyle
          }
          min={min}
          max={max}
        />

        <div
          style={{ color: placeholderColor }}
          className="pointer-events-none absolute top-0 left-0 w-full h-full flex items-center px-[16px] text-[14px]/[24px] z-0 bg-transparent"
        >
          {placeholderEmoji && (
            <span className="mr-[10px]">
              <Emoji name={placeholderEmoji} size="14px" />
            </span>
          )}
          {value === "" && placeholder}
        </div>
      </div>
    </div>
  );
}
