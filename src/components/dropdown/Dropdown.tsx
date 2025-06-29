import { useState } from "react";
import Emoji, { EMOJI } from "../emoji/Emoji";

type DropdownProps = {
    placeholder: string;
  items: string[];
  multiple?: boolean;
  width?: string;
};

export default function Dropdown({ items, placeholder, width = "230px" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState(
    Object.fromEntries(items.map((x) => [x, false]))
  );
  return (
    <div
      className={`text-[14px]/[24px] text-[#1F2937] cursor-pointer select-none relative`}
    >
      <div
        style={{ width: width }}
        className={`h-[48px] px-[16px] py-[12px] bg-white border border-[#E5E7EB] ${
          isOpen ? "rounded-t-2xl border-b-0" : "rounded-2xl"
        }`}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <span className="mr-[10px]">
          <Emoji name={EMOJI.memo} size="14px" />
        </span>
        {placeholder}
      </div>
      {isOpen && (
        <div
          style={{ width: width }}
          className="border border-t-0 border-[#E5E7EB] absolute bottom-0 left-0 translate-y-full rounded-b-2xl bg-white  overflow-hidden"
        >
          {Object.entries(selectedItems).map(([item, isSelected]) => (
            <div
              className="py-[4px] px-[16px] border-t border-[#E5E7EB] cursor-pointer hover:bg-[#E5E7EB]"
              key={item}
              onClick={() =>
                setSelectedItems((prev) => ({
                  ...prev,
                  [item]: !prev[item],
                }))
              }
            >
              <span className="mr-[10px]">
                {isSelected ? (
                  <Emoji name={EMOJI.checkmarkTrue} size="14px" />
                ) : (
                  <Emoji name={EMOJI.checkmarkFalse} size="14px" />
                )}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
