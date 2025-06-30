import type { TagType } from "../../pages/Dishes";

export default function Tag({ text, color }: TagType) {
  return (
    <span
      style={{ backgroundColor: color }}
      className="text-xs text-center text-white rounded-lg px-[6px] py-[4px]"
    >
      {text}
    </span>
  );
}
