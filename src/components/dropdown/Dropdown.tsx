import { useState } from "react";
import Emoji, { EMOJI } from "../emoji/Emoji";

type DropdownProps = {
  items: string[];
  multiple?: boolean;
  width?: string;
};

export default function Dropdown({ items, width = "230px" }: DropdownProps) {
  const dropdownStyle =
    "rounded-2xl bg-white text-[14px]/[24px] text-[#1F2937] cursor-pointer border border-[#E5E7EB] overflow-hidden select-none";

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState(
    Object.fromEntries(items.map((x) => [x, false]))
  );
  console.log(items.map((x) => [x, false]));
  console.log(selectedItems);
  return (
    <div className={dropdownStyle}>
      <div
        style={{ width: width }}
        className="h-[48px] px-[16px] py-[12px]"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <span className="mr-[10px]">
          <Emoji name={EMOJI.memo} size="14px" />
        </span>
        Choose groups
      </div>
      {isOpen && (
        <div>
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
