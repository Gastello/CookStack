import { useEffect, useId, useState, type HTMLInputTypeAttribute } from "react";
import Emoji, { EMOJI } from "../emoji/Emoji";

type InputProps = {
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
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
  textColor?: string;
  isTextArea?: boolean;
  startValue?: string;
  textSize?: string;
};

export default function Input({
  onChange = () => {},
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
  textColor = "#374151",
  isTextArea = false,
  startValue,
  textSize = "14px",
}: InputProps) {
  const id = useId();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (startValue) setValue(startValue);
  }, [startValue]);
  const inputStyle =
    "box-border px-[16px] rounded-2xl w-full z-10 relative bg-transparent";

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
        {isTextArea ? (
          <textarea
            onChange={(e) => {
              setValue(e.target.value);
              onChange(e);
            }}
            style={{
              height: height,
              width: width,
              color: textColor,
              padding: "10px 16px",
              fontSize: textSize,
            }}
            id={id}
            value={value}
            className={
              isBordered ? `${inputStyle} border border-[#E5E7EB]` : inputStyle
            }
          />
        ) : (
          <>
            <input
              onChange={(e) => {
                setValue(e.target.value);
                onChange(e);
              }}
              style={{
                height: height,
                width: width,
                paddingLeft: placeholderEmoji ? "40px" : "16px",
                color: textColor,
                fontSize: textSize,
              }}
              id={id}
              type={type}
              value={value}
              className={
                isBordered
                  ? `${inputStyle} border border-[#E5E7EB]`
                  : inputStyle
              }
              min={min}
              max={max}
            />
            <div
              style={{ color: placeholderColor, fontSize: textSize }}
              className="pointer-events-none absolute top-0 left-0 w-full h-full flex items-center px-[16px] z-0 bg-white rounded-2xl"
            >
              {placeholderEmoji && (
                <span className="mr-[10px]">
                  <Emoji name={placeholderEmoji} size="14px" />
                </span>
              )}
              <span className="pr-[16px] text-nowrap overflow-hidden">
                {value === "" && placeholder}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
