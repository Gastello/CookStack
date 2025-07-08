import { useEffect, useId, useRef, useState } from "react";
import Emoji, { EMOJI } from "../emoji/Emoji";
import { useTagsStore, type TagType } from "../../store/tagsStore";
import Tag from "../tag/Tag";
import ColorSlider, { getColorAtPosition } from "../colorSlider/ColorSlider";

type TagsInputProps = {
  label?: string;
  currentTags: TagType[] | undefined;
  setCurrentTags: (tags: TagType[]) => void;
  color: number;
  setColor: (color: number) => void;
  dishId: string;
};

export default function TagsInput({
  label,
  currentTags = [],
  setCurrentTags,
  color,
  setColor,
  dishId,
}: TagsInputProps) {
  const { tags, fetchTags } = useTagsStore();

  const tagInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const [inputValue, setInputValue] = useState("");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState(
    currentTags.map((x) => ({ ...x, isSelected: true }))
  );

  const { addTag, linkTagsToDish } = useTagsStore();

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  const id = useId();

  return (
    <div
      className={`text-[14px]/[24px] text-[#1F2937] cursor-pointer select-none relative`}
    >
      {label && (
        <label
          htmlFor={id}
          className="block font-medium text-[12px]/[20px] text-[#374151] mb-[5px]"
        >
          {label}
        </label>
      )}
      <div
        style={{ width: "100%", minHeight: "40px" }}
        className={`px-[16px] bg-white border border-[#E5E7EB] py-[4px] flex items-center ${
          isOpen ? "rounded-t-2xl border-b-0" : "rounded-2xl"
        }`}
        onClick={() => {
          tagInput.current?.focus();
          // setIsOpen((prev) => !prev);
        }}
      >
        <div className="flex gap-[5px] items-center flex-wrap grow">
          {currentTags.map((x) => (
            <div
              className="flex items-center gap-[5px] group cursor-default"
              key={x.id}
            >
              <Tag text={x.text} color={x.color} />
              <span
                className="hidden group-hover:inline-block hover:cursor-pointer"
                onClick={() => {
                  setCurrentTags(currentTags.filter((item) => x.id != item.id));
                }}
              >
                <Emoji name={EMOJI.checkmarkFalse} size="14px" />
              </span>
            </div>
          ))}
          <input
            ref={tagInput}
            className="grow-1 focus:outline-0 self-stretch"
            id={id}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            onKeyDown={async (e) => {
              if (e.key == "Enter" && inputValue !== "") {
                const result = await addTag(
                  inputValue,
                  getColorAtPosition(color)
                );
                if (result.success) {
                  console.log("Tag added, id:", result.data);
                  linkTagsToDish(dishId, [result.data.toString()]);
                } else {
                  console.error("Failed to add tag:", result.data.toString);
                }
              }
            }}
          />
        </div>
        <div className="shrink-0">
          <ColorSlider value={color} setValue={setColor} />
        </div>
      </div>

      {isOpen && (
        <div
          style={{ width: "100%" }}
          className="border border-t-0 border-[#E5E7EB] absolute bottom-0 left-0 translate-y-full rounded-b-2xl bg-white  overflow-hidden"
        >
          {selectedItems.map((item) => (
            <div
              className="py-[4px] px-[16px] border-t border-[#E5E7EB] cursor-pointer hover:bg-[#E5E7EB]"
              key={item.id}
              onClick={() =>
                setSelectedItems((prev) => {
                  const res = prev.map((el) =>
                    el.id === item.id
                      ? { ...el, isSelected: !el.isSelected }
                      : el
                  );
                  return res;
                })
              }
            >
              <span className="mr-[10px]">
                {item.isSelected ? (
                  <Emoji name={EMOJI.checkmarkTrue} size="14px" />
                ) : (
                  <Emoji name={EMOJI.checkmarkFalse} size="14px" />
                )}
              </span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
