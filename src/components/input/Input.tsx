import { useId, type HTMLInputTypeAttribute } from "react";

type InputProps = {
  label?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  isBordered?: boolean;
};

export default function Input({
  label,
  type = "text",
  placeholder = "",
  isBordered = true,
}: InputProps) {
  const id = useId();
  const inputStyle =
    "px-[16px] py-[12px] bg-white rounded-2xl w-full placeholder:text-[16px]/[24px] placeholder:text-[#CCCCCC]";
    
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
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={
          isBordered ? `border border-[#E5E7EB] ${inputStyle}` : inputStyle
        }
      />
    </div>
  );
}
