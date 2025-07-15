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
};

export default function TagsInput({
  label,
  currentTags = [],
  setCurrentTags,
  color,
  setColor,
}: TagsInputProps) {
  const { tags, fetchTags } = useTagsStore();

  const tagInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const [inputValue, setInputValue] = useState("");

  const { addTag } = useTagsStore();
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  const [tagsSearch, setTagsSearch] = useState<TagType[]>([]);

  useEffect(() => {
    if (inputValue.length == 0) setIsOpen(false);
    else {
      const filteredTags = tags.filter((item) => {
        const matchesSearch = item.text
          .toLocaleLowerCase()
          .includes(inputValue.toLocaleLowerCase());

        const isNotInCurrent = !currentTags.some((tag) => tag.id === item.id);

        return matchesSearch && isNotInCurrent;
      });
      setTagsSearch(filteredTags);
      setIsOpen(filteredTags.length > 0);
    }
  }, [inputValue, tags]);
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
        style={{
          width: "100%",
          minHeight: "40px",
          borderRadius: isOpen ? "16px 16px 0px 0px" : "16px 16px 16px 16px",
        }}
        className="px-[16px] bg-white border border-[#E5E7EB] py-[4px] flex items-center"
        onClick={() => {
          tagInput.current?.focus();
        }}
      >
        {/* Used Tags: */}
        <div className="flex gap-[5px] items-center flex-wrap grow">
          {currentTags.map((x) => (
            <div
              className="flex items-center gap-[5px] group cursor-default"
              key={x.id}
            >
              <span
                className="hidden group-hover:inline-block hover:cursor-pointer"
                onClick={() => {
                  setCurrentTags(currentTags.filter((item) => x.id != item.id));
                }}
              >
                <Emoji name={EMOJI.checkmarkFalse} size="14px" />
              </span>
              <Tag text={x.text} color={x.color} />
            </div>
          ))}
          <input
            ref={tagInput}
            className="flex-grow w-[30px] min-w-[30px] focus:outline-0 self-stretch"
            id={id}
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value.trim())}
            onKeyDown={async (e) => {
              if (e.key == "Enter" && inputValue !== "") {
                const result = await addTag(
                  inputValue,
                  getColorAtPosition(color)
                );
                if (result.success) {
                  setInputValue("");
                  setIsOpen(false);
                  // Додаємо новий тег у локальний currentTags
                  const newTag = tags.find(
                    (t) => t.id === result.data.toString()
                  );
                  if (newTag) {
                    setCurrentTags([...currentTags, newTag]);
                  } else {
                    // Якщо тег ще не встиг зʼявитись у tags, додаємо вручну
                    setCurrentTags([
                      ...currentTags,
                      {
                        id: result.data.toString(),
                        text: inputValue,
                        color: getColorAtPosition(color),
                      },
                    ]);
                  }
                }
              }
            }}
          />
        </div>
        <div className="shrink-0">
          <ColorSlider value={color} setValue={setColor} />
        </div>
      </div>
      {/* All Tags */}
      {isOpen && (
        <div
          style={{ width: "100%" }}
          className="border border-t-0 border-[#E5E7EB] absolute bottom-0 left-0 translate-y-full rounded-b-2xl bg-white  overflow-hidden flex flex-wrap gap-[5px] px-[16px] py-[4px]"
        >
          {tagsSearch.map((item) => (
            <span
              key={item.id}
              onClick={() => {
                setInputValue("");
                const filtredTags = currentTags.filter((x) => x.id == item.id);
                if (!filtredTags.length)
                  setCurrentTags([
                    ...currentTags,
                    { id: item.id, color: item.color, text: item.text },
                  ]);
                // linkTagsToDish(dishId, [item.id]);
              }}
            >
              <Tag color={item.color} text={item.text} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
